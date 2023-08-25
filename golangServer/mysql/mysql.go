package mysql

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
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

	fmt.Println("Connected to MySQL database")
	return nil
}

// CloseDB 关闭数据库连接
func CloseDB() {
	if DB != nil {
		err := DB.Close()
		if err != nil {
			return
		}
		fmt.Println("Closed MySQL database connection")
	}
}

func CreatMySQL(tableName string, columnNames []string, numColumns int) error {
	if DB == nil {
		return fmt.Errorf("database connection is not initialized")
	}

	// 构建 CREATE TABLE 语句
	createTableSQL := fmt.Sprintf("CREATE TABLE %s (", "_"+tableName)

	// 添加列
	for i, columnName := range columnNames {
		createTableSQL += fmt.Sprintf("%s VARCHAR(50)", columnName)

		if i < numColumns-1 {
			createTableSQL += ","
		}
	}

	// 添加主键
	createTableSQL += fmt.Sprintf(", PRIMARY KEY (%s))", columnNames[0])

	// 执行 CREATE TABLE 语句
	_, err := DB.Exec(createTableSQL)
	if err != nil {
		return err
	}

	return nil
}

func InsertDataToMySQL(tableName string, records [][]string, columnNames []string, numColumns int) error {
	if DB == nil {
		return fmt.Errorf("database connection is not initialized")
	}

	// 构建 INSERT INTO 语句
	insertSQL := fmt.Sprintf("INSERT INTO %s (", "_"+tableName)

	// 添加列名
	for i, columnName := range columnNames {
		insertSQL += columnName

		if i < numColumns-1 {
			insertSQL += ","
		}
	}

	insertSQL = insertSQL + ") VALUES ("

	// 添加占位符
	for i := 0; i < numColumns; i++ {
		insertSQL += "?"

		if i < numColumns-1 {
			insertSQL += ","
		}
	}

	insertSQL = insertSQL + ")"

	// 预备 INSERT 语句
	stmt, err := DB.Prepare(insertSQL)
	if err != nil {
		return err
	}
	defer func(stmt *sql.Stmt) {
		err := stmt.Close()
		if err != nil {

		}
	}(stmt)

	// 遍历记录并插入数据
	for _, record := range records[1:] { // 跳过表头
		// 将 record 转换为接口类型
		var recordInterface []interface{}
		for _, value := range record {
			recordInterface = append(recordInterface, value)
		}

		_, err := stmt.Exec(recordInterface...)
		if err != nil {
			return err
		}
	}

	return nil
}

func GenerateExcelColumnNames(numColumns int) []string {
	var columnNames []string
	for i := 0; i < numColumns; i++ {
		var columnName string
		for j := i; j >= 0; j = (j / 26) - 1 {
			columnName = string('A'+(j%26)) + columnName
		}
		columnNames = append(columnNames, "Column"+columnName)
	}
	return columnNames
}
