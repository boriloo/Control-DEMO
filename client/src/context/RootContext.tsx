import { createContext, useContext, ReactNode } from "react";
import { useRootHook } from "../hooks/rootHook";

type RootContextType = {
    root: ReturnType<typeof useRootHook>;
};

const RootContext = createContext<RootContextType | undefined>(undefined);

export const RootProvider = ({ children }: { children: ReactNode }) => {
    const root = useRootHook();

    const hooks = {
        root,
    };

    return <RootContext.Provider value={hooks}>{children}</RootContext.Provider>;
};

export const useRootContext = () => {
    const context = useContext(RootContext);
    if (!context)
        throw new Error("useRootContext must be used inside RootProvider");
    return context;
};
