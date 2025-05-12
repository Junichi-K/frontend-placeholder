import { createContext, useState, useContext, ReactNode } from "react";

// Create a context to hold the cover image update state
interface CoverImageUpdateContextType {
  updateCoverImage: boolean;
  setUpdateCoverImage: (value: boolean) => void;
}

const CoverImageUpdateContext = createContext<CoverImageUpdateContextType | undefined>(undefined);

// Custom hook to access the cover image update context
export const useUpdateCoverImage = () => {
  const context = useContext(CoverImageUpdateContext);
  if (!context) {
    throw new Error("useCoverImageUpdate must be used within a CoverImageUpdateProvider");
  }
  return context;
};

interface CoverImageUpdateProviderProps {
  children: ReactNode;
}

export const CoverImageUpdateProvider = ({ children }: CoverImageUpdateProviderProps) => {
  const [updateCoverImage, setUpdateCoverImage] = useState(false);

  return (
    <CoverImageUpdateContext.Provider value={{ updateCoverImage, setUpdateCoverImage }}>
      {children}
    </CoverImageUpdateContext.Provider>
  );
};
