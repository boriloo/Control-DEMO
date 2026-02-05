import { useWindowStatus } from "../windowHook";

export const useNewDesktopHook = () => {
    const { currentStatus, openWindow, closeWindow } = useWindowStatus();

    return {
        currentStatus,
        openWindow,
        closeWindow
    };
};
