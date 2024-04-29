// import logo from './logo.svg';
// import './App.css';

import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment"
import PhoneIcon from "@material-ui/icons/Phone"
import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import io from "socket.io-client"
import './App.css'


const socket = io.connect("http://localhost:5000")

function App() {
    const [me, setMe] = useState("")
    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [idToCall, setIdToCall] = useState("")
    const [callEnded, , setCallEnded] = useState(false)
    const [name, setName] = useState("")

    const myVideo = useRef() //allow us to reference our vid which will be passing in through a video tag
    const userVideo = useRef()

    //actual connection
    const connectionRef = useRef() //allow us to disconnect when we end the call

    useEffect(() => {
        //allow us to either use the webcam or not, passed in with video
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
        })

        socket.on('me', (id) => {
            setMe(id)
        })
        socket.on("callUser", (data) => {
            setReceivingCall(true)
            setCaller(data.from)
            setName(data.name)
            setCallerSignal(data.signal)
        })
    }, [])

    const callUser = (id) => {
        //create a new peer
        const peer = new Peer({
            initiator: true,
            trickle: false, //i dont know what this does
            stream: stream
        })

        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name
            })
        })

        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        })

        socket.on("callAccepted", (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer
    }

    const answerCall = () => {
        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })

        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller })
        })

        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        })

        peer.signal(callerSignal)
        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy(); //kill our connection ref
    }

    return (
        <>
            <h1>나만무 2팀!</h1>
            {stream && <video playsInline muted ref={myVideo} autoPlay />}
            {callAccepted && !callEnded ?
                <video playsInline ref={userVideo} autoPlay /> : null}
            <TextField
                id="filled"
                label="Name"
                variant="filled"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <CopyToClipboard text={me}>
                <Button variant="contained">
                    Copy ID
                </Button>
            </CopyToClipboard>

            <TextField
                id="filled"
                label="ID to call"
                variant="filled"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
            />

            {callAccepted && !callEnded ? (<Button variant="contained" onClick={leaveCall}>
                End Call
            </Button>) : (
                <IconButton aria-label="call" onClick={() => callUser(idToCall)}>
                    <PhoneIcon />
                </IconButton>
            )}
            {idToCall}

            {receivingCall && !callAccepted ? (
                <div>
                    <h1>{name} is calling</h1>
                    <Button variant="contained" onClick={answerCall}>
                        Answer
                    </Button>
                </div>
            ) : null}
        </>
    );
}

export default App;