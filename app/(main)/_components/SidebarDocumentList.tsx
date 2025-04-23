"use client";

import { useEffect, useState } from "react";
import { DocumentItem } from "./DocumentItem";
import { FileIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentContext } from "@/context/DocumentContext";
import { useRouter } from "next/navigation";

interface Document {
	id: number;
	title: string;
	parentId: number | null;
	isArchived?: boolean;
	icon?: string;
}

interface SidebarDocumentListProps {
	parentId?: number | null;
	level?: number;
}

export const SidebarDocumentList = ({
	parentId = null,
	level = 0,
}: SidebarDocumentListProps) => {
	const router = useRouter();

	const [documents, setDocuments] = useState<Document[]>([]);
	const [expanded, setExpanded] = useState<Record<number, boolean>>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [shouldRefresh, setShouldRefresh] = useState(false);

	const { isNoteAdded, setIsNoteAdded, isNoteDeleted } = useDocumentContext();

	useEffect(() => {
		const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

		const fetchDocuments = async () => {
			setIsLoading(true);

			await delay(50); //this is currently providing a "more natural" feel (atleast with localhost) maybe in actualy deployment the fetch times are long enough to get this feel "naturally"

			try {
				const res = await fetch(
					`http://localhost:8080/documents?parentId=${parentId ?? ""}&isArchived=false`,
					{
						method: "GET",
						credentials: "include",
					}
				);
				const data = await res.json();
				setDocuments(data);

				if (isNoteAdded) setIsNoteAdded(false);
			} catch (err) {
				console.error("Failed to fetch documents", err);
			} finally {
				setIsLoading(false);
				setShouldRefresh(false);
			}
		};

		fetchDocuments();
	}, [parentId, isNoteAdded, shouldRefresh, isNoteDeleted]);

	const onExpand = (id: number) => {
		setExpanded(prev => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const handleChildDelete = () => {
		setShouldRefresh(true);
	}

	/*const handleChildAddition = () => {
		setShouldRefresh(true);
	}*/

	//the new function, makes use of setState like childDeleted  and sets it to true and also (should we remove the deleted doc from expanded array if it exists there) Not completely sure about this point though

	return (
		<>
			{isLoading ? (
				<div className="mt-2">
					{[...Array(3)].map((_, index) => (
						<DocumentItem.Skeleton key={index} level={level} />
					))}
				</div>
			) : (
				documents.map(doc => {
					const isExpanded = expanded[doc.id] ?? false;

					return (
						<div key={doc.id} className="document-item-container">
							<DocumentItem
								id={doc.id}
								label={doc.title}
								icon={FileIcon}
								documentIcon={doc.icon}
								level={level}
								expanded={isExpanded}
								onExpand={() => onExpand(doc.id)}
								onClick={() => {router.push(`/documents/${doc.id}`)}}
								onDelete={handleChildDelete}
								//onAddition={handleChildAddition}
							/>

							{(isExpanded) && (
								<div className="ml-2">
									<SidebarDocumentList
										key={doc.id}
										parentId={doc.id}
										level={level + 1}
									/>
								</div>
							)}
						</div>
					);
				})
			)}

			{documents.length === 0 && !isLoading && level !== 0 && (
				<p
					className="text-sm mb-2 mt-1"
					style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
				>
					No pages inside
				</p>
			)}
		</>
	);
};

