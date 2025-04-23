import { Button } from "@/components/ui/button";
import Image from 'next/image'
import { useEffect, useRef } from "react";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div ref={modalRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg">
                <Button variant="secondary" size="lg" className="border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-300"
                        onClick = {() => window.location.href="http://localhost:8080/oauth2/authorization/google"}>
                    <Image
                        src="https://www.svgrepo.com/show/475656/google-color.svg" 
                        height="20"
                        width="20"
                        alt="Google Logo"
                    /> 
                    <span>Login with Google</span>
                </Button>
            </div>
        </div>
    );
};
