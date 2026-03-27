import { useState } from "react";
import { useWindowStatus } from "../windowHook";

export const useOpenLinkHook = () => {
    const [name, setName] = useState<string | null>(null)
    const [url, setUrl] = useState<string | null>(null)
    const [backPath, setBackPath] = useState<boolean>(false)
    const { currentStatus, openWindow, closeWindow } = useWindowStatus();

    return {
        name,
        setName,
        url,
        setUrl,
        backPath,
        setBackPath,
        currentStatus,
        openWindow,
        closeWindow
    };
};
