"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoginModal } from "../../../../components/Modals/LoginModal";
import { useUser } from "@/context/UserContext";
import { Spinner } from "@/components/ui/spinner";


export const AuthNavbar = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    //const [showSpinner, setShowSpinner] = useState(false);
    const { isAuthenticated, user, isLoadingUser } = useUser();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const detailsFetched = urlParams.get("details_fetched");

        /*if (detailsFetched === "true") {
            setShowSpinner(true);
        }*/
    }, []);

    /*useEffect(() => {
        if (user) {
            setShowSpinner(false);
        }
    }, [user]);*/

    const handleLogin = () => {
        setModalOpen(true);
    };

    if (isLoadingUser) {
        return <div><Spinner size="lg" /></div>; 
    }

    return (
        <div className="flex items-center gap-x-4">
            {isAuthenticated && user ? (
                <div className="flex items-center gap-x-2">
                    <Image src={user?.picture ?? "/default_user.png"} alt="Profile" width={40} height={40} className="rounded-full border-2 border-white" />
                    {/*I have to add a fucking modal that opens which shows 2 options 1) Signout and 2) Manage account*/}
                </div>
            ) : (
                <>
                    <Button onClick={handleLogin} variant="secondary">
                        Log in
                    </Button>
                    <LoginModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
                </>
            )}
        </div>
    );
};
