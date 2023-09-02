package mysql

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
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

func QueryWeatherArray(tablename string, dest interface{}) error {
	// 构建查询语句
	query := fmt.Sprintf("SELECT Id, EpwName, EpwPath, location FROM %s", tablename)

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

func QueryWeatherPreviewArray(c *gin.Context, tablename string, epwname string) error {
	// 构建查询语句
	type WeatherData struct {
		DryBulbTemperature  string `json:"dry_bulb_temperature"`
		DewPointTemperature string `json:"dew_point_temperature"`
		RelativeHumidity    string `json:"relative_humidity"`
		AtmosphericPressure string `json:"atmospheric_pressure"`
		WindSpeed           string `json:"wind_speed"`
	}
	query := fmt.Sprintf("SELECT dry_bulb_temperature,dew_point_temperature,relative_humidity,atmospheric_pressure,wind_speed FROM %s WHERE EpwName = ?", tablename)

	// 执行查询
	row := DB.QueryRow(query, epwname)
	var weatherData WeatherData
	err := row.Scan(&weatherData.DryBulbTemperature, &weatherData.DewPointTemperature, &weatherData.RelativeHumidity, &weatherData.AtmosphericPressure, &weatherData.WindSpeed)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": err.Error(),
		})
		return nil
	}
	c.JSON(http.StatusOK, weatherData)

	return nil
}
