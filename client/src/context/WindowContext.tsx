import { createContext, useContext, ReactNode } from "react";
import { useAllWindows } from "../hooks/windowHooks/allHooks";

const WindowContext = createContext<ReturnType<typeof useAllWindows> | undefined>(undefined);

export const WindowProvider = ({ children }: { children: ReactNode }) => {
    const windows = useAllWindows();
    return <WindowContext.Provider value={windows}>{children}</WindowContext.Provider>;
};

export const useWindowContext = () => {
    const ctx = useContext(WindowContext);
    if (!ctx) throw new Error("useWindowContext precisa estar dentro do WindowProvider");
    return ctx;
};