import { useState } from "react";
import { useWindowStatus } from "../windowHook";
import { FullFileData } from "../../services/file";

export const useNewFileHook = () => {
    const { currentStatus, openWindow, closeWindow } = useWindowStatus();
    const [file, setFile] = useState<FullFileData | null>(null);

    return {
        file,
        setFile,
        currentStatus,
        openWindow,
        closeWindow
    };
};
