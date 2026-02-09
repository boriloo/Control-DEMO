import { useState } from "react";
import { useWindowStatus } from "../windowHook";
import { FullFileData } from "../../types/file";


export const useFileHook = () => {
    const { currentStatus, openWindow, minimizeWindow, closeWindow } = useWindowStatus();
    const [file, setFile] = useState<FullFileData | null>(null);

    return {
        currentStatus,
        openWindow,
        minimizeWindow,
        closeWindow,
        file,
        setFile
    };
};
