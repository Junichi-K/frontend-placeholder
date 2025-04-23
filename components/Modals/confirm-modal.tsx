"use client";

import { useState } from "react";
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
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
    children: React.ReactNode;
    onDelete: () => void;
    onOpenChange?: (open: boolean) => void;
}

export const ConfirmModal = ({
    children,
    onDelete,
    onOpenChange
}: ConfirmModalProps) => {
    const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        onDelete();
    };

    return (
        <AlertDialog onOpenChange={onOpenChange}>
            <AlertDialogTrigger onClick={(e) => e.stopPropagation()} asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogOverlay onClick={(e) => e.stopPropagation()} />
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Warning</AlertDialogTitle>
                    <AlertDialogDescription>
                        Anything you delete from Trash is gone forever!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
