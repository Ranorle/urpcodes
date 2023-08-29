package mysql

import (
	"database/sql"
	"fmt"
	"log"
	"reflect"
)

// QueryAllData 查询指定表中的所有数据并返回对象数组
func QueryAllData(tablename string, dest interface{}) error {
	// 构建查询语句
	query := fmt.Sprintf("SELECT * FROM %s", tablename)

	// 执行查询
	rows, err := DB.Query(query)
	if err != nil {
		return err
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			log.Println(err)
		}
	}(rows)

	// 根据目标结构体类型创建一个切片
	sliceValue := reflect.ValueOf(dest)
	if sliceValue.Kind() != reflect.Ptr || sliceValue.Elem().Kind() != reflect.Slice {
		return fmt.Errorf("dest must be a pointer to a slice")
	}

	// 获取切片的元素类型
	elemType := sliceValue.Elem().Type().Elem()

	// 遍历查询结果
	for rows.Next() {
		// 创建一个新的结构体变量，用于存储查询结果
		result := reflect.New(elemType).Interface()

		// 获取结构体的字段数
		numFields := elemType.NumField()

		// 创建一个切片来存储字段的地址
		fieldPointers := make([]interface{}, numFields)
		for i := 0; i < numFields; i++ {
			fieldPointers[i] = reflect.ValueOf(result).Elem().Field(i).Addr().Interface()
		}

		// 扫描查询结果并将数据存储到新创建的结构体变量中
		err := rows.Scan(fieldPointers...)
		if err != nil {
			return err
		}

		// 将新的结构体变量添加到切片中
		sliceValue.Elem().Set(reflect.Append(sliceValue.Elem(), reflect.ValueOf(result).Elem()))
	}

	if err := rows.Err(); err != nil {
		return err
	}

	return nil
}
