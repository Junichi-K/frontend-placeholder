"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "./_components/Navigation";
import { useUser } from "@/context/UserContext";
import { Spinner } from "@/components/ui/spinner"; // adjust path as needed
import { CsrfProvider } from "@/context/CsrfContext";
import { DocumentProvider } from "@/context/DocumentContext";
import { SearchCommand } from "@/components/search-command";
import { UpdateNavbarProvider } from "@/context/update-navbar-context";
import { ToolbarProvider } from "@/context/update-toolbar-context";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, setUser, isAuthenticated } = useUser();
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            fetch("http://localhost:8080/user", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Not authenticated");
                    return res.json();
                })
                .then((data) => {
                    setUser({
                        name: data.name,
                        email: data.email,
                        picture: data.picture,
                    });
                })
                .catch(() => {
                    router.push("/");
                })
                .finally(() => setIsLoadingUser(false));
        } else {
            setIsLoadingUser(false);
        }
    }, []);

    if (isLoadingUser) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <Spinner size="icon" />
            </div>
        );
    }

    return (
        <CsrfProvider>
            <DocumentProvider>
                <UpdateNavbarProvider>
                    <ToolbarProvider>
                        <div className="h-full flex text-gray-200">
                            <Navigation />
                            <main className="flex-1 h-full overflow-y-auto">
                                <SearchCommand/>
                                {children}
                            </main>
                        </div>
                    </ToolbarProvider>
                </UpdateNavbarProvider>
            </DocumentProvider>
        </CsrfProvider>
    );
};

export default MainLayout;

