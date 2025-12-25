"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CommitmentType } from "./actions";

type CommitmentContextType = {
  bufferedAction: CommitmentType | null;
  setBufferedAction: (action: CommitmentType | null) => void;
};

const CommitmentContext = createContext<CommitmentContextType | undefined>(undefined);

export const CommitmentProvider = ({ children }: { children: ReactNode }) => {
  const [bufferedAction, setBufferedAction] = useState<CommitmentType | null>(null);

  return (
    <CommitmentContext.Provider value={{ bufferedAction, setBufferedAction }}>
      {children}
    </CommitmentContext.Provider>
  );
};

export const useCommitmentContext = () => {
  const context = useContext(CommitmentContext);
  if (context === undefined) {
    throw new Error("useCommitmentContext must be used within a CommitmentProvider");
  }
  return context;
};
