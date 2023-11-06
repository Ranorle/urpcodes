package mysql

import (
	"fmt"
	"regexp"
	"strings"
)

func sanitizeMySQLInput(input string) string {
	// 创建正则表达式，用于匹配方括号和圆括号
	regex := regexp.MustCompile("[\\[\\]()]")

	// 用空字符串替换匹配的字符
	result := regex.ReplaceAllString(input, "")

	// 将空格替换为下划线
	result = strings.Replace(result, " ", "_", -1)

	result = strings.Replace(result, ":", "_", -1)

	result = strings.Replace(result, "/", "_", -1)

	result = strings.Replace(result, "%", "_", -1)

	result = strings.Replace(result, "-", "_", -1)

	return result
}

func CreatMySQL(tableName string, columnNames []string, numColumns int) error {
	if DB == nil {
		return fmt.Errorf("database connection is not initialized")
	}

	// 构建 CREATE TABLE 语句
	createTableSQL := fmt.Sprintf("CREATE TABLE %s (", "_"+tableName)

	// 添加列
	for i, columnName := range columnNames {
		sanitized := sanitizeMySQLInput(columnName)
		createTableSQL += fmt.Sprintf("%s VARCHAR(50)", sanitized)

		if i < numColumns-1 {
			createTableSQL += ","
		}
	}
	sanitized2 := sanitizeMySQLInput(columnNames[0])

	// 添加主键
	createTableSQL += fmt.Sprintf(", PRIMARY KEY (%s))", sanitized2)

	// 执行 CREATE TABLE 语句
	_, err := DB.Exec(createTableSQL)
	if err != nil {
		return err
	}

	return nil
}
