package mysql

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"log"
)

// DB 是一个全局数据库连接对象
var DB *sql.DB

// InitDB 初始化数据库连接
func InitDB(dataSourceName string) error {
	var err error
	DB, err = sql.Open("mysql", dataSourceName)
	if err != nil {
		return err
	}

	err = DB.Ping()
	if err != nil {
		return err
	}

	log.Println("Connected to MySQL database")
	return nil
}

// CloseDB 关闭数据库连接
func CloseDB() {
	if DB != nil {
		err := DB.Close()
		if err != nil {
			return
		}
		log.Println("Closed MySQL database connection")
	}
}
