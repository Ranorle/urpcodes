package routes

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
	"os/exec"
	"time"
)

func Calculate(c *gin.Context) {
	//输出文件路径
	// 获取当前时间戳，用于创建唯一的输出文件夹名
	currentTime := time.Now()
	outputFolderName := currentTime.Format("20060102150405") // 格式化为年月日时分秒
	outputDirectory := `E:\EnergyPlus\output\` + outputFolderName

	err1 := os.MkdirAll(outputDirectory, os.ModePerm)
	if err1 != nil {
		fmt.Println("Error creating output directory:", err1)
		return
	}

	// 设置EnergyPlus执行文件路径和输入文件路径
	energyPlusExec := `E:\EnergyPlus\energyplus.exe`
	inputidfFilePath := `E:\EnergyPlus\inputidf\1ZoneDataCenterCRAC_wApproachTemp.idf`
	inputepwFilePath := `E:\EnergyPlus\inputweather\USA_CA_San.Francisco.Intl.AP.724940_TMY3.epw`

	// 构建EnergyPlus命令
	cmd := exec.Command(energyPlusExec, "-d", outputDirectory, "-w", inputepwFilePath, "-r", inputidfFilePath)

	// 设置工作目录，如果EnergyPlus需要特定的工作目录
	// cmd.Dir = "path/to/working/directory"

	// 捕获EnergyPlus的标准输出和标准错误
	output, err2 := cmd.CombinedOutput()
	if err2 != nil {
		// 如果发生错误，将错误消息和EnergyPlus输出返回给客户端
		c.JSON(http.StatusInternalServerError, gin.H{"error": err2.Error(), "output": string(output)})
		return
	}

	// 如果成功，返回EnergyPlus的输出
	c.JSON(http.StatusOK, gin.H{"output": string(output), "status": "计算成功"})

}
