import { createContext, useContext, useEffect, useState } from 'react';


interface CsrfContextType {
    csrfToken: string | null;
    fetchCsrfToken: () => Promise<void>;
}

const CsrfContext = createContext<CsrfContextType | undefined> (undefined);

export const useCsrf = () => {
    const context = useContext(CsrfContext);

    if(!context) {
        throw new Error("useCsrf must be used within a CsrfProvider");
    }

    return context; 
}


export const CsrfProvider = ({ children }: { children: React.ReactNode }) => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

    const fetchCsrfToken = async () => {
        try {
            const res = await fetch("http://localhost:8080/csrf-token", {
                method: "GET",
                credentials: "include"
            });

            const data = await res.json();
            setCsrfToken(data.token);
        }

        catch(err) {
            console.error("Failed to fetch CSRF token", err);
        }
    };

    useEffect(() => {
        fetchCsrfToken();
    }, []);

    return (
        <CsrfContext.Provider value = {{csrfToken, fetchCsrfToken}}>
            {children}
        </CsrfContext.Provider>
    )
};
