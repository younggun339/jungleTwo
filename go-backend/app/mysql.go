package app

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

var mySQL *sql.DB
var myStmt *sql.Stmt

func AppWithDB(db *sql.DB, stmt *sql.Stmt) {
	mySQL = db
	myStmt = stmt
}

// DB의 이름을 받아서 해당 DB와 연결한다.
func OpenSql(dbName string) (*sql.DB, *sql.Stmt) {
	db, err := sql.Open("mysql", "user:zzrot@tcp(zzrot.store:3306)/"+dbName)
	if err != nil {
		log.Fatal(err)
	}
	stmt, err := db.Prepare("INSERT INTO room_table (room_id, room_name, room_pw, room_master) VALUES (?, ?, ?, ?)")
	fmt.Println("connected mySQL [" + dbName + "]")

	return db, stmt
}

func CheckUserSql(db *sql.DB, userId string) (string, string) {
	var userName string

	row := db.QueryRow("SELECT user_id, user_name FROM user_table WHERE user_id = ?", userId)
	err := row.Scan(&userId, &userName)
	if err == sql.ErrNoRows {
		charset := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
		userName := make([]byte, 8)
		for i := range userName {
			userName[i] = charset[rand.Intn(len(charset))]
		}

		_, err = db.Exec("INSERT INTO user_table (user_id, user_name) VALUES (?, ?)", userId, userName)
		if err != nil {
			return "", ""
		}
	} else if err != nil {
		return "", ""
	}

	return userId, userName
}

func UpdateUserSql(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Println(err)
		return
	}

	var newName UserName
	json.Unmarshal(body, &newName)

	if newName.Name == "" {
		fmt.Println("Not meaningful Name")
		return
	}

	accessTokenBool, userId, _ := CheckAccessToken(GetAccessToken(r))
	if accessTokenBool && userId != "" {
		_, err := mySQL.Exec("UPDATE user_table SET user_name = ? WHERE user_id = ?", newName.Name, userId)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		refreshTokenBool, userId, _ := CheckRefreshToken(GetRefreshToken(r))
		if refreshTokenBool && userId != "" {
			_, err := mySQL.Exec("UPDATE user_table SET user_name = ? WHERE user_id = ?", newName.Name, userId)
			if err != nil {
				log.Fatal(err)
			}
		}
	}
	session, _ := store.Get(r, "token")
	session.Values["accessToken"] = makeAccessToken(userId)
	session.Values["refreshToken"] = makeRefreshToken(userId)
	session.Save(r, w)
}

func CreateRoom(db *sql.DB, room RoomState) {
	_, err := myStmt.Exec(room.RoomId, room.RoomName, room.RoomPW, room.RoomMaster)
	if err != nil {
		fmt.Println(err)
		return
	}
}

func GetRoom(db *sql.DB, search string) []RoomState {
	roomList := []RoomState{}

	var (
		query string
		args  []interface{}
	)

	if search != "" {
		query = "SELECT * FROM room_table WHERE room_id = ?"
		args = append(args, search)
	} else {
		query = "SELECT * FROM room_table"
	}

	rows, err := db.Query(query, args...)
	if err != nil {
		fmt.Println("Error querying database:", err)
		return roomList
	}
	defer rows.Close()

	for rows.Next() {
		var roomData RoomState

		if err := rows.Scan(&roomData.RoomId, &roomData.RoomName, &roomData.RoomMaster, &roomData.RoomPW); err != nil {
			fmt.Println("Error scanning row:", err)
			return roomList
		}
		roomList = append(roomList, roomData)
	}

	return roomList
}

func CheckPW(db *sql.DB, room RoomState) bool {
	rows, err := db.Query("SELECT * FROM room_table WHERE room_id = ?", room.RoomId)
	if err != nil {
		fmt.Println("Error querying database:", err)
		return false
	}
	defer rows.Close()

	var roomId string
	var roomName string
	var roomMaster string
	var roomPW string

	rows.Next()
	if err := rows.Scan(&roomId, &roomName, &roomMaster, &roomPW); err != nil {
		fmt.Println("Error scanning row:", err)
		return false
	}
	if roomPW == room.RoomPW {
		return true
	}
	return false
}
