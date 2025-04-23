"use client";

import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogTitle,
    AlertDialogTrigger
} from "../ui/alert-dialog";

interface SettingsModalProps {
    children: React.ReactNode;
    onAction?: () => void;
    onOpenChange?: (open: boolean) => void;
}

export const SettingsModal = ({
    children,
    onAction,
    onOpenChange
}: SettingsModalProps) => {
    const handleAction = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        onAction?.();
    };

    return (
        <AlertDialog onOpenChange={onOpenChange}>
            <AlertDialogTrigger onClick={(e) => e.stopPropagation()} asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Settings</AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className="text-muted-foreground font-semibold">
                            While the settings panel is currently empty, we plan to introduce a 
                            <span className="text-pink-500 font-bold italic animate-pulse hue-rotate-animation inline-block">
                                BRAINROT
                            </span>
                            <span className="text-yellow-400 font-semibold"> THEME </span>
                            <span className="text-blue-500 text-lg font-black" style={{ fontFamily: '"Comic Sans MS", "Papyrus", cursive' }}>
                                SkibidiSigma🐺🥶
                            </span>
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                        Cool
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleAction}>
                        Not Cool
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
