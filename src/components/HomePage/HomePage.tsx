import InfoContainer from "./InfoContainer";
import LobbyForm from "./LobbyForm";
import styled from "styled-components";

const HomePage = ({handleJoinLobby,
     createLobby} 
     :
      { handleJoinLobby: ({ lobbyId, username } : { lobbyId:string, username:string }) => void,
        createLobby: () => void
    }) => {
    return (
        <StyledHomePageContainer>
            <InfoContainer/>
            <LobbyForm 
                handleJoinLobby={handleJoinLobby}
                createLobby={createLobby}
            />
        </StyledHomePageContainer>
    )
}

export default HomePage;

const StyledHomePageContainer = styled.div`
    --tw-bg-opacity: 1;
    background-color: rgb(51 65 85 / var(--tw-bg-opacity));

    border-radius: 0.5rem/* 8px */;

    width: 1000px;
    height: 500px;

    left: 25%;
    right: 25%;

    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-top: 5rem/* 80px */;
`