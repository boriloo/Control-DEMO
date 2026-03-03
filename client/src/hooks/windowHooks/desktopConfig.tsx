import { useState } from "react";
import { useWindowStatus } from "../windowHook";
import { DesktopData } from "../../types/desktop";

export const useDesktopConfigHook = () => {
    const { currentStatus, openWindow, minimizeWindow, closeWindow } = useWindowStatus();
    const [desktop, setDesktop] = useState<DesktopData | null>(null)

    return {
        desktop,
        setDesktop,
        currentStatus,
        openWindow,
        minimizeWindow,
        closeWindow
    };
};
