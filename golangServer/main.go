package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"golangServer/mysql"
	"golangServer/routes"
)

func main() {
	// 创建一个默认的 Gin 引擎
	err := mysql.InitDB("root:password@tcp(localhost:3306)/urp")
	if err != nil {
		fmt.Println(err)
		return
	}

	defer mysql.CloseDB() // 在程序退出前确保关闭数据库连接

	ginserver := gin.Default()

	// 引入路由
	routes.SetupRoutes(ginserver)

	// 启动服务器，监听端口 10088
	err = ginserver.Run(":10088")
	if err != nil {
		return
	}
}
