import { createContext, useContext, useState } from "react";

interface DocumentContextType {
    isNoteAdded: boolean;
    setIsNoteAdded: (value: boolean) => void;
    isNoteDeleted: boolean;
    setIsNoteDeleted: (value: boolean) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider = ({ children }: { children: React.ReactNode }) => {
    const [isNoteAdded, setIsNoteAdded] = useState(false);
    const [isNoteDeleted, setIsNoteDeleted] = useState(false);

    return (
        <DocumentContext.Provider value={{ isNoteAdded, setIsNoteAdded, isNoteDeleted, setIsNoteDeleted }}>
            {children}
        </DocumentContext.Provider>
    );
};

export const useDocumentContext = () => {
    const context = useContext(DocumentContext);

    if(!context) {
        throw new Error("useDocumentContext must be used within a DocumentProvider");
    }

    return context;
}