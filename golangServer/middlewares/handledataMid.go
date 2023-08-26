package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"golangServer/csvhandler"
	"golangServer/mysql"
	"log"
	"net/http"
)

func HandleDataMid(c *gin.Context) {
	conn, exists := c.Get("websocket_conn")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "WebSocket connection not found"})
		c.Abort()
		return
	}

	// 断言连接对象的类型为 *websocket.Conn
	// 断言连接对象的类型为 *websocket.Conn
	wsConn, ok := conn.(*websocket.Conn)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid WebSocket connection"})
		c.Abort()
		return
	}

	// 从上下文中获取 outputDirectory
	outputDirectory, exists := c.Get("outputDirectory")
	if !exists {
		// 使用 WebSocket 发送错误消息
		errMsg := "outputDirectory not found in context"
		if err := wsConn.WriteMessage(websocket.TextMessage, []byte(errMsg)); err != nil {
			log.Println("Error sending WebSocket error message:", err)
		}

		c.Abort()
		return
	}

	outputFolderName, exists := c.Get("outputFolderName")
	if !exists {
		// 使用 WebSocket 发送错误消息
		errMsg := "outputFolderName not found in context"
		if err := wsConn.WriteMessage(websocket.TextMessage, []byte(errMsg)); err != nil {
			log.Println("Error sending WebSocket error message:", err)
		}

		c.Abort()
		return
	}

	// 将 outputDirectory 转换为字符串
	outputDirStr, ok := outputDirectory.(string)
	if !ok {
		// 使用 WebSocket 发送错误消息
		errMsg := "outputDirectory is not a string"
		if err := wsConn.WriteMessage(websocket.TextMessage, []byte(errMsg)); err != nil {
			log.Println("Error sending WebSocket error message:", err)
		}

		c.Abort()
		return
	}

	records, err := csvhandler.ReadCSVFile(outputDirStr + "/eplusout.csv")
	if err != nil {
		// 使用 WebSocket 发送错误消息
		errMsg := "读取输出文件错误：" + err.Error()
		if err := wsConn.WriteMessage(websocket.TextMessage, []byte(errMsg)); err != nil {
			log.Println("Error sending WebSocket error message:", err)
		}

		c.Abort()
		return
	}

	// 获取表头的字段数量
	if len(records) == 0 {
		if err := wsConn.WriteMessage(websocket.TextMessage, []byte("records is empty")); err != nil {
			log.Println("Error sending WebSocket error message:", err)
		}
	}
	header := records[0]
	numColumns := len(header)

	columnNames := mysql.GenerateExcelColumnNames(numColumns)

	// 创建数据库
	err = mysql.CreatMySQL(outputFolderName.(string), columnNames, numColumns)
	if err != nil {
		// 使用 WebSocket 发送错误消息
		errMsg := "插入数据到数据库错误：" + err.Error()
		if err := wsConn.WriteMessage(websocket.TextMessage, []byte(errMsg)); err != nil {
			log.Println("Error sending WebSocket error message:", err)
		}
		c.Abort()
		return
	}
	// 插入数据库
	err = mysql.InsertDataToMySQL(outputFolderName.(string), records, columnNames, numColumns)

	if err != nil {
		// 使用 WebSocket 发送错误消息
		errMsg := "插入数据到数据库错误：" + err.Error()
		if err := wsConn.WriteMessage(websocket.TextMessage, []byte(errMsg)); err != nil {
			log.Println("Error sending WebSocket error message:", err)
		}
		c.Abort()
		return
	}
	// 使用 WebSocket 发送成功消息
	successMsg := "数据插入成功"
	if err := wsConn.WriteMessage(websocket.TextMessage, []byte(successMsg)); err != nil {
		log.Println("Error sending WebSocket success message:", err)
	}

	defer func(wsConn *websocket.Conn) {
		err := wsConn.Close()
		if err != nil {

		}
	}(wsConn)

}
