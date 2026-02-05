import { useState } from "react";
import { useWindowStatus } from "../windowHook";
import { FullDesktopData } from "../../services/desktop";

export const useDesktopConfigHook = () => {
    const { currentStatus, openWindow, minimizeWindow, closeWindow } = useWindowStatus();
    const [desktop, setDesktop] = useState<FullDesktopData | null>(null)

    return {
        desktop,
        setDesktop,
        currentStatus,
        openWindow,
        minimizeWindow,
        closeWindow
    };
};
