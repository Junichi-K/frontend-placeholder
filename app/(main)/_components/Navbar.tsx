"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Title } from "./Title";
import { Banner } from "@/app/(main)/_components/banner";
import { useDocumentContext } from "@/context/DocumentContext";
import { useUpdateNavbar } from "@/context/update-navbar-context";
import { Menu } from "./menu";

interface Document {
    id: number;
    title: string;
    content?: string; // if applicable
    isArchived?: boolean;
}

interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
}

export const Navbar = ({
    isCollapsed,
    onResetWidth
}: NavbarProps) => {
    const params = useParams();
    const [document, setDocument] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { isNoteDeleted } = useDocumentContext(); // used here for deletion
    const { updateNavbar, setUpdateNavbar } = useUpdateNavbar(); // Access the context
    const [didRestore, setDidRestore] = useState(false);  // Track if document has been restored

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                setIsLoading(true);

                const res = await fetch(`http://localhost:8080/document/${params.documentId}`, {
                    method: "GET",
                    credentials: "include"
                });

                if (!res.ok) {
                    const msg = await res.text();
                    throw new Error(msg || "Failed to fetch document");
                }

                const data = await res.json();
                setDocument(data);
            } catch (err: any) {
                console.error("Error fetching document:", err);
            } finally {
                setIsLoading(false);

                if(updateNavbar) {
                    setUpdateNavbar(false);
                }
            }
        };

        if (params.documentId) {
            fetchDocument();
        }

        //This will render when updateNavbar changes, now we have to make it false again???

    }, [params.documentId, isNoteDeleted, updateNavbar]);  // dependency on deletion flag

    const handleRestoreSuccess = () => {
        setDidRestore(true); // Once document is restored, set didRestore to true
    };

    if(isLoading) {
        return (
            <nav className="bg-black px-2 py-2 w-full flex items-center gap-x-4">
                <Title.Skeleton/>   
            </nav>
        )
    }

    return (
        <>
            <nav className="bg-black px-2 py-2 w-full flex items-center gap-x-4">
                {isCollapsed && (
                    <MenuIcon
                        role="button"
                        onClick={onResetWidth}
                        className="h-6 w-6"
                    />
                )}

                <div className="flex items-center justify-between w-full">
                    <Title initialData={document} />
                    <div className="flex items-center gap-x-2">
                        <Menu documentId={document?.id ?? null} />
                    </div>
                </div>
            </nav>

            {document?.isArchived && !didRestore && (
                <Banner
                    documentId={document?.id} // Pass didRestore to Banner to manage visibility
                                              // Pass the handler for successful restore
                />
            )}
        </>
    );
};
