import { ExternalLink, Maximize, Minus, Plus, Trash, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useWindowContext } from "../../context/WindowContext"
import { useUser } from "../../context/AuthContext";
import { returnFilterEffects } from "../../types/auth";
import { FullFileData, listenToFilesByParent } from "../../services/file";
import { FileType } from "../../types/file";
import { useRootContext } from "../../context/RootContext";
import { useAppContext } from "../../context/AppContext";

export default function FileWindow() {
    const { root } = useRootContext()
    const { minimazeAllWindows } = useAppContext();
    const { user } = useUser()
    const { fileViewer, newFile, imgViewer, openLink } = useWindowContext();
    const [isFullsceen, setIsFullscreen] = useState<boolean>(false)
    const [internalFiles, setInternalFiles] = useState<FullFileData[]>([])
    const [imageValidations, setImageValidations] = useState<Record<string, boolean>>({});
    const [animationKey, setAnimationKey] = useState<number>(0);
    const [seeFiles, setSeeFiles] = useState<boolean>(false)



    useEffect(() => {
        if (!fileViewer.file?.desktopId || !fileViewer.file?.id || !user) return;

        const unsubscribe = listenToFilesByParent(
            user.uid as string,
            fileViewer.file?.desktopId,
            fileViewer.file?.id,
            (newFiles: FullFileData[]) => {
                const typeOrder = { folder: 0, link: 1, text: 2 };
                const sortedArray = newFiles.sort((a, b) => {
                    return typeOrder[a.type] - typeOrder[b.type];
                });
                setInternalFiles(sortedArray);
            }
        );

        return unsubscribe;

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
            let convertedUrl = null
            if (url.startsWith('https://drive.google.com')) {
                const regex = /\/d\/([a-zA-Z0-9_-]+)/;
                const match = url.match(regex);

                if (match && match[1]) {
                    const fileId = match[1];
                    convertedUrl = `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
                } else {
                    console.warn("Não foi possível extrair o ID do arquivo do Google Drive.");
                }
            } else if (/\.(jpg|jpeg|webp|png|gif|bmp|svg)$/i.test(url)) {
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
    }

    function getDomainFromUrl(url: string): string {
        try {
            return new URL(url).hostname;
        } catch {
            return "";
        }
    }

    function imageReturn(fileType: FileType, fileUrl: string) {
        switch (fileType) {
            case 'folder':
                return '/assets/images/open-folder.png'
            case 'text':
                return '/assets/images/text-file.png'
            case 'link':
                const domain = getDomainFromUrl(fileUrl);
                if (imageValidations[fileUrl]) {
                    return fileUrl
                } else if (domain) {
                    return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
                } else {
                    return '/assets/images/link.png'
                }
            default:
                return '/assets/images/link.png'
        }
    }

    const returnAction = useCallback((file: FullFileData, fileType: string, fileUrl: string) => {
        if (!root.canOpenWindow) return;
        newFile.setFile(file)
        minimazeAllWindows();
        if (fileType === "link") {
            if (!fileUrl) return;
            if (imageValidations[fileUrl]) {
                imgViewer.setFile(file);
                imgViewer.openWindow();
            } else {
                openLink.setUrl(fileUrl as string);
                openLink.openWindow();
            }
        } else if (fileType === "folder") {
            fileViewer.openWindow();
            fileViewer.setFile(file)
        }
    }, [imageValidations, root])


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
                            <div onClick={handleCreateFile} className="flex flex-col items-center p-2 px-4 gap-1 border-1 w-full max-w-20 cursor-pointer border-zinc-500/40 transition-all rounded-md hover:bg-zinc-800/90 hover:border-white/70">
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
                <div className="flex flex-row gap-1 rounded-md flex-1 bg-black/50 mx-4 mb-4 overflow-hidden min-h-[200px]">
                    <div className="flex flex-col bg-zinc-900 h-full min-w-[200px] p-2"></div>
                    <div className={`${!seeFiles && 'opacity-0'} flex flex-col gap-2 w-full p-2 overflow-y-auto scroll-smooth `}>
                        {internalFiles.length > 0 ?
                            internalFiles.map((file, index) => (
                                <div
                                    key={`${file.id}-${animationKey}`}
                                    onClick={() => returnAction(file, file.type, file.url as string)}
                                    className="group flex flex-row p-3 gap-3 rounded-md bg-zinc-900 transition-all cursor-pointer hover:bg-zinc-800/85 animate-slideIn opacity-0 items-center"
                                    style={{
                                        animationDelay: `${index * 120}ms`,
                                        animationFillMode: 'forwards'
                                    }}
                                >
                                    <img src={imageReturn(file.type, file.url as string)} alt="" className="max-h-8 w-8 object-contain" />
                                    <div className="flex flex-col">
                                        <p className="text-[18px]">{file.name}</p>
                                        <p className="text-[14px] mt-[-5px] opacity-80">{imageValidations[file.url as string] ? 'imagem' : file.type}</p>
                                    </div>
                                    <p className="ml-[-5px] opacity-0 transition-all group-hover:opacity-100 group-hover:ml-2 text-blue-500">Clique para abrir</p>
                                </div>
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