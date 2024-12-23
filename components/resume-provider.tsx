// context/ResumeContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ResumeData {
  id: string;
  content: string;
  optimizedContent: string;
  metrics: {
    wordCount: number;
    atsScore: number;
    industryRelevance: number;
  };
  improvements: string[];
}

interface ResumeContextType {
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData | null) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
