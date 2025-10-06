import { createContext, useContext, ReactNode, useCallback } from "react";
import { useWindowContext } from "./WindowContext";

interface AppContextType {
    minimazeAllWindows: () => void;
    closeAllWindows: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { file, profile, newFile, config, listdt, newdt, openLink, dtConfig } = useWindowContext()

    const minimazeAllWindows = useCallback(() => {
        config.minimizeWindow()
        file.minimizeWindow()
        profile.minimizeWindow()
        newFile.closeWindow()
        listdt.minimizeWindow()
        newdt.closeWindow()
        openLink.closeWindow()
        dtConfig.closeWindow()
    }, []);

    const closeAllWindows = useCallback(() => {
        config.closeWindow()
        file.closeWindow()
        profile.closeWindow()
        newFile.closeWindow()
        listdt.closeWindow()
        newdt.closeWindow()
        openLink.closeWindow()
        dtConfig.closeWindow()
    }, []);


    return <AppContext.Provider value={{ minimazeAllWindows, closeAllWindows }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context)
        throw new Error("useAppContext must be used inside AppProvider");
    return context;
};
