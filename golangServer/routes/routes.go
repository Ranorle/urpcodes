package routes

import (
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(server *gin.Engine) {
	// 设置静态资源路由

	server.Use(static.Serve("/", static.LocalFile("./build", false)))

	// 使用 Group 包裹路由
	apiGroup := server.Group("/api")
	{
		apiGroup.POST("/calculate", Calculate)
		apiGroup.GET("/about", AboutHandler)
	}
}
