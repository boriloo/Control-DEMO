import { useState } from "react";
import { useWindowStatus } from "../windowHook";
import { FileData } from "../../types/file";

export const useDeleteFileHook = () => {
    const { currentStatus, openWindow, closeWindow } = useWindowStatus();
    const [file, setFile] = useState<FileData | null>(null);

    return {
        file,
        setFile,
        currentStatus,
        openWindow,
        closeWindow
    };
};
