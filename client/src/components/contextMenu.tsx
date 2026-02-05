interface ContextFunctions {
    label: string;
    action: () => void;
}

interface ContextMenuProps {
    visible: boolean;
    functions: ContextFunctions[]
    position: { top: number, left: number }
}

export default function ContextMenu({ visible, functions, position }: ContextMenuProps) {
    return (
        <div
            className={`${visible ? 'opacity-100' : 'opacity-0'} transition-all absolute bg-zinc-800 w-full max-w-[250px] rounded-md shadow-lg`}
            style={{ top: position.top, left: position.left }}
        >
            {functions.map((func) => (
                <div
                    key={func.label}
                    className="px-4 py-2 text-sm text-white hover:bg-blue-600 cursor-pointer"
                >
                    {func.label}
                </div>
            ))}
        </div>
    )
}