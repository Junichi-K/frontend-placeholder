"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDocumentContext } from "@/context/DocumentContext";
import { useCsrf } from "@/context/CsrfContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useUpdateNavbar } from "@/context/update-navbar-context";

interface AddDocumentProps {
	label: string;
	onClick?: () => void;
	icon: LucideIcon;
	id?: number;
	documentIcon?: string;
	active?: boolean;
	expanded?: boolean;
	isSearch?: boolean;
	level?: number;
	onExpand?: () => void;
	onDelete?: () => void;
}

export const DocumentItem = ({
	id,
	label,
	onClick,
	icon: Icon,
	active,
	documentIcon,
	isSearch,
	level = 0,
	onExpand,
	expanded,
	onDelete,
}: AddDocumentProps) => {
	const { csrfToken } = useCsrf();
    const { user } = useUser();
	const { setIsNoteDeleted } = useDocumentContext();
	const { setUpdateNavbar } = useUpdateNavbar();

	const ChevronIcon = expanded ? ChevronDown : ChevronRight;

	const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.stopPropagation();
		onExpand?.();
	};

	const handleAddNote = async () => {
		try {
			if (!csrfToken) {
				toast.error("CSRF token is missing.");
				return;
			}

			const response = await fetch(`http://localhost:8080/document?parentId=${id}&isArchived=false`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": csrfToken,
				},
				body: JSON.stringify({
					title: "Untitled",
					parentId: id,
				}),
			});

			if (!response.ok) throw new Error("Failed to add note");

			const newDocId = await response.text();

			if (!expanded) {
				onExpand?.();
			}

			if(expanded) {
				const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

				onExpand?.();

				await delay(1);	

				onExpand?.();
			}

			toast.success("New Note added successfully!");
			//setIsNoteAdded(true); /*-> This one HAS TO BE STUDIED MORE DEEPER THAN DINOSAUR FOSSILS, you uncomment this line and the sidebar falls apart*/
		} catch (err) {
			console.error("Error adding document:", err);
			toast.error("Failed to add note.");
		}
	};

    const onArchive = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
    
        try {
            if (!csrfToken) {
                toast.error("CSRF token is missing.");
                return;
            }
    
            const response = await fetch(`http://localhost:8080/document/${id}/archive`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });
    
            if (!response.ok) throw new Error("Failed to archive document");
    
            toast.success("Note moved to Trash!");

			setIsNoteDeleted(true);
			setUpdateNavbar(true);

			if(onDelete) onDelete();

        } catch (err) {
            console.error("Failed to archive document:", err);
            toast.error("Failed to move note to trash");
        }

		//run the new prop function that we just created
    };
    

	return (
		<div
			onClick={onClick}
			role="button"
			style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
			className={cn(
				"group min-h-[27px] py-1 pr-3 w-full hover:bg-[hsl(288,35%,30%)] flex items-center font-medium",
				active && "bg-[hsl(288,35%,30%)]"
			)}
		>
			{!!id && (
				<div
					role="button"
					className="p-[3px] rounded-sm hover:bg-[#2A1A5E] transition-all duration-300 ease-in-out"
					onClick={handleExpand}
				>
					<ChevronIcon className="h-4 w-4" />
				</div>
			)}

			{documentIcon ? (
				<div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
			) : (
				<Icon className="shrink-0 h-[18px]" />
			)}

			<span className="truncate">{label}</span>


			{isSearch && (
				<kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100">
					<span className="text-xs">CTRL + </span>K
				</kbd>
			)}

			{!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            onClick={(event) => event.stopPropagation()}
                            asChild
                        >
                            <div 
                                role="button" 
                                className="opacity-0 group-hover:opacity-100 p-[3px] ml-auto rounded-sm hover:bg-[#2A1A5E] transition-colors duration-300 ease-in-out"
                            >
                                <MoreHorizontal className="h-4 w-4"/>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-60"
                            align="start"
                            side="right"
                            forceMount
                        >
                            <DropdownMenuItem onClick={onArchive}>
                                <Trash className="h-4 w-4 mr-2"/>
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <div className="text-sm p-2">
                                Last edited by: {user?.name}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div
                        role="button"
                        className="opacity-0 group-hover:opacity-100 p-[3px] ml-auto rounded-sm hover:bg-[#2A1A5E] transition-colors duration-300 ease-in-out"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleAddNote();
                        }}
                    >
                        <Plus className="ml-auto h-4 w-4 text-white" />
                    </div>
                </div>

			)}
		</div>
	);
};

// Skeleton loader version
DocumentItem.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
	return (
		<div
			style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
			className="flex gap-x-2 py-[3px]"
		>
			<Skeleton className="h-4 w-4" />
			<Skeleton className="h-4 w-[30%]" />
		</div>
	);
};
