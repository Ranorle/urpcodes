package mysql

import (
	"database/sql"
	"fmt"
)

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
