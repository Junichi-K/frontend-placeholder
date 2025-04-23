"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCsrf } from "@/context/CsrfContext";
import { useDocumentContext } from "@/context/DocumentContext";
import { useUpdateNavbar } from "@/context/update-navbar-context";
import { useUser } from "@/context/UserContext";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import {toast} from "sonner";

interface MenuProps {
    documentId: number | null;
}

export const Menu = ({documentId} : MenuProps) => {
    const {csrfToken} = useCsrf();
    const {setIsNoteDeleted} = useDocumentContext();
    const {setUpdateNavbar} = useUpdateNavbar();
    const {user} = useUser();

    const onArchive = async () => {
        try {
            if(!csrfToken) {
                toast.error("CSRF token is missing.");
                return;
            }

            const response = await fetch(`http://localhost:8080/document/${documentId}/archive`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });

            if(!response.ok) {
                throw new Error("Failed to archive document");
            }

            toast.success("Note moved to Trash!");

            setIsNoteDeleted(true);
            setUpdateNavbar(true);

        } catch (err) {
            console.error("Failed to archive document:", err);
            toast.error("Failed to move note to trash");
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <MoreHorizontal className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="end" alignOffset={8} forceMount>
                <DropdownMenuItem onClick={onArchive}>
                    <Trash className="h-4 w-4 mr-2"/>
                    Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                    <div className="p-2">
                        Last edited by: {user?.name}
                    </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}