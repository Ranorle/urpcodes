package middlewares

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"golangServer/idfHandler"
	"golangServer/mysql"
	"golangServer/types"
	"log"
	"net/http"
)

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

	var baseinfo []types.BaseInfoType

	err := mysql.QueryAllData("baseinfo", &baseinfo)
	if err != nil {
		// 处理错误，可以发送适当的错误响应给客户端
		c.JSON(500, gin.H{
			"error": "Internal Server Error",
		})
		return
	}

	energyPlusExec := baseinfo[0].EnergyPlusExec

	for {
		_, messageData, err := wsConn.ReadMessage()
		if err != nil {
			log.Println("Error reading message from client:", err)
			errMsg := []byte("Error reading message from client: " + err.Error())
			if err := wsConn.WriteMessage(websocket.TextMessage, errMsg); err != nil {
				log.Println("Error sending WebSocket error message:", err)
			}
			return
		}

		// 解析JSON数据
		var inputParams types.InputParams
		if err := json.Unmarshal(messageData, &inputParams); err != nil {
			log.Println("Error parsing JSON:", err)
			errMsg := []byte("Error parsing JSON: " + err.Error())
			if err := wsConn.WriteMessage(websocket.TextMessage, errMsg); err != nil {
				log.Println("Error sending WebSocket error message:", err)
			}
			continue // 继续监听下一条消息
		}
		for _, value := range inputParams.ChangeDatas {
			dataMap, ok := value.(map[string]interface{})
			if !ok {
				if err := wsConn.WriteMessage(websocket.TextMessage, []byte("处理修改对象出错1")); err != nil {
				}
				c.Abort()
			}
			handletype, ok := dataMap["Handletype"].(string)
			if !ok {
				if err := wsConn.WriteMessage(websocket.TextMessage, []byte("处理修改对象出错2")); err != nil {
				}
				c.Abort()
			}
			switch handletype {
			case "setRunPeroid":
				idfHandler.SetRunPeriod(c, wsConn, energyPlusExec, dataMap, inputParams.IDFPath)
			case "addRunPeroid":
				idfHandler.AddRunPeriod(c, wsConn, energyPlusExec, dataMap, inputParams.IDFPath)
			case "deleteRunPeriod":
				idfHandler.DeleteRunPeriod(c, wsConn, energyPlusExec, dataMap, inputParams.IDFPath)
			default:
				err := wsConn.WriteMessage(websocket.TextMessage, []byte("找到不合法的处理对象"))
				if err != nil {
					fmt.Println(err)
				}
				c.Abort()
			}
		}
		c.Set("IDFPath", inputParams.IDFPath)
		c.Set("EPWPath", inputParams.EPWPath)
		log.Println("设置文件名成功")
		c.Next()
		break
	}
}
