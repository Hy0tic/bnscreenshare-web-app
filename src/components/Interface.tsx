import { useContext, useEffect, useState } from "react";
import SignalRContext from "./SignalR/SignalRContext";
import WebRTCContext from "./WebRTC/WebRTCContext";
import LobbyUI from "./LobbyUI";
import HomePage from "./HomePage/HomePage";
import styled from "styled-components";


const Interface = () => {
    const [lobbyId, setLobbyId] = useState("");
    const [isHost, setIsHost] = useState(false);
    const [userName, setUsername] = useState<string>("");
    const [usernameColors, setUsernameColors] = useState([90,90,90]);
    const [chatEnabled, setChatEnable] = useState<boolean>(true);

    const connection = useContext(SignalRContext);
    const webrtc = useContext(WebRTCContext);

    const handleJoinedGroup = (lobbyId:string) => {
        console.log("LobbyId: ", lobbyId);
        setLobbyId(lobbyId);
    }
    
    const handleMemberJoined = (uid: string) =>{
        console.log("A new user joined: ", uid);
        webrtc?.createOffer(uid, connection);
    }
    
    const handleJoinLobby = ({ lobbyId, username } : { lobbyId:string, username:string }) => {
        console.log("lobbyId");
        connection?.invoke("JoinLobby", lobbyId);
        setIsHost(false);
        setUsername(username);
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
            const pc = await webrtc?.getPeerConnection();
            if(pc){
                pc.addIceCandidate(message.candidate);
            }
        }
    }
    
    const createLobby = () => {
        connection?.invoke("CreateLobby");
        setIsHost(true);
        setUsername("host");
    }
    
    const leaveLobby = () =>{
        connection?.invoke("LeaveLobby", lobbyId);
        webrtc?.endStream();
        setLobbyId("");
    }

    const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(lobbyId);
        } catch (err) {
          console.error('Failed to copy text: ', err);
        }
      };
    
    const toggleChat = async () => {
        setChatEnable(!chatEnabled);
    }

    const getRandomNumber = () => {
        return Math.floor(Math.random() * 256);
    }

    useEffect(() => {
        connection?.start()
          .then(() => {
            console.log("Connected!");
            connection.on("JoinedGroup", handleJoinedGroup);
            connection.on("MemberJoined", handleMemberJoined);
            connection.on("ReceivingOffer", handleReceiveOffer);
          })
          .catch((e) => console.log("Connection failed: ", e));

        setUsernameColors([getRandomNumber(), getRandomNumber(), getRandomNumber()])
        }, [])
    window.addEventListener('beforeunload', leaveLobby);
    
    return (
        <>
            <StyledContainer>
                {lobbyId ? 
                    (<LobbyUI 
                        lobbyId={lobbyId}
                        userName={userName} 
                        isHost={isHost} 
                        chatEnabled={chatEnabled} 
                        connection={connection}
                        usernameColors={usernameColors} 
                        webrtc={webrtc}                     
                        toggleChat={toggleChat}
                        leaveLobby={leaveLobby}
                        handleCopy={handleCopy}
                    />)
                    : 
                    
                    <HomePage
                        handleJoinLobby={handleJoinLobby}
                        createLobby={createLobby}
                    />
                }
            </StyledContainer>
        </>
    );
};

export default Interface;

const StyledContainer = styled.div`
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
    padding: 0.75rem;
`