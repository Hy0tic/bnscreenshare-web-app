import { TextInput, Button, Box } from '@mantine/core';
import { useForm } from '@mantine/form';

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
            <div className="Join-Lobby border-b-2 border-slate-700">
                <form onSubmit={form.onSubmit((input) => handleJoinLobby(input))}>
                    <div className="mx-3">
                        <div className="text-md font-semibold text-gray-500 p-1">Lobby Id</div>
                        <TextInput
                            placeholder="23a4e"
                            radius="md"
                            size="md"
                            {...form.getInputProps('lobbyId')}
                        />
                    </div>

                    <div className="mx-3">
                        <div className="text-md font-semibold text-gray-500 p-1">Username</div>
                                                    <TextInput
                                                    placeholder="Varvalian"
                                                    radius="md"
                                                    size="md"
                                                    {...form.getInputProps('username')}
                                                    />
                    </div>

                    <div className="px-8 m-3 justify-center items-center flex flex-row">
                        <Button variant="outline" color="gray" type="submit">Join Lobby</Button>
                    </div>
                </form>
            </div>

            <div className="Host-Lobby h-1/3">
                    <div className="m-3 mt-8 justify-center items-center flex flex-row">
                        <Button variant="outline" color="gray" onClick={createLobby}>Host Lobby</Button>
                    </div>
            </div>
        </Box>
    )
}

export default LobbyForm;