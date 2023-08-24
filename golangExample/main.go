package main

import (
	"fmt"
	"golangExample/csvhandler"
)

func main() {
	// 读取CSV文件
	records, err := csvhandler.ReadCSVFile(`E:\EnergyPlus\inputidf\1ZoneDataCenterCRAC_wApproachTemp.csv`)
	if err != nil {
		fmt.Println("Error reading CSV:", err)
		return
	}

	// 处理CSV数据
	if len(records) > 0 {
		headers := records[0]
		fmt.Println("CSV Headers:")
		for _, header := range headers {
			fmt.Println(header)
		}
	} else {
		fmt.Println("CSV file is empty.")
	}

}
