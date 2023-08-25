package routes

import "github.com/gin-gonic/gin"

func AboutHandler(c *gin.Context) {
	c.JSON(200, gin.H{"message": "This is the about page."})
}
