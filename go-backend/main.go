package main

import (
	"net/http"
	"nmm/go-backend/app"

	"github.com/gorilla/pat"
	"github.com/urfave/negroni"
)

func main() {
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
	mux.HandleFunc("/game/{gameRoomID}", app.PassRoom)

	n := negroni.Classic()
	n.UseHandler(mux)

	http.ListenAndServe(":8787", n)
}
