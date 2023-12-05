import { Button } from '@mantine/core';
import ChatIcon from '@mui/icons-material/Chat';
import Video from './Video';
import Chat from './Chat/Chat';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { HubConnection } from "@microsoft/signalr";
import styled from 'styled-components';

const LobbyUI = ({ 
        lobbyId,
        userName,
        isHost,
        chatEnabled,
        connection,
        webrtc,
        usernameColors,
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
        usernameColors : number[],
        handleCopy: () => void,
        toggleChat: () => void,
        leaveLobby: () => void
    }
    ) => {

    return (
        <div className="LobbyUI">
            <StyledLobbyControl>
                <StyledText>Lobby ID:</StyledText>
                <StyledValue>{lobbyId}</StyledValue>
                
                <StyledText>Username:</StyledText>
                <StyledValue>{userName}</StyledValue>

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
            </StyledLobbyControl>

            <StyledChatAndVideoContainer>
                <Video user={"1"} defaultMuteValue={isHost}/>
                <Chat Username={userName} LobbyId={lobbyId} isEnabled={chatEnabled} usernameColors={usernameColors}/>
            </StyledChatAndVideoContainer>
        </div>

    );
}

export default LobbyUI;

const StyledLobbyControl = styled.div`
    display: flex;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
`

const StyledText = styled.p`
    margin-left: 0.75rem;
    margin-top: 0.25rem;
    font-weight: 700;
    --tw-text-opacity: 1;
    color: rgb(100 116 139 / var(--tw-text-opacity));
`;

const StyledValue = styled.p`
    margin-top: 0.25rem;
    margin-left: 0.25rem;
    margin-right: 0.75rem;
`;

const StyledChatAndVideoContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
`;

