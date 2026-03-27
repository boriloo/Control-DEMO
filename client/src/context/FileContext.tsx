import { createContext, useContext, ReactNode, useCallback, useState } from "react";
import { FileData } from "../types/file";

interface FileContextType {
    nextIconPosition: { x: number; y: number } | null;
    changeNextIconPosition: (position: { x: number; y: number }) => void;
    standardFile: (file: any) => FileData;
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

    const standardFile = (file: any) => {
        return {
            id: file.id,
            name: file.name,
            ownerId: file.owner_id ?? file.ownerId,
            parentId: file.parent_id ?? file.parentId,
            desktopId: file.desktop_id ?? file.desktopId,
            fileType: file.file_type ?? file.fileType,
            url: file.url,
            xPos: file.xpos ?? file.xPos,
            yPos: file.ypos ?? file.yPos,
            createdAt: file.created_at ?? file.createdAt,
        } as FileData;
    }

    const changeNextIconPosition = (position: { x: number; y: number }) => {
        setNextIconPosition(position);
    }

    const changeAllFiles = useCallback((files: FileData[]) => {
        const standardize = files.map((file) => {
            return standardFile(file)
        })
        setAllFiles(standardize)
    }, [])

    const changeRootFiles = useCallback((files: FileData[]) => {
        const standardize = files.map((file) => standardFile(file))
        setRootFiles(standardize)
    }, [])

    return <FileContext.Provider value={{
        nextIconPosition,
        changeNextIconPosition,
        standardFile,
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
