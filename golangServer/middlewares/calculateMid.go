// calculateMid.go

package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
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

	// 输出文件路径
	currentTime := time.Now()
	outputFolderName := currentTime.Format("20060102150405")

	outputDirectory := `E:\EnergyPlus\output\` + outputFolderName

	err1 := os.MkdirAll(outputDirectory, os.ModePerm)
	if err1 != nil {
		log.Println("Error creating output directory:", err1)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	energyPlusExec := `E:\EnergyPlus\energyplus.exe`
	inputidfFilePath := IDFPath.(string)
	inputepwFilePath := EPWPath.(string)

	cmd := exec.Command(energyPlusExec, "-d", outputDirectory, "-w", inputepwFilePath, "-r", inputidfFilePath)

	// 启动 EnergyPlus 进程
	if err := cmd.Start(); err != nil {
		log.Println("Error starting EnergyPlus:", err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	func() {
		// 等待 EnergyPlus 进程完成
		if err := cmd.Wait(); err != nil {
			log.Println("Error waiting for EnergyPlus:", err)
			return
		}

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
