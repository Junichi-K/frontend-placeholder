"use client";

import { ConfirmModal } from "@/components/Modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useCsrf } from "@/context/CsrfContext";
import { useDocumentContext } from "@/context/DocumentContext";
import { useUpdateNavbar } from "@/context/update-navbar-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface BannerProps {
    documentId: number | null;
}

export const Banner = ({ documentId } : BannerProps) => {
    const router = useRouter();
    const {csrfToken} = useCsrf();
    const [isRestoring, setIsRestoring] = useState(false);
    const {setIsNoteAdded} = useDocumentContext();
    const {setUpdateNavbar} = useUpdateNavbar();
    
    const onRemove = async (documentId: number | null) => {
        try {
            if(!csrfToken) {
                toast.error("CSRF Token is missing!");
                return;
            }

            const res = await fetch(`http://localhost:8080/document/${documentId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
            });

            if(!res.ok) {
                throw new Error("Delete Failed");
            }

            toast.success("Note Deleted Permanently");

            router.push("/documents");
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Failed to delete note");
        }
    } 

    const onRestore = async(documentId: number | null) => {
        try {
            if(!csrfToken) {
                toast.error("CSRF Token is missing!");
                return;
            }

            const res = await fetch(`http://localhost:8080/document/${documentId}/unarchive`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });

            if(!res.ok) {
                throw new Error("Restore Failed");
            }

            setIsNoteAdded(true);
            setUpdateNavbar(true);

            toast.success("Note Restored");
        } catch(err) {
            console.error("Restore failed", err);
            toast.error("Failed to restore note");
        } finally {
            setIsRestoring(false);
        }
    }

    return (
        <div className="w-full bg-rose-500 text-center p-2 flex items-center gap-x-2 justify-center">
            <p>This Document is currently in the Trash</p>
            <Button
                onClick={() => onRestore(documentId)}
                variant="outline"
                className="bg-transparent hover:bg-rose-700 hover:text-white p-1 px-2" 
            >
                Restore Document
            </Button>
            <ConfirmModal
                onDelete={() => onRemove(documentId)}
            >
                <Button
                    variant="outline"
                    className="bg-transparent hover:bg-rose-700 hover:text-white p-1 px-2" 
                >
                    Delete Document Forever
                </Button>
            </ConfirmModal>
        </div>
    )
}