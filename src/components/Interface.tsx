import { useContext, useEffect, useState } from "react";
import SignalRContext from "./SignalR/SignalRContext";
import WebRTCContext from "./WebRTC/WebRTCContext";
import LobbyUI from "./LobbyUI";
import HomePage from "./HomePage/HomePage";


const Interface = () => {
    const [lobbyId, setLobbyId] = useState("");
    const [isHost, setIsHost] = useState(false);
    const [userName, setUsername] = useState<string>("");
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

    useEffect(() => {
        connection?.start()
          .then(() => {
            console.log("Connected!");
            connection.on("JoinedGroup", handleJoinedGroup);
            connection.on("MemberJoined", handleMemberJoined);
            connection.on("ReceivingOffer", handleReceiveOffer);
          })
          .catch((e) => console.log("Connection failed: ", e));
        }, [])
    window.addEventListener('beforeunload', leaveLobby);
    
    return (
        <>
            <div className="home-page-panel text-white p-3">
                {lobbyId ? 
                    (<LobbyUI 
                        lobbyId={lobbyId}
                        userName={userName} 
                        isHost={isHost} 
                        chatEnabled={chatEnabled} 
                        connection={connection} 
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
            </div>
        </>
    );
};

export default Interface;