import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

const pcConfig = {
  //'iceServers': [{ "urls": ["stun:13.209.13.126:3478"], "username": "team2", "credential": "team2" }]
  iceServers: [
    {
      urls: ["turn:3.36.96.106:3478?transport=tcp"],
      username: "team2",
      credential: "team2",
    },
  ],
};
// new RTCPeerConnection({
//     iceServers:  [{ "urls": ["turn:3.35.134.30:3478?transport=tcp"], "username": "team2", "credential": "team2" }]
//   });

const Container = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  width: 90%;
  margin: auto;
  flex-wrap: wrap;
`;

const StyledVideo = styled.video`
  height: 40%;
  width: 50%;
`;

const getTokenFromCookie = () => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "token") {
      return value;
    }
  }
  return null; // 토큰이 없는 경우 null을 반환합니다.
};

const token = getTokenFromCookie();

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    const peer = props.peer;
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });

    return () => {
      peer.removeAllListeners("stream");
    };
  }, [props.peer]);

  return <StyledVideo autoPlay playsInline ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const playerState = () => {
  fetch("/player", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to player");
      }
    })
    .then((data) => {
      if (data.player1 === "True") {
        console.log("Player 1 is true");
        is_player1 = true;
      } else if (data.plyer2 === "True") {
        console.log("Player 2 is True");
        is_player1 = false;
      }
    });
};

const Room = (props) => {
  // const [callEnded, setCallEnded] = useState(false);
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;
  let is_player1;
  useEffect(() => {
    socketRef.current = io.connect("/");
    console.log("a person just got joined");
    playerState().then(() => {
      navigator.mediaDevices
        .getUserMedia({ video: videoConstraints, audio: true })
        .then((stream) => {
          userVideo.current.srcObject = stream;

          // stream을 body-coords라는 웹 소켓 이벤트로 송신한다.
          const bodyCoords = new MediaRecorder(stream);
          bodyCoords.ondataavailable = (e) => {
            const formData = new FormData();
            formData.append("body-coords", e.data);
            fetch("/body-coords", {
              method: "POST",
              body: formData,
            });
          };

          socketRef.current.emit("join room", roomID);
          socketRef.current.on("room full", () => {
            alert("room is full!");

            const currentURL = window.location.href;
            console.log("current url:", currentURL);
            const homeURL = new URL(currentURL);
            // const protocol = currentURL !== "about:" ? homeURL.protocol: "http:";
            const domain = `${homeURL.protocol}//${homeURL.host}`;
            // console.log("current domain:", domain);
            window.location.href = domain;
          });

          socketRef.current.on("all users", (users) => {
            const peers = [];
            users.forEach((userID) => {
              const peer = createPeer(userID, socketRef.current.id, stream);
              peersRef.current.push({
                peerID: userID,
                peer,
              });
              peers.push({
                peerID: userID,
                peer,
              });
            });
            setPeers(peers);
          });

          socketRef.current.on("user joined", (payload) => {
            console.log("user just joined");
            const peer = addPeer(payload.signal, payload.callerID, stream);
            // peersRef.current.push({
            //     peerID: payload.callerID,
            //     peer,
            // })
            const peerObj = {
              peer,
              peerID: payload.callerID,
            };

            setPeers((users) => [...users, peerObj]);
          });

          socketRef.current.on("receiving returned signal", (payload) => {
            console.log("user received a signal");
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            item.peer.signal(payload.signal);
          });

          socketRef.current.on("user left", (id) => {
            console.log("disconnected");
            const peerObj = peersRef.current.find((p) => p.peerID === id);
            if (peerObj) {
              peerObj.peer.destroy();
            }
            const peers = peersRef.current.filter((p) => p.peerID !== id);
            peersRef.current = peers;
            setPeers(peers);
          });
        });
      // eslint-disable-next-line
    });
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: pcConfig,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }
  // const leaveCall = () => {
  //     setCallEnded(true);
  //     socketRef.current.destroy();
  // }
  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      config: pcConfig,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <Container>
      {peers.map((peer, index) => {
        return <Video key={`${peer.peerID}-${index}`} peer={peer.peer} />;
      })}
      <StyledVideo muted ref={userVideo} autoPlay playsInline />
      {/* {!callEnded && (<button onClick={leaveCall}>End Call</button>)} */}
    </Container>
  );
};

export default Room;
