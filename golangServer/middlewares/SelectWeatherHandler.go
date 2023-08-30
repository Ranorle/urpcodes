package middlewares

import (
	"github.com/gin-gonic/gin"
	"golangServer/mysql"
	"golangServer/types"
)

func SelectWeatherHandler(c *gin.Context) {
	// 查询数据
	var epwdata []types.EpwTableType
	err := mysql.QueryAllData("epwtable", &epwdata)
	if err != nil {
		// 处理错误，可以发送适当的错误响应给客户端
		c.JSON(500, gin.H{
			"error": "Internal Server Error",
		})
		return
	}
	// 成功时，将数据发送给客户端
	c.JSON(200, epwdata)
}
