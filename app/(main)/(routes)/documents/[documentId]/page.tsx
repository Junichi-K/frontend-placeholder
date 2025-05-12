"use client";

import { Cover } from "@/components/cover";
import  Editor  from "@/components/editor";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCsrf } from "@/context/CsrfContext";
import { useUpdateCoverImage } from "@/context/update-cover-image";
import { use, useEffect, useState } from "react";
import {toast} from "sonner";

interface Document {
    id: number;
    title: string;
    content?: string; // if applicable
    isArchived?: boolean;
    icon?: string;
    coverImage?: string;
}

interface DocumentIdPageProps {
    params: Promise<{
        documentId: number;
    }>
}

const DocumentIdPage = ({params} : DocumentIdPageProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [document, setDocument] = useState<Document | null>(null);
    const [editorContent, setEditorContent] = useState<string>("");

    const {updateCoverImage, setUpdateCoverImage} = useUpdateCoverImage();
    const { csrfToken } = useCsrf();

    const { documentId } = use(params);

    
    useEffect(() => {
        const fetchDocument = async () => {
            setIsLoading(true);
    
            try {
                const response = await fetch(`http://localhost:8080/document/${documentId}`, {
                    method: "GET",
                    credentials: "include"
                });
    
                if(!response.ok) {
                    const msg = await response.text();
                    throw new Error(msg || "Failed to fetch the document");
                }
    
                const data = await response.json();
                setDocument(data);
    
            } catch (err: any) {
                console.error("Error fetching document: ", err);
            } finally{
                setIsLoading(false);
                setUpdateCoverImage(false);
            }
        }

        fetchDocument();
    },[updateCoverImage]);

    if(isLoading) {
        return (
            <div>
                <Cover.Skeleton/>
                <div className="max-w-4xl">
                    <div className="space-y-4 pl-8 pt-4">
                        <Skeleton className="h-14 w-[50%] bg-white/20"/>
                        <Skeleton className="h-4 w-[80%] bg-white/20"/>
                        <Skeleton className="h-4 w-[40%] bg-white/20"/>
                        <Skeleton className="h-4 w-[60%] bg-white/20"/>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="pb-40">
            <Cover url={document?.coverImage}/>
            <div className="max-w-4xl mx-auto-THIS-DOESN'T-WORK-CORRECTLY">
                <Toolbar initialData={document}/>
                <Editor
                    initialContent={document?.content}
                />
            </div>
        </div>
    )
}

export default DocumentIdPage;
