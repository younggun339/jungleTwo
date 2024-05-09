package app

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"

	"golang.org/x/oauth2"
)

var kakaoOauthConfig = oauth2.Config{
	ClientID: "79fa79831d26014a575e03055d588817",
	Endpoint: oauth2.Endpoint{
		AuthURL:  "https://kauth.kakao.com/oauth/authorize",
		TokenURL: "https://kauth.kakao.com/oauth/token",
	},
	RedirectURL: "http://zzrot.store/auth/kakao/callback",
}

func KakaoLoginHandler(w http.ResponseWriter, r *http.Request) {
	state := generateStateOauthCookie(w)
	url := kakaoOauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
	fmt.Println("실행")
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func KakaoAuthCallback(w http.ResponseWriter, r *http.Request) {
	oauthstate, _ := r.Cookie("oauthstate")

	if r.FormValue("state") != oauthstate.Value {
		log.Printf("invalid google oauth state cookie:%s state:%s\n", oauthstate.Value, r.FormValue("state"))
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	data := GetKakaoUserInfo(r.FormValue("code"))

	var userInfo UserId
	json.Unmarshal(data, &userInfo)
	session, _ := store.Get(r, "token")

	idString := strconv.FormatFloat(userInfo.ID.(float64), 'f', -1, 64)

	session.Values["accessToken"] = makeAccessToken(idString)
	session.Values["refreshToken"] = makeRefreshToken(idString)

	err := session.Save(r, w)
	if err != nil {
		fmt.Println(err)
		return
	}

	http.Redirect(w, r, "http://zzrot.store/create-room", http.StatusSeeOther)
}

func GetKakaoUserInfo(code string) []byte {
	token, err := kakaoOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return nil
	}

	req, _ := http.NewRequest("GET", "https://kapi.kakao.com/v1/user/access_token_info", nil)

	req.Header.Set("Authorization", "Bearer "+token.AccessToken)

	client := http.Client{}
	res, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return nil
	}
	defer res.Body.Close()

	result, _ := io.ReadAll(res.Body)

	return result
}
