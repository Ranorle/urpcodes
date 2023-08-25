package main

import (
	"github.com/gin-gonic/gin"
	"golangServer/routes"
)

func main() {
	// 创建一个默认的 Gin 引擎
	ginserver := gin.Default()

	// 引入路由
	routes.SetupRoutes(ginserver)

	// 启动服务器，监听端口 10088
	err := ginserver.Run(":10088")
	if err != nil {
		return
	}
}
