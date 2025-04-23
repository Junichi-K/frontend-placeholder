"use client";


import EmojiPicker, {Theme} from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface IconPickerProps {
    onChange: (icon: string) => void;
    children: React.ReactNode;
    asChild?: boolean;
}

export const IconPicker = ({
    onChange,
    children,
    asChild
} : IconPickerProps) => {
    const theme = Theme.DARK;

    return (
        <Popover>
            <PopoverTrigger asChild={asChild}>
                {children}
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full border-none shadow-none">
                <div className="border-2 border-solid border-[#3b2250] rounded-md overflow-hidden bg-[#1A022F]">
                <EmojiPicker
                    height={350}
                    theme={theme}
                    onEmojiClick={(data) => onChange(data.emoji)}
                />
                </div>
            </PopoverContent>
        </Popover>
    )
}