import { Button } from '@mantine/core';
import ChatIcon from '@mui/icons-material/Chat';
import Video from './Video';
import Chat from './Chat/Chat';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { HubConnection } from "@microsoft/signalr";

const LobbyUI = ({ 
        lobbyId,
        userName,
        isHost,
        chatEnabled,
        connection,
        webrtc,
        handleCopy,
        toggleChat,
        leaveLobby
    }
    : 
    {
        lobbyId:string,
        userName:string,
        isHost:boolean, 
        chatEnabled:boolean, 
        connection: HubConnection | null,
        webrtc: any,
        handleCopy: () => void,
        toggleChat: () => void,
        leaveLobby: () => void
    }
    ) => {

    return (
        <div className="LobbyUI">
            <div className="LobbyControl flex my-2">
                <p className="ml-3 mt-1 font-bold text-slate-500">Lobby ID:</p>
                <p className="mt-1 ml-1 mr-3">{lobbyId}</p>
                
                <p className="ml-3 mt-1 font-bold text-slate-500">Username:</p>
                <p className="mt-1 ml-1 mr-3">{userName}</p>
                <Button variant="outline" color="gray" onClick={handleCopy}>
                    Copy Lobby ID
                </Button>
                {isHost ? 
                        <Button variant="outline" color="gray" onClick={() => webrtc?.toggleStream(lobbyId, connection)}><TvOutlinedIcon/></Button>
                    :
                        ""
                }
                <Button variant="outline" color="gray" onClick={toggleChat}>
                    {chatEnabled ? <CommentsDisabledIcon/> : <ChatIcon/>}
                </Button>
                <Button variant="outline" color="gray" onClick={leaveLobby}><LogoutOutlinedIcon/></Button>
            </div>
            <div className="flex flex-row items-start">
                <Video user={"1"} defaultMuteValue={isHost ? true : false}/>
                <Chat Username={userName} LobbyId={lobbyId} isEnabled={chatEnabled}/>
            </div>
        </div>

    );
}

export default LobbyUI;
