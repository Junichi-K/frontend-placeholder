import { createContext, useState, useContext, ReactNode } from "react";

// Create a context to hold the updateNavbar state
interface UpdateNavbarContextType {
  updateNavbar: boolean;
  setUpdateNavbar: (value: boolean) => void;
}

const UpdateNavbarContext = createContext<UpdateNavbarContextType | undefined>(undefined);

export const useUpdateNavbar = () => {
  const context = useContext(UpdateNavbarContext);
  if (!context) {
    throw new Error("useUpdateNavbar must be used within an UpdateNavbarProvider");
  }
  return context;
};

interface UpdateNavbarProviderProps {
  children: ReactNode;
}

export const UpdateNavbarProvider = ({ children }: UpdateNavbarProviderProps) => {
  const [updateNavbar, setUpdateNavbar] = useState(false);

  return (
    <UpdateNavbarContext.Provider value={{ updateNavbar, setUpdateNavbar }}>
      {children}
    </UpdateNavbarContext.Provider>
  );
};
