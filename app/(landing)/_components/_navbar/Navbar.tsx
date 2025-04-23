"use client";

import { ScrollOnTop } from "@/hooks/scroll-on-top";
import { cn } from "@/lib/utils";
import { Logo } from "../Logo";
import { Button } from "@/components/ui/button";
import { LoginModal } from "../../../../components/Modals/LoginModal";
import { useState } from "react";
import { AuthNavbar } from "./AuthNavbar";

export const Navbar = () => {
    const scrolled = ScrollOnTop();
    const [isModalOpen, setModalOpen] = useState(false);

    const handleLogin = () => {
        setModalOpen(true);
    }

    return (
        <div className="flex w-full justify-center">
            <div className={cn("z-50 bg-[#000000] fixed top-0 flex items-center w-full p-6 text-white", scrolled && "border-b shadow-lg")}>
                <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
                    <Logo/>
                    {/*<div className="md:ml-auto md:justify-end font-medium w-full flex items-center gap-x-2">   
                        <Button onClick = {handleLogin} variant="secondary">
                            Log in
                        </Button>

                        <LoginModal isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}/>
                    </div>*/}
                    <AuthNavbar/>                    
                </div>

            </div>
        </div>
    );
}