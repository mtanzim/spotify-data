package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

type body struct {
	State string
}

func authorize(w http.ResponseWriter, req *http.Request) {
	baseUrl := os.Getenv("BASE_URL")
	clientId := os.Getenv("CLIENT_ID")
	scopes := os.Getenv("SCOPES")
	redirectUri := os.Getenv("REDIRECT_URL")
	responseType := os.Getenv("RESPONSE_TYPE")

	var b body
	err := json.NewDecoder(req.Body).Decode(&b)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	authUrl := baseUrl + "?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&scope=" + scopes + "&response_type=" + responseType + "&state=" + b.State
	log.Println(authUrl)

	w.Write([]byte(authUrl))
}

func main() {

	http.Handle("/", http.FileServer(http.Dir("./public")))
	http.HandleFunc("/authorize", authorize)

	port := os.Getenv("PORT")
	log.Println("Starting server on PORT:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
