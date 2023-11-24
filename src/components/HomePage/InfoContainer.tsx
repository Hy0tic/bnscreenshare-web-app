

const InfoContainer = () => {
    return (
        <div className="InfoContainer text-xl m-10">
            <h1 className="font-bold text-5xl drop-shadow-2xl">
                No Hassle <br/>Screen Sharing
            </h1>

            <br/>

            <ul>
                <li className="flex flex-row"><img className="h-5 mr-2" src="https://bucket.bn-chat.net/bnft.svg"/>Up to 1080p 60fps</li>
                <li className="flex flex-row"><img className="h-5 mr-2" src="https://bucket.bn-chat.net/bnft.svg"/>Includes lobby chat system</li>
                <li className="flex flex-row"><img className="h-5 mr-2" src="https://bucket.bn-chat.net/bnft.svg"/>No login necessary</li>
            </ul>

            <div className="text-sm pt-2">
                warning: if you can't see the stream, you may need to enable WebRTC in your browser
            </div>
        </div>
    )
}

export default InfoContainer;