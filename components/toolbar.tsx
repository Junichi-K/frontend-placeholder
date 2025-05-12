"use client";

import { ImageIcon, Smile, X } from "lucide-react";
import { IconPicker } from "./icon-picker";
import { Button } from "@/components/ui/button";
import { ElementRef, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCsrf } from "@/context/CsrfContext";
import { useDocumentContext } from "@/context/DocumentContext"
import TextareaAutosize from "react-textarea-autosize"
import { useUpdateNavbar } from "@/context/update-navbar-context";
import { useToolbar } from "@/context/update-toolbar-context";
import { useCoverImage } from "@/hooks/use-cover-image";
import { CoverImageModal } from "./Modals/cover-image-modal";

interface Document {
    id: number;
    title: string;
    content?: string; // if applicable
    isArchived?: boolean;
    icon?: string;
    coverImage?: string;
}

interface ToolbarProps {
    initialData: Document | null;
    preview?: boolean;
}

export const Toolbar = ({initialData, preview} : ToolbarProps) => {
    const inputRef = useRef<ElementRef<"textarea">>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialData?.title);
    const [icon, setIcon] = useState(initialData?.icon);

    const { csrfToken } = useCsrf();
    const { setIsNoteAdded } = useDocumentContext();
    const { setUpdateNavbar } = useUpdateNavbar();
    const { updateToolbar, setUpdateToolbar } = useToolbar(); 

    const coverImage = useCoverImage();

    const updateDocument = async (id: number, updates: Partial<Document>) => {
        if(!csrfToken) {
            toast.error("CSRF token is missing");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/document/${initialData?.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken
                },

                credentials: "include",
                body: JSON.stringify(updates)
            });

            if(!response.ok) {
                const errorText = await response.text();
                console.error("Failed to update document: ", errorText);

                toast.error("Failed to update document");
                return;
            }

            const updatedDoc = await response.json();
            setValue(updatedDoc.title);
            setIsNoteAdded(true);
            setUpdateNavbar(true);

            toast.success("Document updated!");

        } catch (err) {
            console.error("Error updating document: ", err);
            toast.error("Something went wrong while updating");
        }
    }

    const removeIcon = async () => {    
        if (!csrfToken) {
            toast.error("CSRF token missing!");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8080/document/${initialData?.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                credentials: "include",
                body: JSON.stringify({ icon: null }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to remove icon:", errorText);
                toast.error("Failed to remove icon");
                return;
            }
    
            const updatedDoc = await response.json();
            setValue(updatedDoc.title);
            setIsNoteAdded(true);
            setUpdateNavbar(true);
    
            toast.success("Icon removed successfully!");
        } catch (err) {
            console.error("Error removing icon:", err);
            toast.error("Something went wrong while removing the icon");
        }
    };
    

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await fetch(`http://localhost:8080/document/${initialData?.id}`, {
                    method: "GET",
                    credentials: "include"
                });
    
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Failed to fetch document: ", errorText);
                    return;
                }
    
                const data = await response.json();
                setValue(data.title);
            } catch (err) {
                console.error("Error fetching document: ", err);
            } finally {
                setUpdateToolbar(false); // Reset flag after update
            }
        };
    
        if (updateToolbar && initialData?.id) {
            setUpdateToolbar(false);
            fetchDocument();
        }
    }, [updateToolbar, initialData?.id, setUpdateToolbar]);

    const enableInput = () => {
        if (preview) return;
    
        setIsEditing(true);
    
        setTimeout(() => {
            setValue(value ?? "");
            inputRef.current?.focus();
            inputRef.current?.select(); // <-- this selects the whole text
        }, 0);
    };

    const disableInput = () => {
        setIsEditing(false);
    }

    const onInput = (value: string) => {
        setValue(value);
    }

    const onKeyDown = (
            event: React.KeyboardEvent<HTMLTextAreaElement>
        ) => {
            if (event.key === "Enter") {
                event.preventDefault();
                disableInput();
            
                const finalTitle = value?.trim() === "" ? "Untitled" : value;
            
                setValue(finalTitle); // update local state immediately
            
                if (initialData?.id) {
                    updateDocument(initialData.id, { title: finalTitle });
                }
            }
    };

    const onIconSelect = (selectedIcon: string) => {
        if (!initialData?.id) {
            toast.error("No document ID found!");
            return;
        }
    
        updateDocument(initialData.id, { icon: selectedIcon });
        setIcon(selectedIcon);
    };
    

    const onRemoveIcon = async () => {
        if(!icon) {
            return;
        }

        await removeIcon();
        setIcon(undefined);
    };
    

    return (
        <div className="pl-[70px] group relative">
            <CoverImageModal/>
            {!!icon && !preview && (
                <div className="flex items-center gap-x-2 group/icon pt-6">
                    <IconPicker onChange={onIconSelect}>
                        <p className="text-6xl hover:opacity-75 transition">
                            {icon}
                        </p>
                    </IconPicker>
                    <Button
                        onClick={onRemoveIcon}
                        className="rounded-full opacity-0 group-hover/icon:opacity-100 transition"
                        variant="outline"
                        size="icon"
                    >
                        <X className="h-4 w-4"/>
                    </Button>
                </div>
            )}

            {!!icon && preview && (
                <p className="text-6xl pt-6">
                    {icon}
                </p>
            )}

            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4 ">
                {!icon && !preview && (
                    <IconPicker asChild onChange={onIconSelect}>
                        <Button className="bg-transparent" variant="outline">
                            <Smile className="h-4 w-4 mr-2" />
                            Add Icon
                        </Button>
                  </IconPicker>
                )}

                {!initialData?.coverImage && !preview && (
                    <Button
                        className="bg-transparent"
                        onClick={coverImage.onOpen}
                        variant="outline"
                    >
                        <ImageIcon className="h-4 w-4 mr-2"/>
                        Add Cover Image
                    </Button>
                )} 
            </div>
            {isEditing && !preview ? (
                <TextareaAutosize
                    ref={inputRef}
                    onBlur={disableInput}
                    onKeyDown={onKeyDown}
                    value={value}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setValue(event.target.value)
                    }
                    className="text-5xl bg-transparent font-bold break-words outline-none text-[#CFCFCF] resize-none w-full"
                />
            ) : (
                <div
                    onClick={enableInput}
                    className="pb-12 text-5xl font-bold break-words outline-none text-[#CFCFCF]"
                >
                    {value}
                </div>
            )}
        </div>
    )
}