"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, Undo2, Trash2, Trash, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCsrf } from "@/context/CsrfContext";
import { useDocumentContext } from "@/context/DocumentContext";
import { ConfirmModal } from "@/components/Modals/confirm-modal";
import { useUpdateNavbar } from "@/context/update-navbar-context";


interface Document {
	id: number;
	title: string;
	icon?: string;
}

export const TrashBox = () => {
	const router = useRouter();
	const params = useParams();
	const [search, setSearch] = useState("");
	const [documents, setDocuments] = useState<Document[]>([]);
	const [isLoading, setIsLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
	const [modalOpenDocId, setModalOpenDocId] = useState<number | null>(null);

    const { setIsNoteAdded } = useDocumentContext();
	const { setUpdateNavbar } = useUpdateNavbar();

	const { csrfToken } = useCsrf();; 

	useEffect(() => {
		const fetchArchivedDocuments = async () => {
			setIsLoading(true);
			try {
    
				const res = await fetch("http://localhost:8080/documents?isArchived=true", {
					method: "GET",
					credentials: "include",
				});
				const data = await res.json();
				setDocuments(data);
			} catch (err) {
				console.error("Failed to fetch archived documents", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchArchivedDocuments();
	}, [refreshTrigger]);

	const onRestore = async (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		documentId: number
	) => {
		event.stopPropagation();
		try {
            if (!csrfToken) {
                toast.error("CSRF token is missing.");
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

			if (!res.ok) throw new Error("Restore failed");

			setDocuments(prev => prev.filter(doc => doc.id !== documentId));

            setIsNoteAdded(true);
			setUpdateNavbar(true);
			toast.success("Note Restored");
		} catch (err) {
			console.error("Restore failed", err);
			toast.error("Failed to restore note");
		}
	};

	const onRemove = async (documentId: number) => {
		try {
            if (!csrfToken) {
                toast.error("CSRF token is missing.");
                return;
            }

			const res = await fetch(`http://localhost:8080/document/${documentId}`, {
				method: "DELETE",
				credentials: "include",
				headers: {
					"X-CSRF-TOKEN": csrfToken,
				},
			});

			if (!res.ok) throw new Error("Delete failed");

			setDocuments(prev => prev.filter(doc => doc.id !== documentId));
			toast.success("Note deleted permanently");

			if (params.documentId === String(documentId)) {
				router.push("/documents");
			}

            setRefreshTrigger(prev => prev + 1)
		} catch (err) {
			console.error("Delete failed", err);
			toast.error("Failed to delete note");
		}
	};

	const filteredDocuments = documents.filter(doc =>
		doc.title.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="text-sm max-h-[400px] overflow-y-auto bg-[#080808] border-2 border-solid border-[#3b2250] scrollbar-transparent">
			<div className="flex items-center gap-x-2 p-2">
				<Search className="h-4 w-4 text-white" />
				<Input
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="h-7 px-2 bg-secondary"
					placeholder="Filter by page title..."
				/>
			</div>

			<div className="mt-2 px-1 pb-1 space-y-1 ">
				{filteredDocuments.length === 0 && !isLoading && (
					<p className="text-sm text-center pb-2 text-white">No documents found</p>
				)}

				{filteredDocuments.map(doc => (
					<div
						key={doc.id}
						onClick={() => {
							if (modalOpenDocId === doc.id) return;
							router.push(`/documents/${doc.id}`);
						}}
						className="group flex items-center justify-between w-full text-sm text-white hover:bg-white hover:text-black rounded-md transition-colors px-3 py-2 cursor-pointer"
					>
						<span className="truncate">{doc.title}</span>
						<div className="flex items-center gap-x-2">
							<div
								onClick={e => {
									e.preventDefault();
									e.stopPropagation();
									onRestore(e, doc.id);
								}}
								role="button"
								tabIndex={0}
								className="rounded-sm p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
							>
								<Undo className="h-4 w-4" />
							</div>

							<ConfirmModal
								onDelete={() => onRemove(doc.id)}
								onOpenChange={(open) => {
									setModalOpenDocId(open ? doc.id : null);
								}}
							>
								<div
									role="button"
									tabIndex={0}
									className="rounded-sm p-1 hover:bg-rose-500/10 hover:text-rose-500 transition"
								>
									<Trash className="h-4 w-4" />
								</div>
							</ConfirmModal>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};


//When I permanently delete a document, we should be defaulted back to the FIRST ROOT DOCUMENT, right now we're at the emtpy screen when we delete the level 0 documents and nothing happens when we delete level non-zero documents