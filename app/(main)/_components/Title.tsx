"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCsrf } from "@/context/CsrfContext";
import { useDocumentContext } from "@/context/DocumentContext";
import { useToolbar } from "@/context/update-toolbar-context";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface Document {
    id: number;
    title?: string;
    content?: string;
    icon?: string;
}

interface TitleProps {
    initialData: Document | null;
}

export const Title = ({ initialData }: TitleProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(initialData?.title || "Untitled");
    const [originalTitle, setOriginalTitle] = useState(initialData?.title || "Untitled");
    const [didSubmit, setDidSubmit] = useState(false);

    const { isNoteAdded, setIsNoteAdded } = useDocumentContext();
    const { setUpdateToolbar } = useToolbar();

    const { csrfToken } = useCsrf();

    const enableInput = () => {
        setOriginalTitle(title); // save current before editing
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
        }, 0);
    };

    const disableInput = () => {
        setIsEditing(false);
        if (!didSubmit) {
            setTitle(originalTitle); // revert if not submitted
        }
        setDidSubmit(false); // reset for next time
    };

    const updateDocument = async (id: number, updates: Partial<Document>) => {
        if (!csrfToken) {
            toast.error("CSRF token is missing.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/document/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken
                },
                credentials: "include",
                body: JSON.stringify(updates),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Failed to update document:", errorText);
                toast.error("Failed to update document.");
                return;
            }

            const updatedDoc = await res.json();

            setTitle(updatedDoc.title || "Untitled");
            setIsNoteAdded(true);
            setUpdateToolbar(true);

            toast.success("Document updated!");
        } catch (err) {
            console.error("Error updating document:", err);
            toast.error("Something went wrong while updating.");
        }
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value); // don't default to "Untitled" yet
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            disableInput();
            const finalTitle = title.trim() === "" ? "Untitled" : title;

            setTitle(finalTitle); // update local title so UI shows it right away
            setDidSubmit(true); // prevent reverting on blur

            if (initialData?.id) {
                updateDocument(initialData.id, { title: finalTitle });
            }
        }
    };

    return (
        <div className="flex items-center gap-x-1">
            {!!initialData?.icon && <p>{initialData.icon}</p>}

            {isEditing ? (
                <Input
                    ref={inputRef}
                    onClick={enableInput}
                    onBlur={disableInput}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={title}
                    className="px-2 h-auto text-white bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none shadow-none w-40"
                />
            ) : (
                <Button
                    onClick={enableInput}
                    variant="ghost"
                    size="lg"
                    className="h-auto p-1"
                >
                    <span className="truncate px-4 py-1">{title}</span>
                </Button>
            )}
        </div>
    );
};

Title.Skeleton = function TitleSkeleton() {
    return (
        <Skeleton className="h-9 w-20 rounded-md"/>
    );
};