import { Key, useContext, useEffect, useRef, useState } from "react";
import SignalRContext from "../SignalR/SignalRContext";
import EmojiPickerButton from "./EmojiPickerButton";

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
    const [username] = useState(Username);
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
        if (username.trim() && content.trim()) {
            setContent('');
            connection?.invoke("SendMessage", username, content, LobbyId, usernameColors);
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

    return (<>
        {isEnabled ? 
            <div className="flex-col relative ml-3 h-73vh w-1/5 bg-gray-900 rounded-md overflow-hidden">
                <div className="messages h-full w-full flex-1 p-10 overflow-scroll break-words no-scrollbar text-slate-300">
                    {messages.map((message: Message, index: Key | null | undefined) => (
                        <div key={index} className="message mb-1 text-xl">
                            <strong style={{ color: `rgb(${message.usernameColors[0]}, ${message.usernameColors[1]}, ${message.usernameColors[2]})` }}>{message.username}:</strong> {message.content}
                        </div>
                    ))}
                    <div className="h-4 m-3" ref={messagesEndRef}></div>
                </div>

                <form onSubmit={sendMessage} className="InputArea border-2 border-gray-700 bg-gray-900 absolute bottom-0 w-full h-auto">
                    <div className="relative flex flex-row">
                            <input maxLength={130} className="bg-gray-950 ml-1 w-full overflow-scroll" value={content} onChange={(e) => setContent(e.target.value)} placeholder="type a message" />
                            <EmojiPickerButton
                                onEmojiPick={(emoji) =>
                                    setContent((content) => content.concat(emoji))
                                }
                            />
                    </div>
                </form> 
        
            </div>
            :
            ""
        }
    </>
    )
}

export default Chat;