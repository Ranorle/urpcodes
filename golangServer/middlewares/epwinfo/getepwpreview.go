package epwinfo

import (
	"github.com/gin-gonic/gin"
	"golangServer/mysql"
	"log"
)

type previewposttype struct {
	Epwname string `json:"epwname"`
}

func SelectWeatherPreviewHandler(c *gin.Context) {
	// 查询数据
	var requestData previewposttype // 使用切片来表示数组元素

	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		log.Println(err)
		return
	}

	//var epwdata []types.EpwpreviewDataType
	err := mysql.QueryWeatherPreviewArray(c, "epwtable", requestData.Epwname)
	if err != nil {
		// 处理错误，可以发送适当的错误响应给客户端
		c.JSON(500, gin.H{
			"error": err,
		})
		return
	}
}
