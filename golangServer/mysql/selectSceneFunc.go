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

type BaseInfoType struct {
	Id              int
	EnergyPlusExec  string
	OutputDirectory string
}

// QueryAllDataFromTable 查询指定表中的所有数据并返回对象数组
func QueryAllDataFromTable(tablename string) ([]IdfTableType, error) {
	// 构建查询语句
	query := fmt.Sprintf("SELECT * FROM %s", tablename)

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

func QueryAllDataFromBaseTable(tablename string) ([]BaseInfoType, error) {
	// 构建查询语句
	query := fmt.Sprintf("SELECT * FROM %s", tablename)

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
	var results []BaseInfoType

	// 遍历查询结果
	for rows.Next() {
		var result BaseInfoType
		err := rows.Scan(
			&result.Id,
			&result.EnergyPlusExec,
			&result.OutputDirectory,
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
