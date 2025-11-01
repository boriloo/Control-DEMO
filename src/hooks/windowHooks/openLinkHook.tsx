import { useState } from "react";
import { useWindowStatus } from "../windowHook";

export const useOpenLinkHook = () => {
    const [url, setUrl] = useState<string | null>(null)
    const [backPath, setBackPath] = useState<boolean>(false)
    const { currentStatus, openWindow, closeWindow } = useWindowStatus();

    return {
        url,
        setUrl,
        backPath,
        setBackPath,
        currentStatus,
        openWindow,
        closeWindow
    };
};
