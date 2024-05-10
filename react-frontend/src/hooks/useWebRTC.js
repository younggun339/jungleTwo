// hooks/useWebRTC.js
import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import startCapturing from "../components/startCapturing";

const pcConfig = {
  'iceServers': [{ "urls": ["turn:3.34.140.233:3478?transport=tcp"], "username": "team2", "credential": "team2" }]
};

const useWebRTC = (flaskSocketRef, roomName, canvasRef) => {
  const userVideo = useRef();
  const peersRef = useRef([]);
  const [peers, setPeers] = useState([]);
  const indexRef = useRef(0);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        startCapturing(stream, userVideo,canvasRef, flaskSocketRef, indexRef.current);
        console.log("befor join room");
        flaskSocketRef.current.emit("join room", roomName);
        console.log("after join room");
        flaskSocketRef.current.on("room full", () => {
          alert("Room is full!");
          window.location.href = "/";
        });

        flaskSocketRef.current.on("all users", (users) => {
          console.log("all users!");
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, flaskSocketRef.current.id, stream);
            peersRef.current.push({ peerID: userID, peer });
            peers.push({ peerID: userID, peer });
          });
          setPeers(peers);
          console.log(peers);
          indexRef.current = users.length;
          console.log("indexRef!", indexRef.current);
        });

        flaskSocketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          const peerObj = { peer, peerID: payload.callerID };
          peersRef.current.push(peerObj);
          setPeers((users) => [...users, peerObj]);
        });

        flaskSocketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });

        flaskSocketRef.current.on("user left", (id) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) peerObj.peer.destroy();
          const peers = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = peers;
          setPeers(peers);
        });
      });
  }, [roomName, canvasRef]);

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: pcConfig,
    });

    peer.on("signal", (signal) => {
      flaskSocketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      config: pcConfig,
    });

    peer.on("signal", (signal) => {
      flaskSocketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);
    return peer;
  };

  return { userVideo, peers, indexRef };
};

export default useWebRTC;