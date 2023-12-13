import { HubConnection } from "@microsoft/signalr";
import { createContext, ReactNode } from "react";

interface WebRTCContextValues {
    getPeerConnection: () => RTCPeerConnection | null;
    createOffer: (uid:string, connection:HubConnection | null) => Promise<void>;
    createAnswer: (uid:string, offer: RTCSessionDescriptionInit, connection:HubConnection | null) => Promise<void>;
    addAnswer: (answer: RTCSessionDescriptionInit) => void;
    toggleStream: (lobbyId:string, connection:HubConnection | null) => Promise<void>;
    endStream: () => void;
    toggleAudio: () => void;
  }

const WebRTCContext = createContext<WebRTCContextValues | null>(null);

interface WebRTCProviderProps {
  children: ReactNode;
}

const servers = {
    iceServers: [
        {
            urls: ["stun:global.stun.twilio.com:3478", "stun:stun4.l.google.com:19302", "stun:stun3.l.google.com:19302", "stun:stun.l.google.com:19302"]
        }
    ]
}
const streamSetting = {
    video: {
        width: { ideal: 2560, max: 2560  },
        height: { ideal: 1440, max: 1440 },
        frameRate: { ideal: 60, max: 60 }
    }, 
    audio: {
        autoGainControl: false,
        channelCount: 2,
        echoCancellation: false,
        noiseSuppression: false,
        sampleRate: 48000,
        sampleSize: 16
}};

let localStream : MediaStream | null;
let remoteStream : MediaStream | null;
let peerConnection : RTCPeerConnection;

export const WebRTCProvider: React.FC<WebRTCProviderProps> = ({ children }) => {

    const getPeerConnection = () => {
        return peerConnection;
    };
    
    const createPeerConnection = async (uid:string, connection:HubConnection | null) => {
        peerConnection = new RTCPeerConnection(servers);
        remoteStream = new MediaStream();

        if(!localStream){
            console.log("localStream is null, creating a new one");
            localStream = await navigator.mediaDevices.getDisplayMedia(streamSetting);
            const user1 = document.getElementById('user-1') as HTMLMediaElement;
            if(user1) {
                user1.srcObject = localStream;
            }
        }

        localStream.getTracks().forEach((track: MediaStreamTrack) => {
            peerConnection.addTrack(track, localStream as MediaStream);
            track.onended = function() {
                localStream = null;
            };
        });
    
        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track)=>
            {
                remoteStream?.addTrack(track);
                track.onended = function() {
                    remoteStream = null;
                };
            })
        }

        peerConnection.onicecandidate = async (event) => {
            if(event.candidate)
            {
                connection?.invoke("SendOffer", JSON.stringify({'type': 'candidate', 'candidate': event.candidate}), uid);
            }
        }

    }

    const createPeerConnectionAnswer = (uid:string, connection:HubConnection | null) => {
        peerConnection = new RTCPeerConnection(servers);
        remoteStream = new MediaStream();
        const user2 = document.getElementById('user-1') as HTMLMediaElement;
    
        if(user2) {
            user2.srcObject = remoteStream;
        }
        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track)=>
            {
                remoteStream?.addTrack(track);
                track.onended = function() {
                    remoteStream = null;
                };
            })
        }

        peerConnection.onicecandidate = async (event) => {
            if(event.candidate)
            {
                connection?.invoke("SendOffer", JSON.stringify({'type': 'candidate', 'candidate': event.candidate}), uid);
            }
        }
    }
    const createOffer = async (uid:string, connection:HubConnection | null) => {
        console.log("CREATING OFFER");
        console.log(uid);
        await createPeerConnection(uid, connection);
        if(peerConnection)
        {
            const offer = await peerConnection.createOffer();
            console.log(offer);
            await peerConnection.setLocalDescription(offer);
            const text = JSON.stringify({'type': 'offer', 'offer': offer});
            connection?.invoke("SendOffer", text, uid);
        }
    }
    const createAnswer = async (uid:string, offer: RTCSessionDescriptionInit, connection:HubConnection | null) => {
        console.log(uid);
        console.log(offer);

        createPeerConnectionAnswer(uid, connection);
        await peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        connection?.invoke("SendOffer", JSON.stringify({'type': 'answer', 'answer': answer}), uid);

    }

    const addAnswer = (answer: RTCSessionDescriptionInit) => {
        if(peerConnection && !peerConnection.currentRemoteDescription){
            peerConnection.setRemoteDescription(answer);
        }
    }

    const createOfferToLobby = async (lobbyId:string, connection:HubConnection | null) => {
        console.log("CREATING OFFER");
        console.log(lobbyId);
        await createPeerConnection(lobbyId, connection);
        if(peerConnection)
        {
            const offer = await peerConnection.createOffer();
            console.log(offer);
            await peerConnection.setLocalDescription(offer);
            const text = JSON.stringify({'type': 'offer', 'offer': offer});
            connection?.invoke("SendOfferToLobby", lobbyId, text);
        }
    }

    const toggleStream = async (lobbyId:string, connection:HubConnection | null) => {
        console.log("stream button");
        
        // Check if localStream exists and if it has video tracks
        const videoTrack = localStream && localStream.getVideoTracks()[0];
        
        // If videoTrack exists and is still active, stop the stream.
        if (videoTrack && videoTrack.readyState !== 'ended') {
            await endStream();
        } else {
            // If videoTrack is ended or doesn't exist, try to acquire the stream
            try {
                createOfferToLobby(lobbyId, connection);
            } catch (err) {
                console.error("Error acquiring stream: ", err);
            }
        }
    }

    const endStream = () => {
        const videoTrack = localStream && localStream.getVideoTracks()[0];
        if (videoTrack && videoTrack.readyState !== 'ended') {
            localStream?.getTracks().forEach(track => track.stop());
            
            const user1 = document.getElementById('user-1') as HTMLMediaElement;
            if(user1) {
                user1.srcObject = null;  // Clear the video element source
            }
            localStream = null;  // Clear the localStream reference
        }
    }
    
    const toggleAudio = () => {
        let audioTrack;
        if(localStream)
        {
            audioTrack = localStream.getTracks().find(track => track.kind === 'audio');
        }
        if(audioTrack){
            console.log(audioTrack);
            audioTrack.enabled = !audioTrack.enabled;
        }
    }
  return (
    <WebRTCContext.Provider value={{
        getPeerConnection,
        createOffer,
        createAnswer,
        addAnswer,
        toggleStream,
        endStream,
        toggleAudio }}>
      {children}
    </WebRTCContext.Provider>
  );
};

export default WebRTCContext;
