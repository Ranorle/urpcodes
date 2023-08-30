package idfHandler

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"log"
	"os/exec"
)

func SetRunPeriod(c *gin.Context, wsConn *websocket.Conn, energyPlusExec string, dataMap map[string]interface{}, IDFPath string) {

	RunPeroidName := Getkey(c, wsConn, "RunPeroidName", dataMap)
	BeginMonth := Getkey(c, wsConn, "BeginMonth", dataMap)
	BeginDayOfMonth := Getkey(c, wsConn, "BeginDayOfMonth", dataMap)
	EndMonth := Getkey(c, wsConn, "EndMonth", dataMap)
	EndDayOfMonth := Getkey(c, wsConn, "EndDayOfMonth", dataMap)

	// 构建R脚本，使用传递的参数
	rScript := fmt.Sprintf(`
		library(eplusr)
		use_eplus("%s")
		path <- "%s"
		model <- read_idf(path)
		model$set(.("%s") := .(..2 = %s, ..3 = %s, ..5 = %s, ..6 = %s))
		model$objects(c("%s"))
		model$save(overwrite = TRUE)
	`, energyPlusExec, IDFPath, RunPeroidName, BeginMonth, BeginDayOfMonth, EndMonth, EndDayOfMonth, RunPeroidName)

	// 创建一个带有R脚本的临时文件
	cmd := exec.Command("Rscript", "-e", rScript)

	// 执行R脚本
	output, err := cmd.CombinedOutput()
	if err != nil {
		if err1 := wsConn.WriteMessage(websocket.TextMessage, output); err1 != nil {
			log.Println("Error sending message:", err1)
			return
		}
		c.Abort()
	}
}

func AddRunPeriod(c *gin.Context, wsConn *websocket.Conn, energyPlusExec string, dataMap map[string]interface{}, IDFPath string) {

	RunPeroidName := Getkey(c, wsConn, "RunPeroidName", dataMap)
	BeginMonth := Getkey(c, wsConn, "BeginMonth", dataMap)
	BeginDayOfMonth := Getkey(c, wsConn, "BeginDayOfMonth", dataMap)
	EndMonth := Getkey(c, wsConn, "EndMonth", dataMap)
	EndDayOfMonth := Getkey(c, wsConn, "EndDayOfMonth", dataMap)

	// 构建R脚本，使用传递的参数
	rScript := fmt.Sprintf(`
		library(eplusr)
		use_eplus("%s")
		path <- "%s"
		model <- read_idf(path)

		model$add( RunPeriod = .(
		name = "%s", ..2 = %s, ..3 = %s, ..5 = %s, ..6 = %s)
		)
		model$objects(c("%s"))
		model$save(overwrite = TRUE)
	`, energyPlusExec, IDFPath, RunPeroidName, BeginMonth, BeginDayOfMonth, EndMonth, EndDayOfMonth, RunPeroidName)

	// 创建一个带有R脚本的临时文件
	cmd := exec.Command("Rscript", "-e", rScript)

	// 执行R脚本
	output, err := cmd.CombinedOutput()
	if err != nil {
		if err1 := wsConn.WriteMessage(websocket.TextMessage, output); err1 != nil {
			log.Println("Error sending message:", err1)
			return
		}
		c.Abort()
	}
}

func DeleteRunPeriod(c *gin.Context, wsConn *websocket.Conn, energyPlusExec string, dataMap map[string]interface{}, IDFPath string) {

	RunPeroidName := Getkey(c, wsConn, "RunPeroidName", dataMap)

	// 构建R脚本，使用传递的参数
	rScript := fmt.Sprintf(`
		library(eplusr)
		use_eplus("%s")
		path <- "%s"
		model <- read_idf(path)
		model$del("%s")
		model$save(overwrite = TRUE)
	`, energyPlusExec, IDFPath, RunPeroidName)

	// 创建一个带有R脚本的临时文件
	cmd := exec.Command("Rscript", "-e", rScript)

	// 执行R脚本
	output, err := cmd.CombinedOutput()
	if err != nil {
		if err1 := wsConn.WriteMessage(websocket.TextMessage, output); err1 != nil {
			log.Println("Error sending message:", err1)
			return
		}
		c.Abort()
	}
}
