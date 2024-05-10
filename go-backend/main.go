package main

import (
	"net/http"
	"nmm/go-backend/app"
	"os"
	"strconv"

	"github.com/gorilla/pat"
	"github.com/joho/godotenv"
	"github.com/urfave/negroni"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	db, stmt := app.OpenSql("project")
	defer db.Close()

	app.AppWithDB(db, stmt)

	mux := pat.New()

	mux.HandleFunc("/room/new", app.MakeNewRoom)
	mux.HandleFunc("/room/get", app.GetRoomList)
	mux.HandleFunc("/room/check", app.CheckRoomPW)
	mux.HandleFunc("/auth/google/login", app.GoogleLoginHandler)
	mux.HandleFunc("/auth/google/callback", app.GoogleAuthCallback)
	mux.HandleFunc("/auth/kakao/login", app.KakaoLoginHandler)
	mux.HandleFunc("/auth/kakao/callback", app.KakaoAuthCallback)
	mux.HandleFunc("/check", app.CheckLogin)
	mux.HandleFunc("/logout", app.Logout)
	mux.HandleFunc("/update", app.UpdateUserSql)

	n := negroni.Classic()
	n.UseHandler(mux)

	port, err := strconv.Atoi(os.Getenv("GO_PORT"))
	if err != nil {
		port = 8787
	}

	http.ListenAndServe(":"+strconv.Itoa(port), mux)
}