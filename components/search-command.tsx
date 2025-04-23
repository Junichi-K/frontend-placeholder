"use client";

import { useUser } from "@/context/UserContext";
import { useSearch } from "@/hooks/use-search";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";

interface Document {
	id: number;
	title: string;
	parentId: number | null;
	isArchived?: boolean;
	icon?: string;
}

export const SearchCommand = () => {
    const user = useUser();
    const router = useRouter();

    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMouted] = useState(false);

    const toggle = useSearch((store) => store.toggle);
    const isOpen = useSearch((store) => store.isOpen);
    const onClose = useSearch((store) => store.onClose);

    useEffect(() => {
        const fetchDocuments = async () => {
            setIsLoading(true);

            try {
                const res = await fetch(
                    `http://localhost:8080/documents?isArchived=false`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                const data = await res.json();
                setDocuments(data);
            } catch (err) {
                console.error("Failed to fetch documents", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocuments();

        setIsMouted(true);
    }, [isOpen]);

    useEffect(() => {
        const render = (event: KeyboardEvent) => {
            if(event.key === "k" && (event.ctrlKey)) {
                event.preventDefault();
                toggle();
            }
        }

        document.addEventListener("keydown", render);

        return () => {
            document.removeEventListener("keydown", render);
        };
    }, [toggle])

    const onSelect = (id: string) => {
        router.push(`/documents/${id}`);
        onClose();
    }

    if(!isMounted) {
        return null;
    }

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <DialogTitle className="sr-only">Search Documents</DialogTitle>
            <CommandInput placeholder="Search for your Documents..."/>
            <CommandList>
                <CommandEmpty>No results found...</CommandEmpty>
                <CommandGroup heading="Documents">
                    {documents.map((doc) => (
                        <CommandItem 
                            key={doc.id}
                            value={`${doc.id}-${doc.title}`}
                            title={doc.title}
                            onSelect={onSelect}
                        >
                            {doc.icon ? (
                                <p className="mr-2 text-[18px]">
                                    {doc.icon}
                                </p>
                            ) : (
                                <File className="mr-2 h-4 w-4"/>
                            )}

                            <span>
                                {doc.title}
                            </span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}

