"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface UserProps {
    name: string;
    picture: string;
    email: string;
}

interface UserContextType {
    user: UserProps | null;
    setUser: (user: UserProps | null) => void;  //this is a function to modify the first attribute user. It expects an argument of type user and returns nothing (void)
    isAuthenticated: boolean;
    isLoadingUser: boolean;
}

const UserContext = createContext<UserContextType | undefined> (undefined); //this is the object that we wish to pass down

export const UserProvider = ({children} : {children: React.ReactNode}) => {     //{children} means whatever is passed as props, just extract its children prop. The next part tells us that children must be a ReactNode. {children} is the entire HTML code that will 
                                                                                //sit nested between <UserProvider> </UserProvider>                                                                           
    const [user, setUser] = useState<UserProps | null> (null);
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const isAuthenticated = !!user; //this might be useless

    useEffect(() => {
        const fetchUser = async () => {

            const urlParams = new URLSearchParams(window.location.search);
            const isLoggedIn = urlParams.get("logged_in");

            if(isLoggedIn) {    //from our backend we're redirected to ?logged_in=true
                setIsLoadingUser(true); //to let the Spinner animation run

                try {
                    const res = await fetch("http://localhost:8080/user", {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    if(!res.ok) 
                        throw new Error(`Http Error: Status ${res.status}`);

                    const data = await res.json();

                    const userData = {
                        name: data.name,
                        email: data.email,
                        picture: data.picture
                    }

                    setUser(userData);

                    urlParams.delete("logged_in");
                    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;   //removing the parameter
                    window.history.replaceState({}, "", newUrl);
                }

                catch(err) {
                    console.error("Failed to fetch user: ", err);
                } 

                finally {
                    setIsLoadingUser(false);
                }
            }
        }

        fetchUser();

    }, []);

    return (
        <UserContext.Provider value={{user, setUser, isAuthenticated, isLoadingUser}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);

    if(!context) {
        throw new Error("useUser must be used within thet UserProvider hierarchy");
    }

    return context;
}