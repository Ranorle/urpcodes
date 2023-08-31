package middlewares

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"golangServer/mysql"
	"golangServer/types"
	"log"
	"net/http"
	"os"
	"os/exec"
)

func OpenPreview(c *gin.Context) {
	var requestData struct {
		Value            string `json:"value"`
		Mode             string `json:"mode"`
		InputidfFilePath string `json:"InputidfFilePath"`
	}
	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
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

	OpenPreviewfunc(c, energyPlusExec, requestData.InputidfFilePath, requestData.Value, requestData.Mode)

	fmt.Printf("Received value: %s, mode: %s\n", requestData.Value, requestData.Mode)

	c.JSON(http.StatusOK, gin.H{
		"message": "Received POST data",
	})
}

func OpenPreviewfunc(c *gin.Context, energyPlusExec string, inputidfFilePath string, value string, mode string) {
	// 构建R脚本，使用传递的参数
	var rScript = ""
	if mode == "x-ray" {
		rScript = fmt.Sprintf(`
	library(eplusr)
	use_eplus("%s")
	path_idf <- "%s"
	model <- read_idf(path_idf)
	geom <- model$geometry()
	viewer <- geom$view()
	viewer$viewpoint("%s")
	viewer$x_ray(TRUE)
	Sys.sleep(30)
	`, energyPlusExec, inputidfFilePath, value)
	} else {
		rScript = fmt.Sprintf(`
	library(eplusr)
	use_eplus("%s")
	path_idf <- "%s"
	model <- read_idf(path_idf)
	geom <- model$geometry()
	viewer <- geom$view()
	viewer$viewpoint("%s")
	viewer$render_by("%s")
	Sys.sleep(30)
	`, energyPlusExec, inputidfFilePath, value, mode)
	}
	// 将rScript写入到文件
	rScriptFilePath := "../eplusrhandler/preview.R"
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
	} else {
		log.Println(string(output))
	}
}
