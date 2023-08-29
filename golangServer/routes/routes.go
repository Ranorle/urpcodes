package routes

import (
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"golangServer/middlewares"
)

func SetupRoutes(server *gin.Engine) {

	// 添加CORS中间件
	server.Use(corsMiddleware())

	// 设置静态资源路由

	server.Use(static.Serve("/", static.LocalFile("./build", false)))

	// 使用 Group 包裹路由
	apiGroup := server.Group("/api")
	{
		apiGroup.GET("/calculate", middlewares.WebsocketMid, middlewares.InputparamsMid, middlewares.CalculateMid, middlewares.HandleDataMid)
		apiGroup.GET("/selectScene", middlewares.SelectSceneHandler)
		apiGroup.GET("/selectWeather", middlewares.SelectWeatherHandler)
	}
}

// CORS中间件
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")   // 允许特定的域
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE") // 允许的HTTP方法
		c.Writer.Header().Set("Access-Control-Allow-Headers", "*")                      // 允许的HTTP头
		c.Next()
	}
}
