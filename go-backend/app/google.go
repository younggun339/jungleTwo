package app

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var googleOauthConfig = oauth2.Config{
	RedirectURL:  "http://zzrot.store/auth/google/callback",
	ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
	ClientSecret: os.Getenv("GOOGLE_SECRET_KEY"),
	Scopes: []string{
		"https://www.googleapis.com/auth/userinfo.email",
	},
	Endpoint: google.Endpoint,
}

func GoogleLoginHandler(w http.ResponseWriter, r *http.Request) {
	state := generateStateOauthCookie(w)
	url := googleOauthConfig.AuthCodeURL(state)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func GoogleAuthCallback(w http.ResponseWriter, r *http.Request) {
	oauthstate, _ := r.Cookie("oauthstate")

	if r.FormValue("state") != oauthstate.Value {
		errMsg := fmt.Sprintf("invalid google oauth state cookie:%s state:%s\n", oauthstate.Value, r.FormValue("state"))
		http.Error(w, errMsg, http.StatusInternalServerError)
		return
	}

	data, _ := GetGoogleUserInfo(r.FormValue("code"))

	var userInfo UserId
	json.Unmarshal(data, &userInfo)

	session, _ := store.Get(r, "token")
	session.Values["accessToken"] = makeAccessToken(userInfo.ID.(string))
	session.Values["refreshToken"] = makeRefreshToken(userInfo.ID.(string))

	err := session.Save(r, w)
	if err != nil {
		fmt.Println(err)
		return
	}

	http.Redirect(w, r, "http://zzrot.store/create-room", http.StatusSeeOther)
}

const oauthGoogleUrlAPI = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="

func GetGoogleUserInfo(code string) ([]byte, error) {
	token, err := googleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return nil, fmt.Errorf("failed to Exchange %s", err.Error())
	}

	resp, err := http.Get(oauthGoogleUrlAPI + token.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("failed to Get UserInfo %s", err.Error())
	}

	return io.ReadAll(resp.Body)
}
