# The Rattus

**두 명의 플레이어가 함께하는, 멀티 길 만들기 퍼즐 웹 게임.** 

<img width="500" alt="스크린샷 2024-06-07 오후 6 54 03" src="https://github.com/younggun339/jungleTwo/assets/152257708/c832b38e-cfec-4969-8a24-751f6ef18402">

## The Rattus 시연 (영상)

*!! 스테이지마다 같이 풀어보세요 !!*

https://drive.google.com/file/d/15sInzhT-rxrUSrC97XJFDuwpQsrX4zMg/view?usp=sharing

## 게임 소개

제한 시간 내에 친구와 **음성통화**로 얘기하며 **클릭 앤 드래그**로 길을 그리고, 

쥐가 치즈에 도착하는지 결과를 함께 관전합니다.

총 **4개의 스테이지**로 다양한 장애물들이 등장합니다!

## 아키텍쳐

**React**로 클라이언트, **Nest js**, **GO**를 백엔드로 **Nginx**를 통해 리버스프록시 서빙을 하고 있습니다.

<img width="500" alt="스크린샷 2024-06-07 오후 7 10 45" src="https://github.com/younggun339/jungleTwo/assets/152257708/1519d16b-8d4b-4018-9921-480cee36ab55">

기존 기획으로는 모션 인식을 착안하여 Media pipe를 처리하는 flask까지 3개의 서버를 사용하였기때문에,

Matter js, Media pipe, WebRTC 등 클라이언트에게 쏠리는 부하 절감을 위해 Nginx로 설계하였습니다. 

### 클라이언트 : React

- 2D 물리엔진 Matter js로 게임 시뮬레이션 설계.
- 스테이지별 템플릿 분리 및 이벤트 구성.
- WebRTC로 음성 통화 구현.
- 클라이언트 간 길을 그리는 좌표 교환.

### 백엔드 : Nest

- WebRTC의 신호 처리 서버(Signaling Server)로 동작
- 2인으로 Mesh 방식 사용, turn 서버 이용.

### 백엔드 : Go

- MySQL로 회원, 방 목록 DB 구성 및 관리.
- 구글, 카카오 로그인 API로 편의성에 따른 접근성 확보.
- JWT 토큰으로 다른 서버에서도 로그인 여부 체크.

### +백엔드 : Flask

실제 프로젝트에 사용되지는 않았으나 코드 가이드입니다.
- 수신받은 미디어 데이터를 Media pipe를 통해 분석하여 송신.

## 포스터
![포스터](https://github.com/younggun339/jungleTwo/assets/152257708/a9de4917-b808-442e-9d46-f3ed4b0bcf67)

## 프로젝트 기간

2024/04/29 ~ 2024/05/23

## 팀원 소개

안나경 : https://github.com/younggun339

박태훈 : https://github.com/Hunobas

신준규 : https://github.com/shin1244

이하나 : https://github.com/hanana21

황은진 : https://github.com/EunjinHwang
