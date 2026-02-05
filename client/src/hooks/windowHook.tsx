import { useCallback, useState } from "react";
import { Status } from "../types/window";

export function useWindowStatus(initial: Status = "closed") {
    const [currentStatus, setCurrentStatus] = useState<Status>(initial);

    const openWindow = useCallback(() => {
        setCurrentStatus("minimized");
        setTimeout(() => setCurrentStatus("open"), 10);
    }, []);

    const minimizeWindow = useCallback(() => {
        setCurrentStatus("minimized");
    }, []);

    const closeWindow = useCallback(() => {
        setCurrentStatus("minimized");
        setTimeout(() => {
            setCurrentStatus(prev => (prev === "minimized" ? "closed" : prev));
        }, 400);
    }, []);

    return {
        currentStatus,
        openWindow,
        minimizeWindow,
        closeWindow,
    };
}
