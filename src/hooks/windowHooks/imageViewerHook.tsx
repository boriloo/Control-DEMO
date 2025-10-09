import { useState } from "react";
import { useWindowStatus } from "../windowHook";
import { FileData } from "../../types/file";

export const useImageViewerHook = () => {
    const { currentStatus, openWindow, minimizeWindow, closeWindow } = useWindowStatus();
    const [file, setFile] = useState<FileData | null>(null)

    return {
        file,
        setFile,
        currentStatus,
        openWindow,
        minimizeWindow,
        closeWindow
    };
};
