import { useState } from "react";
import { useWindowStatus } from "../windowHook";
import { FullFileData } from "../../services/file";

export const useImageViewerHook = () => {
    const { currentStatus, openWindow, minimizeWindow, closeWindow } = useWindowStatus();
    const [file, setFile] = useState<FullFileData | null>(null)

    return {
        file,
        setFile,
        currentStatus,
        openWindow,
        minimizeWindow,
        closeWindow
    };
};
