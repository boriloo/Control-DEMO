import { createContext, useContext, ReactNode, useCallback, useState, useRef } from "react";
import { useWindowContext } from "./WindowContext";

type ToastType = "success" | "error" | "message"

interface Toast {
    message: string,
    type: ToastType
}

interface AppContextType {
    minimazeAllWindows: () => void;
    closeAllWindows: () => void;
    callToast: ({ message, type }: Toast) => void;
    toastOpen: boolean;
    toast: Toast;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { fileViewer, profile, newFile, config, listdt, newdt, openLink, dtConfig, imgViewer, social } = useWindowContext()
    const [toastOpen, setToastOpen] = useState<boolean>(false)
    const [toast, setToast] = useState<Toast>({ message: 'Hmmm...', type: 'message' })
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const callToast = ({ message, type }: Toast) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setToastOpen(false);

        setTimeout(() => {
            setToast({ message, type });
            setToastOpen(true);

            timeoutRef.current = setTimeout(() => {
                setToastOpen(false);
                timeoutRef.current = null;
            }, 4000);
        }, 10);
    };

    const minimazeAllWindows = useCallback(() => {
        config.minimizeWindow()
        fileViewer.minimizeWindow()
        profile.minimizeWindow()
        newFile.closeWindow()
        listdt.minimizeWindow()
        newdt.closeWindow()
        openLink.closeWindow()
        dtConfig.closeWindow()
        imgViewer.minimizeWindow()
        social.minimizeWindow()
    }, []);

    const closeAllWindows = useCallback(() => {
        config.closeWindow()
        fileViewer.closeWindow()
        profile.closeWindow()
        newFile.closeWindow()
        listdt.closeWindow()
        newdt.closeWindow()
        openLink.closeWindow()
        dtConfig.closeWindow()
        imgViewer.closeWindow()
        social.closeWindow()
    }, []);


    return <AppContext.Provider value={{ minimazeAllWindows, closeAllWindows, callToast, toastOpen, toast }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context)
        throw new Error("useAppContext must be used inside AppProvider");
    return context;
};
