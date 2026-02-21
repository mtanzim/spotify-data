package main

import (
	"encoding/base64"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

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
	authUrl := baseUrl + "/authorize" + "?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&scope=" + scopes + "&response_type=" + responseType + "&state=" + b.State
	log.Println((authUrl))
	w.Write([]byte(authUrl))
}

func callback(w http.ResponseWriter, req *http.Request) {
	queryParams := req.URL.Query()
	state := queryParams.Get("state")
	log.Println("state:", state)
	code := queryParams.Get("code")
	log.Println("code:", code)

	clientId := os.Getenv("CLIENT_ID")
	clientSecret := os.Getenv("CLIENT_SECRET")
	redirectUri := os.Getenv("REDIRECT_URL")
	isDev := os.Getenv("DEVELOPMENT") == "1"

	tokenResp, err := requestToken(code, redirectUri, clientId, clientSecret)
	if err != nil {
		log.Println(err)
		http.Error(w, "token request failed", http.StatusInternalServerError)
		return
	}
	log.Println(tokenResp)
	accessToken, _ := tokenResp["access_token"].(string)
	refreshToken, _ := tokenResp["refresh_token"].(string)
	scope, _ := tokenResp["scope"].(string)
	var expiresIn int
	if v, ok := tokenResp["expires_in"].(float64); ok {
		expiresIn = int(v)
	} else {
		expiresIn = 3600
	}
	accessCookie := &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Path:     "/",
		MaxAge:   expiresIn,
		Secure:   !isDev,
		HttpOnly: false,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, accessCookie)
	scopeCookie := &http.Cookie{
		Name:     "scope",
		Value:    scope,
		Path:     "/",
		MaxAge:   expiresIn,
		Secure:   !isDev,
		HttpOnly: false,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, scopeCookie)
	if refreshToken != "" {
		refreshCookie := &http.Cookie{
			Name:  "refresh_token",
			Value: refreshToken,
			Path:  "/",
			// keep refresh longer (e.g. 30 days) or use an env override
			MaxAge:   30 * 24 * 60 * 60,
			Secure:   !isDev,
			HttpOnly: false,
			SameSite: http.SameSiteLaxMode,
		}
		http.SetCookie(w, refreshCookie)
	}

	http.Redirect(w, req, "/", http.StatusFound)

}

// requestToken exchanges an authorization code for tokens from Spotify.
func requestToken(code, redirectURI, clientID, clientSecret string) (map[string]interface{}, error) {
	data := url.Values{}
	data.Set("code", code)
	data.Set("redirect_uri", redirectURI)
	data.Set("grant_type", "authorization_code")

	req, err := http.NewRequest(http.MethodPost, "https://accounts.spotify.com/api/token", strings.NewReader(data.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	auth := base64.StdEncoding.EncodeToString([]byte(clientID + ":" + clientSecret))
	req.Header.Set("Authorization", "Basic "+auth)

	client := http.DefaultClient
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}
	return result, nil
}

func main() {

	http.Handle("/", http.FileServer(http.Dir("./public")))
	http.HandleFunc("/authorize", authorize)
	http.HandleFunc("/callback", callback)
	// http.HandleFunc("/login", login)

	port := os.Getenv("PORT")
	log.Println("Starting server on PORT:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
