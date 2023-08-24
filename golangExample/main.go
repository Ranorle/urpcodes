package main

import (
	"database/sql"
	"fmt"
	"golangExample/mysql"
	"os/exec"
)

func main() {
	// 初始化数据库连接
	err := mysql.InitDB("root:password@tcp(localhost:3306)/urp")
	if err != nil {
		fmt.Println(err)
		return
	}

	defer mysql.CloseDB() // 在程序退出前确保关闭数据库连接

	// 这里可以编写你的主程序逻辑，使用 database.DB 来执行数据库操作
	// 例如，执行查询操作
	rows, err := mysql.DB.Query("SELECT * FROM buildings")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {

		}
	}(rows)

	// 处理查询结果
	for rows.Next() {
		// 读取数据并进行处理
		var id int
		var name string
		if err := rows.Scan(&id, &name); err != nil {
			fmt.Println(err)
			return
		}
		fmt.Printf("ID: %d, Name: %s\n", id, name)
	}

	// 指定要执行的命令和参数
	cmd := exec.Command(`C:\Program Files (x86)\Tencent\WeChat\WeChat.exe`)

	// 执行命令
	err = cmd.Run()
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("Chrome opened with the specified website.")

	// 其他主程序逻辑
}
