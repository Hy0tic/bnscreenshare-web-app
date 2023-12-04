import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mantine/core';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined';

const Video = ({user, defaultMuteValue} : {user:string, defaultMuteValue:boolean}) => {
    const [isMuted, setIsMuted] = useState(defaultMuteValue);
    const [volume, setVolume] = useState<number>(1);

    let id;
    if(user === "1")
    {
        id="user-1";
    }
    else{
        id="user-2";
    }

    const videoRef = useRef<HTMLVideoElement | null>(null);

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
            changeVolumeThroughArrowKeys(Math.min(volume + 0.05, 1));
        } else if (event.key === 'ArrowDown') {
            changeVolumeThroughArrowKeys(Math.max(volume - 0.05, 0));
        }
    };

    const changeVolumeThroughArrowKeys = (v:number) => {
        const video = videoRef.current;
        if (video) {
            video.volume = v;
        }
        setVolume(v);
    }
    
    useEffect(() => {
        const video = videoRef.current;
        const preventPlayPauseOnClick = (event: { preventDefault: () => any; }) => event.preventDefault();

        const handleVolumeChange = () => {
            if (video) {
                setVolume(video.volume);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        if (video) {
            video.muted = isMuted;
            video.addEventListener('volumechange', handleVolumeChange);
            video.addEventListener('click', preventPlayPauseOnClick);
        }
    
        return () => {
            if (video) {
                video.removeEventListener('volumechange', handleVolumeChange);
                video.removeEventListener('click', preventPlayPauseOnClick);
            }
            window.removeEventListener('keydown', handleKeyPress);
        };
    });
    
    const toggleMute = () => {
        const video = videoRef.current;
        if(video)
        {
            video.muted = !video.muted;
            setIsMuted(video.muted);
        }
    };

    const handleFullScreen = () => {
        if (videoRef.current) {
            if (!document.fullscreenElement) {
                videoRef.current.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    }

    const changeVolume = (e: ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        const newVolume = parseFloat(e.target.value);
        if (video) {
            video.volume = newVolume;
        }
        setVolume(newVolume);
    };
    
    return (<div className='relative'>
        <StyledVideo ref={videoRef} className="video-player" id={id} autoPlay playsInline onClick={handleFullScreen}>
        </StyledVideo>
        <div className='absolute buttons right-0'>
            <input
                className='mx-2'
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={changeVolume} 
            />
            <Button className='items-center justify-center' variant="outline" color="gray" onClick={toggleMute}>
                {isMuted ? <VolumeOffOutlinedIcon/> : <VolumeUpOutlinedIcon/>}
            </Button>
            <Button variant="outline" color="gray" onClick={handleFullScreen}><FullscreenOutlinedIcon/></Button>
        </div>
    </div>)
}

const StyledVideo = styled.video`
    margin: 10px;
    display: grid;
    gap: 2em;
    background-color: rgb(40, 40, 40, .5);
    aspect-ratio: 16/9;
    height: 90vh;
    overflow: hidden;
    border-style: solid;
    border-color: black;
    border-radius: 10px;
    object-fit: contain;
`

export default Video;
