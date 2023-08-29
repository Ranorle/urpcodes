package middlewares

import (
	"github.com/gin-gonic/gin"
	"golangServer/mysql"
)

type IdfTableType struct {
	Id      int
	IdfName string
	IdfPath string
	// 继续为表中的每个字段添加相应的字段类型
}

func SelectSceneHandler(c *gin.Context) {
	// 查询数据
	var idfdata []IdfTableType
	err := mysql.QueryAllData("idftable", &idfdata)
	if err != nil {
		// 处理错误，可以发送适当的错误响应给客户端
		c.JSON(500, gin.H{
			"error": "Internal Server Error",
		})
		return
	}
	// 成功时，将数据发送给客户端
	c.JSON(200, idfdata)
}
