package app

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"slices"
)

type RoomState struct {
	RoomId     string `json:"room_id"`
	RoomName   string `json:"room_name"`
	RoomPW     string `json:"room_pw"`
	RoomMaster string `json:"room_master"`
}

func MakeNewRoom(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	var newRoom RoomState
	err := decoder.Decode(&newRoom)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if newRoom.RoomName == "" {
		fmt.Println("의미없는 방 제목")
		return
	}

	if newRoom.RoomMaster == "" {
		fmt.Println("로그인 하지 않은 유저")
		return
	}

	CreateRoom(mySQL, newRoom)

	fmt.Println("방 생성 완료: " + newRoom.RoomName + "/ " + newRoom.RoomMaster)
	responseData := struct {
		Result bool `json:"result"`
	}{
		Result: true,
	}

	jsonData, _ := json.Marshal(responseData)
	fmt.Fprint(w, string(jsonData))
}

func GetRoomList(w http.ResponseWriter, r *http.Request) {
	roomList := GetRoom(mySQL, "")
	slices.Reverse(roomList)
	jsonData, err := json.Marshal(roomList)

	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	fmt.Fprint(w, string(jsonData))
}

func CheckRoomPW(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
	var newRoom RoomState
	json.Unmarshal(body, &newRoom)

	result := CheckPW(mySQL, newRoom)
	responseData := struct {
		Result bool `json:"result"`
	}{
		Result: result,
	}

	jsonData, err := json.Marshal(responseData)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	fmt.Fprint(w, string(jsonData))
}

func CheckRoomId(w http.ResponseWriter, r *http.Request) {
	roomId := r.URL.Path
	var result bool

	roomId = roomId[len(roomId)-8:]

	var resultId string
	err := mySQL.QueryRow("SELECT room_id FROM room_table WHERE room_id = ?", roomId).Scan(&resultId)
	switch {
	case err == sql.ErrNoRows:
		result = false
	case err != nil:
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	default:
		result = true
	}

	responseData := struct {
		Result bool `json:"result"`
	}{
		Result: result,
	}

	jsonData, err := json.Marshal(responseData)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	fmt.Fprint(w, string(jsonData))
}

func DeleteAllRoom(w http.ResponseWriter, r *http.Request) {
	_, err := mySQL.Exec("DELETE FROM room_table")
	if err != nil {
		fmt.Println("Delete: ", err)
		return
	}
}

func DeleteRoom(w http.ResponseWriter, r *http.Request) {
	fmt.Println("삭제")
	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
	var newRoom RoomState
	json.Unmarshal(body, &newRoom)

	_, err = mySQL.Exec("DELETE FROM room_table WHERE room_id = ?", newRoom.RoomId)
	if err != nil {
		fmt.Println("Delete: ", err)
		return
	}
}
func SearchRoom(w http.ResponseWriter, r *http.Request) {
	GetRoom(mySQL, "")
}
