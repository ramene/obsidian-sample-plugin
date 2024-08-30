package main

import (
    "net/http"
    "syscall/js"
)

func main() {
    // Serve your Next.js app
    http.Handle("/", http.FileServer(http.Dir("./app/out")))

    // Expose a function to start the server
    js.Global().Set("startServer", js.FuncOf(startServer))

    // Keep the program running
    select {}
}

func startServer(this js.Value, args []js.Value) interface{} {
    go http.ListenAndServe(":8080", nil)
    return nil
}
