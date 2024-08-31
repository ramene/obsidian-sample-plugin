package main

import (
    "github.com/gin-gonic/gin"
    "syscall/js"
    "fmt"
)

func startServer() {
    port := ":3000"
    fmt.Printf("Server starting on port %s\n", port)
    r := gin.Default()
    
    r.Use(func(c *gin.Context) {
        c.Header("Access-Control-Allow-Origin", "*")
        c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        c.Header("Access-Control-Allow-Headers", "Origin, Content-Type")
        c.Next()
    })

    r.Static("/", "./packages/out")
    r.NoRoute(func(c *gin.Context) {
        c.File("./packages/out/index.html")
    })

    // js.Global().Call("confirmServerRunning", "3000")

    fmt.Println("Go server listening on :3000")
    r.Run(port)
}

func main() {
    c := make(chan struct{}, 0)
    js.Global().Set("startGoServer", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
        go startServer()
        return nil
    }))
    js.Global().Call("confirmServerRunning", "3000")
    <-c
}
