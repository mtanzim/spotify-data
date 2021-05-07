package main

import (
	"log"
	"net/http"
	"os"

	_ "github.com/joho/godotenv/autoload"
)

func authorize(w http.ResponseWriter, req *http.Request) {

	baseUrl := os.Getenv("BASE_URL")
	clientId := os.Getenv("CLIENT_ID")
	scopes := os.Getenv("SCOPES")
	redirectUri := os.Getenv("REDIRECT_URL")
	responseType := os.Getenv("RESPONSE_TYPE")
	authUrl := baseUrl + "?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&scope=" + scopes + "&response_type=" + responseType

	// w.Header().Set("Content-Type", "text/html; charset=utf-8")
	// w.Header().Set("Access-Control-Allow-Origin", "*")
	// log.Println(authUrl)
	w.Write([]byte(authUrl))
	// http.Redirect(w, req, authUrl, http.StatusPermanentRedirect)
}

func main() {

	http.Handle("/", http.FileServer(http.Dir("./public")))
	http.HandleFunc("/authorize", authorize)

	port := os.Getenv("PORT")
	log.Println("Starting server on PORT:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
