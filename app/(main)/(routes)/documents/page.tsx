"use client";

import { Button } from "@/components/ui/button";
import { useCsrf } from "@/context/CsrfContext";
import { PlusCircle, Router } from "lucide-react";
import {toast} from "sonner";
import Image from "next/image";
import { useDocumentContext } from "@/context/DocumentContext";
import { useRouter } from "next/navigation";


const DocumentsPage = () => {
    const { csrfToken } = useCsrf();
    const { setIsNoteAdded } = useDocumentContext();
    const router = useRouter();

    if(!csrfToken) {
        alert("CSRF token not available. Please try again later.");
        return;
    }

    const handleAddNote = async () => {
        try {
            const response = await fetch("http://localhost:8080/document", {
                method: "POST",
                credentials: "include",
                
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                
                body: JSON.stringify({})
            });

            if(!response.ok)
                throw new Error("Failed to add note");

            const data = await response.json();
            console.log("Document added: ", data);

            toast.success("New Note added successfully!");

            setIsNoteAdded(true);

            router.push(`/documents/${data.id}`);
        }

        catch(err) {
            console.error("Error Adding document:", err);
            toast.error("Failed to add note.");
        }
    };
    
    return (
        <div className="text-white h-full flex flex-col items-center justify-center space-y-8">
            <Image
                src="/detective.png"
                height="300"
                width="300"
                alt="detective"
            />

            <h2 className="text-lg font-medium">
                Hmmm... It's a little lonely in here! Add some data to get started
            </h2>

            <Button variant="secondary" onClick={handleAddNote}>
                <PlusCircle className="h-4 w-4"/>
                Add a Note
            </Button>
        </div>
    )
}

export default DocumentsPage;