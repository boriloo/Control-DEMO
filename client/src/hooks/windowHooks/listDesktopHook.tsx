import { useWindowStatus } from "../windowHook";

export const useListDesktopHook = () => {
    const { currentStatus, openWindow, minimizeWindow, closeWindow } = useWindowStatus();

    return {
        currentStatus,
        openWindow,
        minimizeWindow,
        closeWindow
    };
};
