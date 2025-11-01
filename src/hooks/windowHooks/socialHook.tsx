import { useWindowStatus } from "../windowHook";

export const useSocialHook = () => {
    const { currentStatus, openWindow, minimizeWindow, closeWindow } = useWindowStatus();

    return {
        currentStatus,
        openWindow,
        minimizeWindow,
        closeWindow
    };
};
