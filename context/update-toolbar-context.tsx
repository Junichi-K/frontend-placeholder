import { createContext, useContext, useState, ReactNode } from "react";

interface ToolbarContextType {
  updateToolbar: boolean;
  setUpdateToolbar: (value: boolean) => void;
}

const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

export const useToolbar = () => {
  const context = useContext(ToolbarContext);
  if (!context) {
    throw new Error("useToolbar must be used within a ToolbarProvider");
  }
  return context;
};

interface ToolbarProviderProps {
  children: ReactNode;
}

export const ToolbarProvider = ({ children }: ToolbarProviderProps) => {
  const [updateToolbar, setUpdateToolbar] = useState(false);

  return (
    <ToolbarContext.Provider value={{ updateToolbar, setUpdateToolbar }}>
      {children}
    </ToolbarContext.Provider>
  );
};
