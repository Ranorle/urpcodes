package routes

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"golangServer/middlewares"
	"golangServer/middlewares/epwinfo"
)

func SetupRoutes(server *gin.Engine) {
	// 配置CORS中间件，允许来自'http://localhost:3000'的请求，并允许凭证
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowCredentials = true

	server.Use(cors.New(config))

	// 设置静态资源路由

	server.Use(static.Serve("/", static.LocalFile("./build", false)))
	server.Use(static.Serve("/idfpreview", static.LocalFile("../eplusrhandler/assests", true)))

	apiGroup := server.Group("/api")
	{
		//实行总计算api
		apiGroup.GET("/calculate", middlewares.WebsocketMid, middlewares.InputparamsMid, middlewares.CalculateMid, middlewares.HandleDataMid)
		//获取idf信息api
		apiGroup.GET("/selectScene", middlewares.SelectSceneHandler)
		//获取气象信息api
		apiGroup.GET("/selectWeather", middlewares.SelectWeatherHandler)
		//预览idf3d模型api
		apiGroup.POST("/windowpreview", middlewares.OpenPreview)
		//TODO idf信息计算与设置

		//TODO epw信息计算与设置
		apiGroup.POST("/setepwinfo", epwinfo.SetEpwInfo)
	}
}

//// CORS中间件
//func corsMiddleware() gin.HandlerFunc {
//	return func(c *gin.Context) {
//		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")   // 允许特定的域
//		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE") // 允许的HTTP方法 		// 允许的HTTP头
//
//		c.Next()
//	}
//}
