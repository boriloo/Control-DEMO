import { ExternalLink, Maximize, Minus, Plus, Trash, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useWindowContext } from "../../context/WindowContext"
import { useUser } from "../../context/AuthContext";
import { returnFilterEffects } from "../../types/auth";
import { FullFileData, getFilesByParent } from "../../services/file";

export default function FileWindow() {
    const { user } = useUser()
    const { fileViewer } = useWindowContext();
    const [isFullsceen, setIsFullscreen] = useState<boolean>(false)
    const [internalFiles, setInternalFiles] = useState<FullFileData[]>([])

    if (!user) return;

    useEffect(() => {
        async function fetchFiles() {
            try {
                if (!fileViewer.file?.desktopId || !fileViewer.file?.id) return;
                const files = await getFilesByParent(user?.uid as string, fileViewer.file?.desktopId, fileViewer.file?.id)
                setInternalFiles(files)
            } catch (err) {
                throw err
            } finally {
                console.log('tudo ok')
            }
        }
        fetchFiles()
    }, [user, fileViewer.file])

    const handleAreaClick = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target != e.currentTarget) return;
        fileViewer.closeWindow();
    }


    return (

        <div onClick={handleAreaClick} className={`${isFullsceen ? 'pb-[40px]' : ' p-2 pb-[50px]'} ${fileViewer.currentStatus === "open" ? returnFilterEffects(user) : 'pointer-events-none'} 
        fixed z-100 flex-1 flex justify-center items-center w-full h-screen transition-all duration-500 cursor-pointer`}>
            <div className={`${isFullsceen ? 'max-w-full max-h-full' : 'rounded-lg max-w-[1200px] max-h-[700px]'} ${fileViewer.currentStatus === "open" ? 'scale-100' : 'scale-0 '} 
                bg-zinc-900 cursor-default origin-bottom relative transition-all duration-300 flex flex-col w-full h-full overflow-y-auto`}>
                <div className="z-50 sticky select-none top-0 w-full bg-black/50 h-8 flex flex-row justify-between items-center backdrop-blur-[2px]">
                    <p className="p-2">Programa</p>
                    <div className="flex flex-row h-full">
                        <Minus onClick={fileViewer.minimizeWindow} className="transition-colors cursor-pointer p-1 px-2 w-9 h-full hover:bg-white/20" />
                        <Maximize onClick={() => setIsFullscreen(!isFullsceen)} className="transition-colors cursor-pointer p-1 px-2 w-9 h-full hover:bg-white/20" />
                        <X onClick={fileViewer.closeWindow} className="transition-colors cursor-pointer p-1 px-2 w-9 h-full hover:bg-red-500" />
                    </div>
                </div>
                <div className="flex flex-col w-full p-4 gap-4 items-center">
                    <div className="flex row items-start gap-2 w-full flex-wrap">
                        <div className="flex-1 flex flex-col gap-2">
                            <p>Endereço</p>
                            <p className=" p-1 px-2 bg-black/30 rounded-md border-1 border-zinc-600">{fileViewer.file?.name}</p>
                        </div>
                        <div className="flex flex-row gap-2 flex-1 max-w-65">
                            <div className="flex flex-col items-center p-2 px-4 gap-1 border-1 w-full max-w-20 cursor-pointer border-zinc-500/40 transition-all rounded-md hover:bg-zinc-800/90 hover:border-white/70">
                                <Plus size={25} />
                                Criar
                            </div>
                            <div className="flex flex-col items-center p-2 px-4 gap-1 border-1 w-full max-w-20 cursor-pointer border-zinc-500/40 transition-all rounded-md hover:bg-blue-600/10 hover:text-blue-500 hover:border-blue-500">
                                <ExternalLink size={25} />
                                Abrir
                            </div>
                            <div className="flex flex-col items-center p-2 px-4 gap-1 border-1 w-full max-w-20 cursor-pointer border-zinc-500/40 transition-all rounded-md hover:bg-red-600/20 hover:text-red-500 hover:border-red-500">
                                <Trash size={25} />
                                Excluir
                            </div>
                        </div>

                    </div>
                </div>
                <div className="flex flex-row gap-1 rounded-md flex-1 bg-black/50 mx-4 mb-4 overflow-hidden">
                    <div className="flex flex-col bg-zinc-900 h-full min-w-[200px] p-2"></div>
                    {internalFiles.length > 0 ?
                        internalFiles.map((file) => (
                            <div>{file.name}</div>
                        ))
                        :
                        <div className="flex flex-1 justify-center items-center">
                            Esta pasta está vazia.
                        </div>
                    }
                </div>
            </div>
        </div >
    )
}