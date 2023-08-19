import { SetStateAction, useContext, useEffect, useState } from "react";
import Video from "./Video";
import SignalRContext from "./SignalR/SignalRContext";
import { Button } from '@mantine/core';
import WebRTCContext from "./WebRTC/WebRTCContext";

const Interface = () => {
    const [lobbyId, setLobbyId] = useState("");
    const [value, setValue] = useState("");
    const [isHost, setIsHost] = useState(false);

    const connection = useContext(SignalRContext);
    const webrtc = useContext(WebRTCContext);

    const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setValue(event.target.value);
    }
    const handleJoinedGroup = async (lobbyId:string) => {
        console.log("LobbyId: ", lobbyId);
        setLobbyId(lobbyId);
    }
    const handleMemberJoined = async (uid: string) =>{
        console.log("A new user joined: ", uid);
        webrtc?.createOffer(uid, connection);
    }
    const handleJoinLobby = async () => {
        connection?.invoke("JoinLobby", value);
        setIsHost(false);
    }
    const handleReceiveOffer = async (offer:string, uid:string) => {
        const message = JSON.parse(offer);
        if(message.type === "offer"){
            webrtc?.createAnswer(uid, message.offer, connection);
        }
        if(message.type === "answer"){
            webrtc?.addAnswer(message.answer);
        }
        if(message.type === "candidate"){
            let pc = await webrtc?.getPeerConnection();
            if(pc){
                pc.addIceCandidate(message.candidate);
            }
        }
    }
    const handleUserLeft = async (value:string) =>{
        console.log(value);
    }
    let createLobby = async () => {
        connection?.invoke("CreateLobby");
        setIsHost(true);
    }
    let leaveLobby = async () =>{
        connection?.invoke("LeaveLobby", lobbyId);
        setLobbyId("");
    }

    useEffect(() => {
        connection?.start()
          .then(() => {
            console.log("Connected!");
            connection.on("JoinedGroup", handleJoinedGroup);
            connection.on("MemberJoined", handleMemberJoined);
            connection.on("ReceivingOffer", handleReceiveOffer);
            connection.on("CallerLeft", handleUserLeft);
          })
          .catch((e) => console.log("Connection failed: ", e));
        }, [])
    window.addEventListener('beforeunload', leaveLobby);
    
    return (
        <>
            <div className="ControlPanel text-white p-3">
                {lobbyId ? 
                    (<div>
                        <Video user={"1"}/>
                        <Button variant="outline" color="gray" onClick={leaveLobby}>Leave Lobby</Button>
                        {isHost ? 
                            <>
                                <Button variant="outline" color="gray" onClick={webrtc?.toggleStream}>Toggle Stream</Button>
                                <Button variant="outline" color="gray" onClick={webrtc?.toggleAudio}>Toggle Audio</Button>
                            </>
                            :
                                ""
                        }
                        <p className="ControlPanel m-5">Lobby ID: {lobbyId}</p>
                    </div>)
                    : 
                    (<div className="bg-transparent">
                        <Button variant="outline" color="gray" onClick={createLobby}>Create Lobby</Button>
                        <Button variant="outline" color="gray" onClick={handleJoinLobby}>Join Lobby</Button>
                        <input type="text" placeholder="LobbyId" className="bg-white text-black m-1" value={value} onChange={handleChange}/>
                    </div>)
                }
            </div>
        </>
    );
};

export default Interface;