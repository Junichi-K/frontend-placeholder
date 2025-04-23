"use client";

import { Toolbar } from "@/components/toolbar";
import { use, useEffect, useState } from "react";

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
            }
        }

        fetchDocument();
    },[]);


    if(isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div className="pb-40">
            <div className="h-[35vh]"/>
            <div className="max-w-4xl mx-auto-THIS-DOESN'T-WORK-CORRECTLY">
                <Toolbar initialData={document}/>
            </div>
        </div>
    )
}

export default DocumentIdPage;