'use client';

import { useCoverImage } from "@/hooks/use-cover-image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useCallback } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { toast } from "sonner";
import { useCsrf } from "@/context/CsrfContext";
import { useParams } from "next/navigation";
import { SingleImageDropzone } from "@/components/upload/single-image";
import { UploaderProvider, UploadFn } from "../upload/uploader-provider";
import { useUpdateCoverImage } from "@/context/update-cover-image";

interface Document {
    id: number;
    title: string;
    content?: string; // if applicable
    isArchived?: boolean;
    coverImage?: string;
}

export const CoverImageModal = () => {
    const coverImage = useCoverImage();
    const {setUpdateCoverImage} = useUpdateCoverImage();
    const { edgestore } = useEdgeStore();
    const { csrfToken } = useCsrf();
    const params = useParams();

    const updateDocument = async (id: string, updates: Partial<Document>) => {
        if (!csrfToken) {
            toast.error("CSRF token is missing.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/document/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                credentials: "include",
                body: JSON.stringify(updates),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Failed to update document:", errorText);
                toast.error("Failed to update document.");
                return;
            }

            setUpdateCoverImage(true);

            toast.success("Cover image uploaded!");
        } catch (err) {
            console.error("Error updating document:", err);
            toast.error("Something went wrong while updating.");
        }
    };

    // Correct usage of useCallback and upload function
    const uploadFn: UploadFn = useCallback(
        async ({ file, onProgressChange, signal }) => {
            try {
                const res = await edgestore.publicFiles.upload({ file, signal, onProgressChange });

                if (!res.url) {
                    throw new Error('Failed to retrieve file URL');
                }

                if (params.documentId && typeof params.documentId === "string") {
                    await updateDocument(params.documentId, {
                        coverImage: res.url,
                    });
                    toast.success("Cover image updated successfully!");
                } else {
                    toast.error("Invalid document ID.");
                }   

                // You can use res.url for the uploaded file URL
                coverImage.onClose();
                //setUpdateCoverImage(true);

                return { url: res.url }; // Return the URL in the expected format
            } catch (error) {
                console.error("Upload failed:", error);
                toast.error("Failed to upload image.");
                return { url: "" }; // Return an empty URL in case of error
            }
        },
        [edgestore] // Make sure this hook is properly memoized and does not change unnecessarily
    );

    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <DialogHeader>
                    {/* Hidden visually, but accessible to screen readers */}
                    <DialogTitle className="sr-only">Cover Image</DialogTitle>
                </DialogHeader>
                <UploaderProvider uploadFn={uploadFn} autoUpload>
                    <SingleImageDropzone
                        height={200}
                        width={200}
                        dropzoneOptions={{
                            maxSize: 1024 * 1024 * 10, // 10 MB
                        }}
                    />
                </UploaderProvider>
            </DialogContent>
        </Dialog>
    );
};
