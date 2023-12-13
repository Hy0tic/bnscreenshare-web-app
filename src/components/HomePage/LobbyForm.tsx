import { TextInput, Button, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import styled from 'styled-components';

const LobbyForm = ({
        handleJoinLobby,
        createLobby
    }
        :
    {
        handleJoinLobby : ({ lobbyId, username } : { lobbyId:string, username:string }) => void,
        createLobby : () => void
    }
    ) => {

    const form = useForm({
        initialValues: {
            lobbyId: '',
            username: ''
            },
            validate: {
            lobbyId: (value) => (/^.{3,}$/.test(value) ? null : 'Invalid Id'),
            username: (value) => (/^.{1,}$/.test(value) ? null : 'username cant be empty')
            },
        });

    return (
        <Box className=" bg-gray-800 rounded-lg w-1/3 h-4/6 relative drop-shadow-lg m-10 mt-0 mb-0">
            <StyledJoinLobbySection>
                <form onSubmit={form.onSubmit((input) => handleJoinLobby(input))}>
                    <StyledInputContainer>
                        <StyledLabel>Lobby Id</StyledLabel>
                        <TextInput
                            placeholder="23a4e"
                            radius="md"
                            size="md"
                            {...form.getInputProps('lobbyId')}
                        />
                    </StyledInputContainer>

                    <StyledInputContainer>
                        <StyledLabel>Username</StyledLabel>
                        <TextInput
                            placeholder="Varvalian"
                            radius="md"
                            size="md"
                            {...form.getInputProps('username')}
                        />
                    </StyledInputContainer>

                    <StyledJoinLobbyButtonContainer>
                        <Button variant="outline" color="gray" type="submit">Join Lobby</Button>
                    </StyledJoinLobbyButtonContainer>
                </form>
            </StyledJoinLobbySection>

            <div className="Host-Lobby h-1/3">
                    <StyledHostLobbyButtonContainer>
                        <Button variant="outline" color="gray" onClick={createLobby}>Host Lobby</Button>
                    </StyledHostLobbyButtonContainer>
            </div>
        </Box>
    )
}

export default LobbyForm;

const StyledJoinLobbySection = styled.div`
    border-bottom-width: 2px;
    --tw-border-opacity: 1;
    border-color: rgb(51 65 85 / var(--tw-border-opacity));
`;

const StyledLabel = styled.div`
    font-weight: 600;
    --tw-text-opacity: 1;
    color: rgb(107 114 128 / var(--tw-text-opacity));
    padding: 0.25rem;
`;

const StyledJoinLobbyButtonContainer = styled.div`
    padding-left: 2rem;
    padding-right: 2rem;
    margin: 0.75rem;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
`;

const StyledHostLobbyButtonContainer = styled.div`
    margin: 0.75rem;
    margin-top: 2rem;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
`;

const StyledInputContainer = styled.div`
    margin-left: 0.75rem;
    margin-right: 0.75rem;
`;