import { useState } from "react";

interface ContextFunctions {
    label: string;
    action: () => void;
}

export const useContextMenuHook = () => {
    const [isVisible, setIsVisible] = useState<boolean>(true)
    const [functions, setFunctions] = useState<ContextFunctions[]>([])
    const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [selectedIconId, setSelectedIconId] = useState<string>('')

    return {
        isVisible,
        setIsVisible,
        functions,
        setFunctions,
        position,
        setPosition,
        selectedIconId,
        setSelectedIconId
    };
};
