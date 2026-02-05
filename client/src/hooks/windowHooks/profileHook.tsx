import { useWindowStatus } from "../windowHook";

export const useProfileHook = () => {
    const { currentStatus, openWindow, minimizeWindow, closeWindow } = useWindowStatus();

    return {
        currentStatus,
        openWindow,
        minimizeWindow,
        closeWindow
    };
};
