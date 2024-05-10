package app

import (
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
	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Println(err)
		return
	}

	var newRoom RoomState
	json.Unmarshal(body, &newRoom)

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
}

func GetRoomList(w http.ResponseWriter, r *http.Request) {
	roomList := GetRoom(mySQL)
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
