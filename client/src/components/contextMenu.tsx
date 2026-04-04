import { Trash } from "lucide-react";
import { useWindowContext } from "../context/WindowContext";

export default function ContextMenu() {
    const { contextMenu } = useWindowContext();
    const visible = contextMenu.isVisible
    const position = contextMenu.position
    const functions = contextMenu.functions

    return (
        <div
            className={`${visible ? 'opacity-100 z-40 scale-100' : 'opacity-0'} origin-top-left absolute bg-zinc-900/70 backdrop-blur-md w-full max-w-[230px] rounded-md shadow-lg rounded-tl-none overflow-hidden`}
            style={{ top: position.y, left: position.x, transform: visible ? 'scale(1)' : 'scale(0.8)', transition: "transform 0.08s, opacity 0.2s" }}
        >
            {functions.map((func) => (
                <div
                    key={func.label}
                    onClick={func.action}
                    className="p-3 py-3 text-[15px] gap-2 text-white hover:bg-zinc-950/80 hover:text-blue-500 cursor-pointer transition-all flex flex-row justify-between"
                >
                    {func.label}
                </div>
            ))}
        </div>
    )
}