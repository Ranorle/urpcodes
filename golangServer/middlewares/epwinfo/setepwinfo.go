package epwinfo

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"golangServer/mysql"
	"golangServer/types"
	"log"
	"net/http"
	"os"
	"os/exec"
	"regexp"
	"strings"
)

type EpwData struct {
	EpwName string `json:"EpwName"`
	EpwPath string `json:"EpwPath"`
}

func SetEpwInfo(c *gin.Context) {
	var requestData []EpwData // 使用切片来表示数组元素
	infotype := [7]string{"location", "dry_bulb_temperature", "dew_point_temperature", "relative_humidity", "atmospheric_pressure", "wind_speed", "wind_direction"}

	// 尝试将请求体绑定到 requestData 切片
	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		log.Println(err)
		return
	}

	// 以下代码保持不变
	var baseinfo []types.BaseInfoType
	err := mysql.QueryAllData("baseinfo", &baseinfo)
	if err != nil {
		// 处理错误，可以发送适当的错误响应给客户端
		c.JSON(500, gin.H{
			"error": "Internal Server Error",
		})
		return
	}

	energyPlusExec := baseinfo[0].EnergyPlusExec

	for _, epwData := range requestData {
		err := mysql.InsertEpwRow(c, epwData.EpwName, epwData.EpwPath)
		if err != nil {
			// 处理错误，可以发送适当的错误响应给客户端
			c.JSON(500, gin.H{
				"error": err,
			})
			return
		}

		for _, value := range infotype {
			var result = SetEpwInfoFunc(c, energyPlusExec, epwData.EpwPath, value)
			processOutputresult := processOutput(result)

			err = mysql.InsertEpwinfo(c, value, processOutputresult, epwData.EpwName)

			if err != nil {
				// 处理错误，可以发送适当的错误响应给客户端
				c.JSON(500, gin.H{
					"error": err,
				})
				return
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "successfully setting",
	})
}

func SetEpwInfoFunc(c *gin.Context, energyPlusExec string, epwpath string, infotype string) (outputstr string) {
	// 构建R脚本，使用传递的参数
	rScript := ""

	if infotype == "location" {
		rScript = fmt.Sprintf(`
		library(eplusr)
		use_eplus("%s")
		path <- "%s"
		epw <- read_epw(path)
		epw$location()$longitude
		epw$location()$latitude
	`, energyPlusExec, epwpath)
	} else {
		rScript = fmt.Sprintf(`
		library(eplusr)
		use_eplus("%s")
		path <- "%s"
		epw <- read_epw(path)
		epw$data()$%s
	`, energyPlusExec, epwpath, infotype)
	}

	// 将rScript写入到文件
	rScriptFilePath := "../eplusrhandler/epw.R"
	err := os.WriteFile(rScriptFilePath, []byte(rScript), 0644)
	if err != nil {
		log.Println("Error writing R script to file:", err)
		c.JSON(400, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	// 创建一个带有R脚本的临时文件
	cmd := exec.Command("Rscript", rScriptFilePath)
	// 执行R脚本
	output, err := cmd.Output()
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		log.Println(string(output))
		c.Abort()
	}

	return string(output)
}

func processOutput(output string) string {
	// 移除 "[1]", "[15]" 等杂项
	re := regexp.MustCompile(`\[\d+\]`)
	output = re.ReplaceAllString(output, "")

	// 移除空格和换行符
	output = strings.TrimSpace(output)
	output = strings.ReplaceAll(output, "\r\n", "")

	// 使用逗号分隔数据
	output = strings.Join(strings.Fields(output), ",")

	return output
}
