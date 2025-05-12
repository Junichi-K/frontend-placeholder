"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUpdateCoverImage } from "@/context/update-cover-image";
import { Spinner } from "./ui/spinner";
import { useToolbar } from "@/context/update-toolbar-context";
import { useCsrf } from "@/context/CsrfContext";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "./ui/skeleton";

interface CoverImageProps {
    url?: string;
    preview?: boolean;
}

export const Cover = ({
    url,
    preview
} : CoverImageProps) => {
    const coverImage = useCoverImage();
    const {updateCoverImage, setUpdateCoverImage} = useUpdateCoverImage();
    const {setUpdateToolbar} = useToolbar();
    const { csrfToken } = useCsrf();
    const params = useParams();
    const edgestore = useEdgeStore();

    const [loading, setIsLoading] = useState(false);

    const removeCoverImage = async () => {
        setIsLoading(true);
    
        try {
            if (!csrfToken) {
                toast.error("CSRF token is missing.");
                return;
            }

            const response = await fetch(`http://localhost:8080/document/${params.documentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },

                body: JSON.stringify({
                    coverImage: null,  // Setting cover image to null to remove it
                }),

                credentials: "include",
                
            });
        
            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg || "Failed to remove the cover image");
            }
        
            // After successful removal, set the cover image to null
            setUpdateCoverImage(true);
            setUpdateToolbar(true);

            /*await edgestore.publicFiles.delete({
                url: url,
            });*/
        
            toast.success("Cover image removed successfully!");
        } catch (error) {
          toast.error("Failed to remove cover image");
          console.error("Error removing cover image:", error);
        } finally {
          setIsLoading(false);
        }
    };
    
    if(loading) {
        return (
            <div className="flex items-center justify-center">
                <Spinner
                    size="lg"
                />
            </div>
        )
    }

    return (
        <div className={cn("relative group w-full aspect-[4/1] mt-11 ", !url && "aspect-[10/1]", url && "")}>
            {!!url && (
                <Image
                    src={url}
                    fill
                    alt="Cover Image"
                    className="object-cover z-[-10] bg-black/80"
                />
            )}
            {url && !preview && (
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2 z-[10]">
                    <Button
                        onClick={coverImage.onOpen}
                        variant="outline"
                        className="bg-transparent"
                    >
                        <ImageIcon className="h-4 w-4 mr-2"/>
                        Change Cover Image
                    </Button>
                    <Button
                        onClick={removeCoverImage}
                        variant="outline"
                        className="bg-transparent"
                    >
                        <X className="h-4 w-4 mr-2"/>
                        Remove Image
                    </Button>
                </div>
            )}
        </div>
    )
}

Cover.Skeleton = function CoverSkeleton() {
    return (
        <Skeleton className="w-full h-[12vh] bg-white/20"/>
    )
}