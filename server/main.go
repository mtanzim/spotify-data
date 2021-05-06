package main

import (
	"log"
	"net/http"
	"os"
)

func main() {

	http.Handle("/", http.FileServer(http.Dir("./public")))

	port := os.Getenv("PORT")
	log.Println("Starting server on PORT:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
