// csvhandler.go

package csvhandler

import (
	"encoding/csv"
	"os"
)

// ReadCSVFile 读取CSV文件并返回其内容
func ReadCSVFile(filename string) ([][]string, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {

		}
	}(file)

	csvReader := csv.NewReader(file)
	records, err := csvReader.ReadAll()
	if err != nil {
		return nil, err
	}

	return records, nil
}

// WriteCSVFile 将数据写入CSV文件
func WriteCSVFile(filename string, data [][]string) error {
	outFile, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer func(outFile *os.File) {
		err := outFile.Close()
		if err != nil {

		}
	}(outFile)

	csvWriter := csv.NewWriter(outFile)

	for _, record := range data {
		err := csvWriter.Write(record)
		if err != nil {
			return err
		}
	}

	csvWriter.Flush()
	if err := csvWriter.Error(); err != nil {
		return err
	}

	return nil
}
