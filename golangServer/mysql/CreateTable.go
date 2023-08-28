package mysql

import "fmt"

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
