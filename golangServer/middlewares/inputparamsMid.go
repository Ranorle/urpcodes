package middlewares

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"net/http"
)

type InputParams struct {
	MessageType string `json:"messageType"`
	IDFName     string `json:"idfname"`
	EPWName     string `json:"epwname"`
}

func InputparamsMid(c *gin.Context) {
	// 从上下文中获取 WebSocket 连接对象
	conn, exists := c.Get("websocket_conn")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "WebSocket connection not found"})
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

	for {
		_, messageData, err := wsConn.ReadMessage()
		if err != nil {
			fmt.Println("Error reading message from client:", err)
			return
		}
		// 解析JSON数据
		var inputParams InputParams
		if err := json.Unmarshal(messageData, &inputParams); err != nil {
			fmt.Println("Error parsing JSON:", err)
			continue // 继续监听下一条消息
		}
		if inputParams.MessageType == "setParams" {
			c.Set("IDFName", inputParams.IDFName)
			c.Set("EPWName", inputParams.EPWName)
			fmt.Println("设置文件名成功")
			c.Next()
		}
	}
}
