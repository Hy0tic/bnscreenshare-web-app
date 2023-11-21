import { HiOutlineEmojiHappy } from 'react-icons/hi'
import useEmojiPicker from '../../hooks/useEmojiPicker'
import Picker from "@emoji-mart/react";
import { Box } from '@mantine/core';
import { useOnClickOutside } from '../../hooks/EmojiHook';
import { useRef } from 'react';

const EmojiPickerButton = ({
    onEmojiPick: handleEmojiPick,
}: {
    onEmojiPick: (emoji: string) => void
}) => {
    const { toggleEmojiPicker, isOpen, dismissPicker } =
        useEmojiPicker(handleEmojiPick);

    const addEmoji = (emoji:any) => {
        if ("native" in emoji) {
            handleEmojiPick(`${emoji.native}`)
        }
    };
    const ref = useRef(null);

    const handleClickOutside = () => {
        dismissPicker();
      };
    useOnClickOutside(ref, handleClickOutside);


    return (
        <div className="relative flex flex-col">

            <div ref={ref} >
            <button
                type="button"
                onClick={toggleEmojiPicker}
                className="p-1 rounded  hover:bg-gray-400/50"
            >
                <HiOutlineEmojiHappy className=" w-5 h-5 my-auto" />
            </button>
                <Box style={{ position: "absolute", right: 0, bottom: 50 }}>
                    {isOpen && (
                        <Picker
                            previewPosition={"none"}
                            navPosition={"bottom"}
                            native={true}
                            onEmojiSelect={addEmoji}
                        />
                        )}
                </Box>
            </div>
        </div>
    )
}

export default EmojiPickerButton