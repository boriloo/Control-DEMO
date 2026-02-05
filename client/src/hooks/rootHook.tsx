import { useCallback, useEffect, useState } from "react";

export const useRootHook = () => {
    const [canOpenWindow, setCanOpen] = useState<boolean>(true)

    useEffect(() => {
        console.log('canOpenWindow', canOpenWindow)
    }, [canOpenWindow])

    const setCanOpenWindow = useCallback((val: boolean) => {
        setCanOpen(val)
    }, []);

    return {
        canOpenWindow,
        setCanOpenWindow
    };
};
