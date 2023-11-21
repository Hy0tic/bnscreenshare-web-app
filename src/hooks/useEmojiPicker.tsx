import { useState } from 'react'

export default function useEmojiPicker(
    handleEmojiPick: (emoji: string) => void
) {
    const [isOpen, setIsOpen] = useState(false)

    const handleEmojiClick = (
        { emoji }: {emoji:any},
        _:any
    ) => {
        handleEmojiPick(emoji)
    }

    const toggleEmojiPicker: React.MouseEventHandler = () => {
        setIsOpen((isOpen) => !isOpen)
    }

    const dismissPicker = () => {
        setIsOpen(false);
    }

    return {
        isOpen,
        toggleEmojiPicker,
        handleEmojiClick,
        dismissPicker
    }
}