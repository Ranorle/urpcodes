package routes

import (
	"github.com/gin-gonic/gin"
	"golangServer/mysql"
	"log"
)

func SelectSceneHandler(c *gin.Context) {
	// 查询数据
	table, err := mysql.QueryAllDataFromTable("idftable")
	if err != nil {
		// 处理错误，可以发送适当的错误响应给客户端
		c.JSON(500, gin.H{
			"error": "Internal Server Error",
		})
		return
	}
	log.Println(table[0])
	// 成功时，将数据发送给客户端
	c.JSON(200, table)
}
