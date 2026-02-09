import { ExternalLink, FolderRoot, Maximize, Minus, Plus, Trash, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useWindowContext } from "../../context/WindowContext"
import { useUser } from "../../context/AuthContext";
import { returnFilterEffects } from "../../types/auth";
// import { FullFileData, getFileById, listenToFilesByParent } from "../../services/file";
import ColumnFile from "./fileViewer/columnFile";
import { useAppContext } from "../../context/AppContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FullFileData } from "../../types/file";

export default function FileWindow() {
    const { minimazeAllWindows } = useAppContext();
    const { user, currentDesktop } = useUser()
    const { fileViewer, newFile } = useWindowContext();
    const [isFullsceen, setIsFullscreen] = useState<boolean>(false)
    const [internalFiles, setInternalFiles] = useState<FullFileData[]>([])
    const [imageValidations, setImageValidations] = useState<Record<string, boolean>>({});
    const [animationKey, setAnimationKey] = useState<number>(0);
    const [seeFiles, setSeeFiles] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)


    useEffect(() => {
        if (!fileViewer.file?.desktopId || !fileViewer.file?.id || !user) return;
        // const unsubscribe = listenToFilesByParent(
        //     user.uid as string,
        //     fileViewer.file?.desktopId,
        //     fileViewer.file?.id,
        //     (newFiles: FullFileData[]) => {
        //         const typeOrder = { folder: 0, link: 1, text: 2 };
        //         const sortedArray = newFiles.sort((a, b) => {
        //             return typeOrder[a.type] - typeOrder[b.type];
        //         });
        //         setInternalFiles(sortedArray);
        //     }
        // );
        // return unsubscribe;

    }, [fileViewer.file, user?.uid]);

    useEffect(() => {
        if (fileViewer.currentStatus === 'open') {
            setSeeFiles(false)
            setTimeout(() => {
                setAnimationKey(prev => prev + 1);
                setSeeFiles(true)
            }, 100)
        }
    }, [fileViewer.currentStatus]);

    function validateImage(url: string): Promise<boolean> {
        return new Promise((resolve) => {
            let convertedUrl = 'null'
            if (url.startsWith('https://drive.google.com')) {
                const regex = /\/d\/([a-zA-Z0-9_-]+)/;
                const match = url.match(regex);

                if (match && match[1]) {
                    const fileId = match[1];
                    convertedUrl = `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
                } else {
                    console.warn("Não foi possível extrair o ID do arquivo do Google Drive.");
                }
            } else if (/\.(jpg|jpeg|png|webp|gif|bmp|svg)/i.test(url)) {
                convertedUrl = url
            }

            const img = new Image();
            if (convertedUrl) {
                img.src = convertedUrl;
            } else {
                img.src = url
            }

            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
        });
    }

    useEffect(() => {
        internalFiles.forEach(file => {
            if (file.type === 'link' && file.url && !imageValidations[file.url]) {
                validateImage(file.url).then(isValid => {
                    setImageValidations(prev => ({
                        ...prev,
                        [file.url as string]: isValid
                    }));
                });
            }
        });
    }, [internalFiles]);


    const handleAreaClick = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target != e.currentTarget) return;
        fileViewer.closeWindow();
    }

    const handleCreateFile = () => {
        newFile.openWindow()
        newFile.setFile(fileViewer.file)
    }

    const handlePathClick = async (pathId: string | null) => {
        if (!pathId) {
            minimazeAllWindows()
            return;
        }
        try {
            setLoading(true)
            // const file = await getFileById(pathId)
            // fileViewer.setFile(file)
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }

    }


    return (

        <div onClick={handleAreaClick} className={`${isFullsceen ? 'pb-[40px]' : ' p-2 pb-[50px]'} ${fileViewer.currentStatus === "open" ? returnFilterEffects(user) : 'pointer-events-none'} 
        fixed z-100 flex-1 flex justify-center items-center w-full h-screen transition-all duration-500 cursor-pointer`}>
            <div className={`${isFullsceen ? 'max-w-full max-h-full' : 'rounded-lg max-w-[1200px] max-h-[700px]'} ${fileViewer.currentStatus === "open" ? 'scale-100' : 'scale-0 '} 
                bg-zinc-900 cursor-default origin-bottom relative transition-all duration-300 flex flex-col w-full h-full overflow-y-auto select-none`}>
                <div className="z-50 sticky select-none top-0 w-full bg-black/50 h-8 flex flex-row justify-between items-center backdrop-blur-[2px]">
                    <p className="p-2">Pasta</p>
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
                            <div className=" p-1 px-2 flex flex-row bg-black/30 rounded-md border-1 border-zinc-600 items-center">
                                <FolderRoot size={16} className="opacity-60 mr-1" />
                                {fileViewer.file?.path && fileViewer.file?.path.map((pathSegment) => (
                                    <div className="flex flex-row items-center">
                                        <p key={pathSegment.name} onClick={() => handlePathClick(pathSegment.id)} className="p-0.5 px-1 rounded-sm transition-all cursor-pointer hover:bg-zinc-800 hover:px-3  max-w-40 truncate">
                                            {pathSegment.id ? pathSegment.name : currentDesktop?.name}
                                        </p>
                                        <p className="opacity-40 ml-1 mr-1">|</p>
                                    </div>
                                ))}
                                <p className="p-0.5 px-2 rounded-sm bg-blue-500/10 text-blue-500 max-w-40 truncate">{fileViewer.file?.name}</p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 flex-1 max-w-65">
                            <div onClick={handleCreateFile} className="flex flex-col items-center p-2 px-4 gap-1 bg-zinc-800 w-full max-w-20 
                            cursor-pointer border-zinc-500/40 transition-all rounded-md hover:bg-zinc-700/80 hover:border-white/70
                            inset-shadow-sm inset-shadow-zinc-600 shadow-md hover:inset-shadow-zinc-500">
                                <Plus size={25} />
                                Criar
                            </div>
                            <div className="flex flex-col items-center p-2 px-4 gap-1 bg-zinc-800 w-full max-w-20 cursor-pointer 
                            border-zinc-500/40 transition-all rounded-md hover:bg-blue-600/10 hover:text-blue-500 hover:border-blue-500
                            inset-shadow-sm inset-shadow-zinc-600 shadow-md hover:inset-shadow-blue-900">
                                <ExternalLink size={25} />
                                Abrir
                            </div>
                            <div className="flex flex-col items-center p-2 px-4 gap-1 bg-zinc-800 w-full max-w-20 cursor-pointer 
                            border-zinc-500/40 transition-all rounded-md hover:bg-red-600/20 hover:text-red-500 hover:border-red-500
                            inset-shadow-sm inset-shadow-zinc-600 shadow-md hover:inset-shadow-red-900">
                                <Trash size={25} />
                                Excluir
                            </div>
                        </div>

                    </div>
                </div>
                <div className="flex flex-row gap-1 rounded-md flex-1 bg-black/50 mx-4 mb-4 overflow-hidden min-h-[200px]">
                    <div className="flex flex-col bg-zinc-900 h-full min-w-[200px] p-2"></div>

                    <div className={`${!seeFiles && 'opacity-0'} flex flex-col relative gap-2 w-full p-2 overflow-y-auto scroll-smooth `}>
                        <div className={`${loading ? '' : 'opacity-0 pointer-events-none'} transition-all duration-500 flex flex-col gap-1 absolute z-10 justify-center 
                        items-center bg-zinc-950/80 inset-0`}>
                            <DotLottieReact
                                src="https://lottie.host/e580eaa4-d189-480f-a6ce-f8c788dff90d/MP2FjoJFFE.lottie"
                                className="w-40 p-0"
                                loop
                                autoplay
                            />
                            <p>Carregando arquivos</p>
                        </div>
                        {internalFiles.length > 0 ?
                            internalFiles.map((file, index) => (
                                <ColumnFile file={file} animationKey={animationKey} index={index} imageValidations={imageValidations} />
                            ))
                            :
                            <div className="flex flex-1 justify-center items-center">
                                Esta pasta está vazia.
                            </div>
                        }
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slideIn {
                    animation: slideIn 0.3s ease;
                }
            `}</style>
        </div >
    )
}