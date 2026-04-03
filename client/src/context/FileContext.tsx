import { createContext, useContext, ReactNode, useCallback, useState } from "react";
import { FileData } from "../types/file";

interface FileContextType {
    nextIconPosition: { x: number; y: number } | null;
    changeNextIconPosition: (position: { x: number; y: number }) => void;
    allFiles: FileData[];
    changeAllFiles: (files: FileData[]) => void;
    rootFiles: FileData[];
    changeRootFiles: (files: FileData[]) => void;
};

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
    const [allFiles, setAllFiles] = useState<FileData[]>([])
    const [rootFiles, setRootFiles] = useState<FileData[]>([])
    const [nextIconPosition, setNextIconPosition] = useState<{ x: number; y: number } | null>(null)

    const changeNextIconPosition = (position: { x: number; y: number }) => {
        setNextIconPosition(position);
    }

    const changeAllFiles = useCallback((files: FileData[]) => {
        setAllFiles(files)
    }, [])

    const changeRootFiles = useCallback((files: FileData[]) => {
        setRootFiles(files)
    }, [])

    return <FileContext.Provider value={{
        nextIconPosition,
        changeNextIconPosition,
        allFiles,
        changeAllFiles,
        rootFiles,
        changeRootFiles,
    }}>
        {children}
    </FileContext.Provider>;
};

export const useFileContext = () => {
    const context = useContext(FileContext);
    if (!context)
        throw new Error("useFileContext must be used inside FileProvider");
    return context;
};
