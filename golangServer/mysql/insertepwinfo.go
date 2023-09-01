package mysql

import (
	"fmt"
	"github.com/gin-gonic/gin"
)

func InsertEpwRow(c *gin.Context, EpwName string, EpwPath string) error {
	if DB == nil {
		return fmt.Errorf("database connection is not initialized")
	}

	// 构建 INSERT INTO 语句
	insertStatement := "INSERT INTO epwtable (EpwName, EpwPath) VALUES (?, ?)"

	// 尝试插入数据
	_, err := DB.Exec(insertStatement, EpwName, EpwPath)
	if err != nil {
		c.JSON(500, gin.H{
			"error": err,
		})
		return err
	}

	return nil
}

func InsertEpwinfo(c *gin.Context, infotype string, info string, EpwName string) error {
	if DB == nil {
		return fmt.Errorf("database connection is not initialized")
	}

	// 构建参数化的 SQL UPDATE 语句
	updateStatement := fmt.Sprintf("UPDATE epwtable SET %s = ? WHERE EpwName = ?", infotype)

	// 传递参数到 DB.Exec
	_, err := DB.Exec(updateStatement, info, EpwName)
	if err != nil {
		c.JSON(500, gin.H{
			"error": err,
		})
		return err
	}

	return nil
}
