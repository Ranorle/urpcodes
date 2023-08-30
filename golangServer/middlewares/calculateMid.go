// calculateMid.go

package middlewares

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"golangServer/mysql"
	"golangServer/types"
	"log"
	"net/http"
	"os"
	"os/exec"
	"time"
)

func CalculateMid(c *gin.Context) {
	// 从上下文中获取 WebSocket 连接对象
	conn, exists := c.Get("websocket_conn")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "WebSocket connection not found"})
		c.Abort()
		return
	}

	IDFPath, exists := c.Get("IDFPath")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "IDFName not found"})
		c.Abort()
		return
	}

	EPWPath, exists := c.Get("EPWPath")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "EPWName not found"})
		c.Abort()
		return
	}

	// 断言连接对象的类型为 *websocket.Conn
	wsConn, ok := conn.(*websocket.Conn)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid WebSocket connection"})
		c.Abort()
		return
	}

	var baseinfo []types.BaseInfoType

	err := mysql.QueryAllData("baseinfo", &baseinfo)
	if err != nil {
		// 处理错误，可以发送适当的错误响应给客户端
		c.JSON(500, gin.H{
			"error": "Internal Server Error",
		})
		return
	}

	// 输出文件路径
	currentTime := time.Now()
	outputFolderName := currentTime.Format("20060102150405")

	energyPlusExec := baseinfo[0].EnergyPlusExec

	outputDirectory := baseinfo[0].OutputDirectory + outputFolderName

	err1 := os.MkdirAll(outputDirectory, os.ModePerm)
	if err1 != nil {
		log.Println("Error creating output directory:", err1)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	inputidfFilePath := IDFPath.(string)
	inputepwFilePath := EPWPath.(string)

	func() {
		calculateFunc(c, wsConn, energyPlusExec, outputDirectory, inputepwFilePath, inputidfFilePath)

		msg := "output successful"
		if err := wsConn.WriteMessage(websocket.TextMessage, []byte(msg)); err != nil {
			log.Println("Error sending message:", err)
			return
		}
		c.Set("outputDirectory", outputDirectory)
		c.Set("outputFolderName", outputFolderName)

		c.Next()
	}()

}

func calculateFunc(c *gin.Context, wsConn *websocket.Conn, energyPlusExec string, outputDirectory string, inputepwFilePath string, inputidfFilePath string) {
	// 构建R脚本，使用传递的参数
	rScript := fmt.Sprintf(`
	library(eplusr)
	use_eplus("%s")
	path_idf <- "%s"
	path_epw <- "%s"
	model <- read_idf(path_idf)
	job <- model$run(path_epw, dir = "%s" , wait = TRUE)
	job
	`, energyPlusExec, inputidfFilePath, inputepwFilePath, outputDirectory)

	// 将rScript写入到文件
	rScriptFilePath := "../eplusrhandler/main.R"
	err := os.WriteFile(rScriptFilePath, []byte(rScript), 0644)
	if err != nil {
		log.Println("Error writing R script to file:", err)
		err1 := wsConn.WriteMessage(websocket.TextMessage, []byte(err.Error()))
		if err1 != nil {
			log.Println("Error sending message:", err1)
		}
		c.Abort()
		return
	}

	// 创建一个带有R脚本的临时文件
	cmd := exec.Command("Rscript", rScriptFilePath)
	// 执行R脚本
	output, err := cmd.Output()
	if err != nil {
		log.Println(string(output))
		err1 := wsConn.WriteMessage(websocket.TextMessage, []byte(err.Error()))
		if err1 != nil {
			log.Println("Error sending message:", err1)
		}
		c.Abort()
	} else {
		err1 := wsConn.WriteMessage(websocket.TextMessage, output)
		if err1 != nil {
			log.Println("Error sending message:", err1)
		}
		log.Println(string(output))
		log.Println("修改IDF文件成功")
	}
}
