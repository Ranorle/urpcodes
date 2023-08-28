package mysql

import (
	"database/sql"
	"fmt"
	"log"
)

// IdfTableType 是你的数据结构类型，应包含表的所有字段
type IdfTableType struct {
	Id      int
	IdfName string
	IdfPath string
	// 继续为表中的每个字段添加相应的字段类型
}

// QueryAllDataFromTable 查询指定表中的所有数据并返回对象数组
func QueryAllDataFromTable() ([]IdfTableType, error) {
	// 构建查询语句
	query := fmt.Sprintf("SELECT * FROM idftable")

	// 执行查询
	rows, err := DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			log.Println(err)
		}
	}(rows)

	// 定义一个切片来存储查询结果
	var results []IdfTableType

	// 遍历查询结果
	for rows.Next() {
		var result IdfTableType
		err := rows.Scan(
			&result.Id,
			&result.IdfName,
			&result.IdfPath,
			// 继续为每个字段添加相应的字段
		)
		if err != nil {
			return nil, err
		}
		results = append(results, result)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return results, nil
}
