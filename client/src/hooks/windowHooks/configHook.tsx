import { useState } from "react";
import { tabs } from "../../components/windows/config";
import { useWindowStatus } from "../windowHook";

export const useConfigHook = () => {
    const { currentStatus, openWindow, minimizeWindow, closeWindow } = useWindowStatus();
    const [currentTab, setCurrentTab] = useState<tabs>('account')

    return {
        currentTab,
        setCurrentTab,
        currentStatus,
        openWindow,
        minimizeWindow,
        closeWindow
    };
};
