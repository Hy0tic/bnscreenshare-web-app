import { Key, useContext, useEffect, useRef, useState } from "react";
import SignalRContext from "../SignalR/SignalRContext";
import EmojiPickerButton from "./EmojiPickerButton";
import styled from "styled-components";

type Message = 
{
    username : string;
    content: string;
    usernameColors: number[];
}

const Chat = ({Username,
    LobbyId,
    isEnabled,
    usernameColors
    } 
    :
    {Username: string,
    LobbyId : string,
    isEnabled : boolean,
    usernameColors: number[]}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const connection = useContext(SignalRContext);

    useEffect(() => {
        connection?.on("ReceiveMessage", handleReceiveMessage);
        connection?.on("MemberJoined", handleMemberJoined);
        connection?.on("CallerLeft", handleUserLeft);
        }, [])

    const sendMessage = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (Username.trim() && content.trim()) {
            setContent('');
            connection?.invoke("SendMessage", Username, content, LobbyId, usernameColors);
        }
       // Scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    };

    const handleReceiveMessage = (username: string, content: string, usernameColors: number[]) =>
    {
        if (username.trim() && content.trim()) {
            const newMessage = { username, content, usernameColors };
            setMessages((prevMessages: any) => [...prevMessages, newMessage]);
        }
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleMemberJoined = (uid: string) => {
        connection?.invoke("SendMessage", "Notification", `A new user joined: ${ uid }`, LobbyId, usernameColors);
    }

    const handleUserLeft = (value:string) =>{
        connection?.invoke("SendMessage", "Notification", `${value}`, LobbyId, usernameColors);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage(event);
        }
    };

    return (<>
        {isEnabled ? 
            <StyledChatContainer>
                <StyledMessagesContainer>
                    {messages.map((message: Message, index: Key | null | undefined) => (
                        <div key={index} className="message mb-1 text-xl">
                            <strong style={{ color: `rgb(${message.usernameColors[0]}, ${message.usernameColors[1]}, ${message.usernameColors[2]})` }}>{message.username}:</strong> {message.content}
                        </div>
                    ))}
                    <div className="h-4 m-3" ref={messagesEndRef}></div>
                </StyledMessagesContainer>

                <form onSubmit={sendMessage} className="InputArea border-2 border-gray-700 bg-gray-900 absolute bottom-0 w-full h-auto">
                    <div className="relative flex flex-row">
                            <textarea maxLength={130} className="bg-gray-950 ml-1 w-full overflow-auto no-scrollbar"
                                value={content}
                                onChange={(e) => setContent(e.target.value)} 
                                placeholder="type a message"
                                onKeyDown={handleKeyDown} />
                            <EmojiPickerButton
                                onEmojiPick={(emoji) =>
                                    setContent((content) => content.concat(emoji))
                                }
                            />
                    </div>
                </form> 
        
            </StyledChatContainer>
            :
            <></>
        }
    </>
    )
}

export default Chat;

const StyledChatContainer = styled.div`
    flex-direction: column;
    position: relative;
    margin-left: 0.75rem;
    height: 90vh;
    width: 20%;
    --tw-bg-opacity: 1;
    background-color: rgb(17 24 39 / var(--tw-bg-opacity));
    border-radius: 0.375rem;
    overflow: hidden;
    border-left: solid gray 1px;
`;

const StyledMessagesContainer = styled.div`
    height: 100%;
    width: 100%;
    flex: 1 1 0%;
    padding: 2.5rem;
    overflow: scroll;
    overflow-y: hidden;
    overflow-wrap: break-word;
    --tw-text-opacity: 1;
    color: rgb(203 213 225 / var(--tw-text-opacity));
`;