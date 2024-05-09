package app

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go/v4"
	"github.com/google/uuid"
	"github.com/gorilla/sessions"
)

type AccessTokenClaims struct {
	TokenUUID string `json:"tid"`  // 토큰 UUID
	UserID    string `json:"id"`   // 유저 ID
	Name      string `json:"name"` // 유저 이름
	jwt.StandardClaims
}
type RefreshTokenClaims struct {
	TokenUUID string `json:"tid"`  // 토큰 UUID
	UserID    string `json:"id"`   // 유저 ID
	Name      string `json:"name"` // 유저 이름
	jwt.StandardClaims
}

type UserId struct {
	ID interface{} `json:"id"`
}

type UserName struct {
	Name string `json:"user_name"`
}

var store = sessions.NewCookieStore([]byte("1234"))

func generateStateOauthCookie(w http.ResponseWriter) string {
	expiration := time.Now().Add(1 * 24 * time.Hour)

	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)
	cookie := &http.Cookie{Name: "oauthstate", Value: state, Expires: expiration}
	http.SetCookie(w, cookie)
	return state
}

func makeAccessToken(userId string) string {
	id, name := CheckUserSql(mySQL, userId)
	if id == "" || name == "" {
		return ""
	}

	at := AccessTokenClaims{
		TokenUUID: uuid.NewString(),
		UserID:    id,
		Name:      name,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: jwt.At(time.Now().Add(time.Minute * 15)),
		},
	}

	atoken := jwt.NewWithClaims(jwt.SigningMethodHS256, &at)
	accessToken, _ := atoken.SignedString([]byte("1234"))

	return accessToken
}

func makeRefreshToken(userId string) string {
	id, name := CheckUserSql(mySQL, userId)
	if id == "" || name == "" {
		return ""
	}

	rt := RefreshTokenClaims{
		TokenUUID: uuid.NewString(),
		UserID:    userId,
		Name:      name,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: jwt.At(time.Now().Add(time.Hour * 24)),
		},
	}

	atoken := jwt.NewWithClaims(jwt.SigningMethodHS256, &rt)
	refershToken, _ := atoken.SignedString([]byte("1234"))

	return refershToken
}

func GetAccessToken(r *http.Request) string {
	session, err := store.Get(r, "token")
	if err != nil {
		return ""
	}

	val := session.Values["accessToken"]
	if val == nil {
		return ""
	}

	return val.(string)
}

func GetRefreshToken(r *http.Request) string {
	session, err := store.Get(r, "token")
	if err != nil {
		return ""
	}

	val := session.Values["refreshToken"]
	if val == nil {
		return ""
	}

	return val.(string)
}

func CheckAccessToken(t string) (bool, string, string) {
	if t == "" {
		return false, "", ""
	}
	claims := AccessTokenClaims{}

	token, _ := jwt.ParseWithClaims(t, &claims, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("")
		}
		return []byte("1234"), nil
	})

	return token.Valid, claims.UserID, claims.Name
}
func CheckRefreshToken(t string) (bool, string, string) {
	if t == "" {
		return false, "", ""
	}
	claims := RefreshTokenClaims{}

	token, _ := jwt.ParseWithClaims(t, &claims, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("")
		}
		return []byte("1234"), nil
	})

	fmt.Println(claims.Name)
	return token.Valid, claims.UserID, claims.Name
}

func CheckLogin(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userData := map[string]string{
		"user_id":   "",
		"user_name": "",
	}

	accessTokenBool, userId, userName := CheckAccessToken(GetAccessToken(r))
	if accessTokenBool {
		userData["user_id"] = userId
		userData["user_name"] = userName
		fmt.Println("accessToken", accessTokenBool)
	} else {
		refreshTokenBool, userId, userName := CheckRefreshToken(GetRefreshToken(r))
		if refreshTokenBool {
			session, _ := store.Get(r, "token")
			session.Values["accessToken"] = makeAccessToken(userId)
			session.Save(r, w)

			userData["user_id"] = userId
			userData["user_name"] = userName

			fmt.Println("refreshToken", refreshTokenBool)
		}
	}

	jsonData, err := json.Marshal(userData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println(string(jsonData))
	fmt.Fprint(w, string(jsonData))
}

func Logout(w http.ResponseWriter, r *http.Request) {
	cookie := &http.Cookie{Name: "token", MaxAge: -1}
	http.SetCookie(w, cookie)
}
