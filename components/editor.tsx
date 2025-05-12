"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCsrf } from "@/context/CsrfContext";
import { toast } from "sonner";

interface EditorProps {
    initialContent?: string;
}

const Editor = ({ initialContent }: EditorProps) => {
    const [editorContent, setEditorContent] = useState<string>("");
    const pathname = usePathname();
    const { csrfToken } = useCsrf();

    const documentId = pathname?.split("/").pop();

    const editor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    });

    // Autosave every 5 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            if (!editorContent || !documentId || !csrfToken) return;

            try {
                await fetch(`http://localhost:8080/document/${documentId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken,
                    },
                    credentials: "include",
                    body: JSON.stringify({ content: editorContent }),
                });
                // toast.success("Autosaved"); // optional
            } catch (error) {
                console.error("Autosave failed:", error);
                toast.error("Autosave failed");
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [editorContent, documentId, csrfToken]);

    return (
        <div className="blocknote-wrapper ml-5">
            <BlockNoteView
                editor={editor}
                theme={{
                    colors: {
                        editor: {
                            background: "transparent", // This now works!
                            text: "#ffffff",
                        },
                        menu: {
                            background: "#111111",
                        },
                    },
                }}
            />
        </div>
    );
    
};

export default Editor;