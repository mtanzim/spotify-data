package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	_ "github.com/joho/godotenv/autoload"
)

type body struct {
	State string `json:"state"`
}

func authorize(w http.ResponseWriter, req *http.Request) {

	isDev := os.Getenv("DEVELOPMENT") == "1"
	log.Println(isDev)

	if req.Method != http.MethodPost {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "text/plain; charset=UTF-8")
	if isDev {
		w.Header().Set("Access-Control-Allow-Origin", "*")
	}

	baseUrl := os.Getenv("BASE_URL")
	clientId := os.Getenv("CLIENT_ID")
	scopes := os.Getenv("SCOPES")
	redirectUri := os.Getenv("REDIRECT_URL")
	responseType := os.Getenv("RESPONSE_TYPE")

	var b body
	err := json.NewDecoder(req.Body).Decode(&b)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	log.Println(b)
	authUrl := baseUrl + "?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&scope=" + scopes + "&response_type=" + responseType + "&state=" + b.State
	w.Write([]byte(authUrl))
}

func main() {

	http.Handle("/", http.FileServer(http.Dir("./public")))
	http.HandleFunc("/authorize", authorize)

	port := os.Getenv("PORT")
	log.Println("Starting server on PORT:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
