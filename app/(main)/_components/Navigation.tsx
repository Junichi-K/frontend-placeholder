"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon, PlusCircle, Search, Settings, Trash } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { UserInfo } from "./user-info";
import { useDocumentContext } from "@/context/DocumentContext";
import { useCsrf } from "@/context/CsrfContext";
import { DocumentItem } from "./DocumentItem";
import { toast } from "sonner";
import { SidebarDocumentList } from "./SidebarDocumentList";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TrashBox } from "./trash-box";
import { ConfirmModal } from "@/components/Modals/confirm-modal";
import { useSearch } from "@/hooks/use-search";
import { SettingsModal } from "@/components/Modals/settings-modal";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "./Navbar";

interface Document {
    id: number;
    title: string;
}

export const Navigation = () => {
    const isResizingRef = useRef(false);
    const sidebarRef = useRef<HTMLElement | null>(null);
    const mainAreaRef = useRef<HTMLDivElement | null>(null);
    const search = useSearch();
    const router = useRouter();
    const params = useParams();

    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { csrfToken } = useCsrf();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(320);

    const { isNoteAdded, setIsNoteAdded } = useDocumentContext();

    const fetchDocuments = async () => {
        try {
            const res = await fetch("http://localhost:8080/document", {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();
            setDocuments(data);
        }
        catch(err) {
            console.error("Failed to fetch Documents: ", err);
        }
    };

    const handleAddNote = async () => {
        try {
            if (!csrfToken) {
                toast.error("CSRF token is missing.");
                return;
            }

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
    
    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        if(isNoteAdded) {
            fetchDocuments();
            setIsNoteAdded(false);
        }
    }, [isNoteAdded, setIsNoteAdded]);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp)
    }

    const handleMouseMove = (event: MouseEvent) => {
        if(!isResizingRef.current)
            return;

        let newWidth = event.clientX;

        if(newWidth < 320)
            newWidth = 320;

        if(newWidth > 960)
            newWidth = 960;

        setSidebarWidth(newWidth);

        if(sidebarRef.current && mainAreaRef.current) {
            sidebarRef.current.style.setProperty("width", `${newWidth}px`)

            mainAreaRef.current.style.setProperty("left", `${newWidth}`)
            mainAreaRef.current.style.setProperty("width", `calc(100% - ${newWidth})px`);
        }
    }

    const handleMouseUp = () => {
        isResizingRef.current = false;

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }

    const resetWidth = () => {
        setIsCollapsed(false);
        setIsResetting(true);
        
        if(sidebarRef.current && mainAreaRef.current) {
            sidebarRef.current.style.setProperty("width", "320px");

            mainAreaRef.current.style.setProperty("left", "320px");
            mainAreaRef.current.style.setProperty("width", "calc(100% - 320px)");

            setTimeout(() => setIsResetting(false), 300);
        }
    }

    const collapse = () => {
        if(sidebarRef.current && mainAreaRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.setProperty("width", "0px");

            mainAreaRef.current.style.setProperty("left", "0px");
            mainAreaRef.current.style.setProperty("width", "100%");

            setTimeout(() => setIsResetting(false), 300);
        }
    }

    const handleModalRender = () => {
        setShowConfirmModal(true);
    }

    /*const handleUnderstand = () => {
        setShowConfirmModal(false);
    }*/

    return (
        <>
            <aside ref={sidebarRef} className={cn("group/sidebar bg-[#1A022F] overflow-y-auto w-80 relative", isResetting && "transition-all ease-in-out duration-300")}>
                <div 
                    role="button" 
                    className="absolute h-8 w-8 hover:bg-[#2A1A5E] rounded-sm top-4 right-4 opacity-0 group-hover/sidebar:opacity-100 transition duration-300"
                    onClick = {collapse}>
                    <ChevronsLeft className="h-8 w-8"/>
                </div>
                <div>
                    <UserInfo/>
                    <DocumentItem label="Search" icon={Search} isSearch onClick={search.onOpen}></DocumentItem>
                    <SettingsModal>
                        <DocumentItem label="Settings" icon={Settings} onClick={() => {}}></DocumentItem>
                    </SettingsModal>
                    <DocumentItem onClick={handleAddNote} label="New Page" icon={PlusCircle}/>
                </div>

                <div 
                    className="absolute top-0 right-0 w-1 h-full bg-[#2A1A5E] opacity-0 group-hover/sidebar:opacity-100 cursor-ew-resize transition-opacity duration-200"
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                />
                
                <div className="px-4 py-6 space-y-2">
                    <SidebarDocumentList/>
                    <Popover>
                        <PopoverTrigger className="w-full mt-4">
                            <div onClick={handleModalRender}>
                                <DocumentItem label="Trash" icon={Trash}/>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent side="right" className="p-0 w-72 border-[#3b2250] overflow-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent rounded-md h-full">
                            <TrashBox />
                        </PopoverContent>
                    </Popover>
                </div>
            </aside>

            <div ref={mainAreaRef} style={{ left: sidebarWidth, width: `calc(100% - ${sidebarWidth}px)` }} className={cn("absolute top-0", isResetting && "transition-all ease-in-out duration-300")}>
                {!!params.documentId ? (
                    <Navbar
                        isCollapsed={isCollapsed}
                        onResetWidth={resetWidth}
                    />
                ) : (
                    <nav 
                        className="bg-transparent px-3 py-2 w-full"
                        onClick = {resetWidth}
                    >
                        {isCollapsed && <MenuIcon role="button" className="h-6 w-6 "/>}
                    </nav>
                )}
            </div>
        </>
    );
};