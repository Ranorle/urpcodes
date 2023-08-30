package idfHandler

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"log"
)

func Getkey(c *gin.Context, wsConn *websocket.Conn, keyname string, dataMap map[string]interface{}) (keyvalue string) {
	key, ok := dataMap[keyname].(string)
	if !ok {
		err := wsConn.WriteMessage(websocket.TextMessage, []byte("处理修改对象出错2.1"))
		if err != nil {
			log.Println("err")
		}
		c.Abort()
	}
	return key
}
