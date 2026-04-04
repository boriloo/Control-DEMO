import { useWindowContext } from "../context/WindowContext";

export default function ContextMenu() {
    const { contextMenu } = useWindowContext();
    const visible = contextMenu.isVisible
    const position = contextMenu.position
    const functions = contextMenu.functions

    return (
        <div
            className={`${visible ? 'opacity-100 z-40' : 'opacity-0'} transition-opacity absolute bg-zinc-900/70 backdrop-blur-md w-full max-w-[230px] rounded-md shadow-lg`}
            style={{ top: position.y, left: position.x }}
        >
            {functions.map((func) => (
                <div
                    key={func.label}
                    onClick={func.action}
                    className="p-4 py-3 text-[15px] text-white rounded-sm hover:bg-zinc-950/80 hover:text-blue-500 hover:font-normal cursor-pointer transition-all"
                >
                    {func.label}
                </div>
            ))}
        </div>
    )
}