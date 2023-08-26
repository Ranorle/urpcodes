package middlewares

import (
	"bufio"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"os"
	"strings"
)

type InputParams struct {
	MessageType     string `json:"MessageType"`
	IDFPath         string `json:"IDFPath"`
	EPWPath         string `json:"EPWPath"`
	BeginMonth      string `json:"BeginMonth"`
	BeginDayOfMonth string `json:"BeginDayOfMonth"`
	EndMonth        string `json:"EndMonth"`
	EndDayOfMonth   string `json:"EndDayOfMonth"`
}

func InputparamsMid(c *gin.Context) {
	// 从上下文中获取 WebSocket 连接对象
	conn, exists := c.Get("websocket_conn")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "WebSocket connection not found"})
		c.Abort()
		return
	}

	// 断言连接对象的类型为 *websocket.Conn
	wsConn, ok := conn.(*websocket.Conn)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid WebSocket connection"})
		c.Abort()
		return
	}

	for {
		_, messageData, err := wsConn.ReadMessage()
		if err != nil {
			log.Println("Error reading message from client:", err)
			errMsg := []byte("Error reading message from client: " + err.Error())
			if err := wsConn.WriteMessage(websocket.TextMessage, errMsg); err != nil {
				log.Println("Error sending WebSocket error message:", err)
			}
			return
		}

		// 解析JSON数据
		var inputParams InputParams
		if err := json.Unmarshal(messageData, &inputParams); err != nil {
			log.Println("Error parsing JSON:", err)
			errMsg := []byte("Error parsing JSON: " + err.Error())
			if err := wsConn.WriteMessage(websocket.TextMessage, errMsg); err != nil {
				log.Println("Error sending WebSocket error message:", err)
			}
			continue // 继续监听下一条消息
		}

		if inputParams.MessageType == "setParams" {
			c.Set("IDFPath", inputParams.IDFPath)
			c.Set("EPWPath", inputParams.EPWPath)
			dealwithIDF(inputParams.IDFPath, inputParams.BeginMonth, inputParams.BeginDayOfMonth, inputParams.EndMonth, inputParams.EndDayOfMonth)
			log.Println("设置文件名成功")
			c.Next()
			break
		}
	}

}

func dealwithIDF(IDFPath string, BeginMonth string, BeginDayOfMonth string, EndMonth string, EndDayOfMonth string) {
	// 打开原始文件以供读取
	file, err := os.Open(IDFPath)
	if err != nil {
		log.Println("Error opening IDF file:", err)
		return
	}
	defer file.Close()

	// 创建内存缓冲区以存储修改后的内容
	var modifiedContent []string

	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		line := scanner.Text()
		// 使用 strings.TrimSpace 去除行首和行尾的空格
		line = strings.TrimSpace(line)

		// 如果行包含特定参数标记，将其替换为新的参数值
		if strings.Contains(line, "!- Begin Month") && BeginMonth != "" {
			line = BeginMonth + "," + " !- Begin Month"
		} else if strings.Contains(line, "!- Begin Day of Month") && BeginDayOfMonth != "" {
			line = BeginDayOfMonth + "," + " !- Begin Day of Month"
		} else if strings.Contains(line, "!- End Month") && EndMonth != "" {
			line = EndMonth + "," + " !- End Month"
		} else if strings.Contains(line, "!- End Day of Month") && EndDayOfMonth != "" {
			line = EndDayOfMonth + "," + " !- End Day of Month"
		}

		// 将修改后的行添加到内存缓冲区
		modifiedContent = append(modifiedContent, line)
	}

	if err := scanner.Err(); err != nil {
		log.Println("Error reading IDF file:", err)
		return
	}

	// 打开原始文件以供写入
	writefile, err := os.Create(IDFPath)
	if err != nil {
		log.Println("Error opening IDF file for writing:", err)
		return
	}
	defer func(writefile *os.File) {
		err := writefile.Close()
		if err != nil {
			log.Println("Error Close writefile:", err)
		}
	}(writefile)

	// 将修改后的内容写回原始文件
	for _, line := range modifiedContent {
		_, err := writefile.WriteString(line + "\n")
		if err != nil {
			log.Println("Error writing to IDF file:", err)
			return
		}
	}
}
