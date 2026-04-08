import { ChevronDown, X } from "lucide-react"
import { Folder, Link } from 'lucide-react';
import { useEffect, useState } from "react"
import { useWindowContext } from "../../context/WindowContext";
import { returnFilterEffects } from "../../types/auth";
// import { createFile } from "../../services/file";
import { useUser } from "../../context/AuthContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAppContext } from "../../context/AppContext";
import { createFileService } from "../../services/fileServices";
import { FileData } from "../../types/file";
import { useFileContext } from "../../context/FileContext";

export type CreateFileType = "folder" | "link"

export default function NewFileWindow() {
    const { rootFiles, changeRootFiles, changeAllFiles, allFiles } = useFileContext()
    const { callToast, nextIconPosition } = useAppContext();
    const { user, currentDesktop, userFilters } = useUser();
    const { newFile } = useWindowContext();
    const [fileType, setFileType] = useState<CreateFileType>('folder')
    const [drop, setDrop] = useState<boolean>(false)
    const [name, setName] = useState<string | null>(null)
    const [url, setUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const normalizeUrl = (inputUrl: string | null): string | null => {
        if (!inputUrl) return null;

        let normalized = inputUrl.trim();

        if (!normalized.match(/^[a-zA-Z]+:\/\//)) {
            normalized = 'https://' + normalized;
        }

        try {
            const urlObject = new URL(normalized);
            return urlObject.toString();
        } catch (e) {
            return inputUrl;
        }
    };

    const handleCreateFile = async () => {
        if (!user || !currentDesktop) {
            alert("Erro: Não foi possível identificar o utilizador ou o desktop.");
            return;
        }

        setLoading(true)

        const basePayload = {
            desktopId: currentDesktop.id,
            parentId: 'root',
            name: name,
            fileType: fileType,
            xPos: nextIconPosition?.x,
            yPos: nextIconPosition?.y,
        };

        let finalPayload: any = { ...basePayload };

        if (newFile.file) {
            finalPayload.parentId = newFile.file.id
        }

        switch (fileType) {
            case 'link':
                const finalUrl = normalizeUrl(url);

                if (!finalUrl) {
                    return;
                }

                finalPayload.url = finalUrl;
                break;

            case 'folder':
                break;

            default:
                console.error("Tipo de ficheiro desconhecido:", fileType);
                return;
        }

        try {
            console.log(finalPayload)
            const fileCreated = await createFileService(currentDesktop.id, finalPayload as FileData);
            if (finalPayload.parentId != 'root') {
                changeAllFiles([...allFiles, fileCreated]);
            } else {
                changeRootFiles([...rootFiles, fileCreated]);
            }

            console.log('fileCreated ', fileCreated)
            setName(null)
        } catch (error) {
            console.error("Falha ao criar o ficheiro:", error);
        } finally {
            callToast({ message: 'Arquivo criado com sucesso!', type: 'success' })
            setLoading(false)
            setName(null)
            setUrl(null)
            newFile.closeWindow()
        }
    };

    function imageReturn() {
        switch (fileType) {
            case ('folder'):
                return '/assets/images/open-folder.png'
            case ('link'):
                return '/assets/images/link.png'
            default:
                break
        }
    }

    function textReturn() {
        switch (fileType) {
            case ('folder'):
                return 'Pasta'
            case ('link'):
                return 'Link'
            default:
                break
        }
    }

    const closeWindow = () => {
        setDrop(false);
        newFile.closeWindow();
        setName(null);
        setUrl(null);
    }

    const handleAreaClick = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target != e.currentTarget) return;
        setDrop(false);
        newFile.closeWindow();
        setName(null);
        setUrl(null);
    }


    return (
        <div onClick={handleAreaClick} className={`${newFile.currentStatus === 'open' ? returnFilterEffects() : 'pointer-events-none'} 
        transition-all duration-500 fixed z-200 w-full h-screen flex justify-center items-center p-4 pb-[50px] cursor-pointer`}>
            <div className={`${newFile.currentStatus === 'open' ? 'scale-100' : 'scale-0'} cursor-default bg-(--color-dark) origin-center rounded-md p-4 w-full max-w-[600px] 
            max-h-full flex flex-col gap-4 overflow-y-auto transition-all relative`}>
                <X onClick={closeWindow} size={35}
                    className="absolute top-0 right-0 p-2 rounded-bl-lg cursor-pointer transition-all hover:bg-red-500" />
                <h1 className="text-[20px] flex gap-1.5">Criar um novo item em <p className="text-(--color-lighter) max-w-50 truncate">
                    {newFile.file ? `${newFile.file.name} (${newFile.file.fileType})` : `${currentDesktop?.name} (Desktop)`}</p></h1>
                <div className={`${loading && 'saturate-0 pointer-events-none opacity-60'} flex flex-col gap-3 items-center`}>


                    <div className="w-full flex flex-row gap-2">
                        <div onClick={() => { setFileType('folder'); setDrop(true) }} className={`${fileType === 'folder' ? 'bg-(--color-lighter)/70 border-(--color-lighter)/70' : 'border-(--color-regular) hover:bg-(--color-regular)/50 '} 
                        flex-1 p-4 flex flex-col gap-2 rounded-xl border-2 justify-between items-center transition-all cursor-pointer select-none`}>
                            <Folder size={35} className={`${fileType === 'folder' ? 'text-white' : 'text-(--color-lighter)/60  scale-80 origin-bottom'} transition-all`} />
                            <p className={`${fileType === 'folder' ? 'text-white' : 'text-(--color-lighter)/60  scale-80 origin-top'} text-[20px] transition-all`}>Pasta</p>
                        </div>
                        <div onClick={() => { setFileType('link'); setDrop(true) }} className={`${fileType === 'link' ? 'bg-(--color-lighter)/70 border-(--color-lighter)/70' : 'border-(--color-regular) hover:bg-(--color-regular)/50 '} 
                        flex-1 p-4 flex flex-col gap-2 rounded-xl border-2 justify-between items-center transition-all cursor-pointer select-none`}>
                            <Link size={35} className={`${fileType === 'link' ? 'text-white' : 'text-(--color-lighter)/60  scale-80 origin-bottom'} transition-all`} />
                            <p className={`${fileType === 'link' ? 'text-white' : 'text-(--color-lighter)/60  scale-80 origin-top'} text-[20px] transition-all`}>Link</p>
                        </div>

                    </div>

                    <div className="flex flex-col gap-1 mt-2 w-full">
                        <p className="text-lg">Nome</p>
                        <div className="flex flex-col">
                            <input value={name ?? ''} onChange={(e) => setName(e.target.value)} type="text" className="border-1 border-(--color-light) outline-none transition-all text-[16px] bg-(--color-regular)/50
                             hover:bg-(--color-regular)/70  
                                cursor-pointer focus:cursor-text p-1.5 px-2.5 rounded-sm focus:border-(--color-light) focus:bg-(--color-light)/40 text-(--color-lighter) focus:text-white w-full" />
                        </div>
                    </div>

                    <div style={{
                        transition: 'opacity 0.6s, height 0.2s'
                    }} className={`${fileType === 'link' ? 'h-20' : 'opacity-0 h-0 '} transition-all flex flex-col gap-1 w-full overflow-hidden`}>
                        <p className="text-lg">URL</p>
                        <div className="flex flex-col">
                            <input value={url ?? ''} onChange={(e) => setUrl(e.target.value)} type="text" className="border-1 border-(--color-light) outline-none transition-all text-[16px] bg-(--color-regular)/50
                             hover:bg-(--color-regular)/70  
                                cursor-pointer focus:cursor-text p-1.5 px-2.5 rounded-sm focus:border-(--color-light) focus:bg-(--color-light)/40 text-(--color-lighter) focus:text-white w-full" />
                        </div>
                    </div>
                    <div className="flex flex-row w-[40%] hover:w-[60%] transition-all mt-2">
                        <button onClick={handleCreateFile} className="p-1.5 px-5 text-[20px] font-medium cursor-pointer transition-all 
                         bg-(--color-light) hover:bg-(--color-lighter) hover:text-(--color-dark) rounded-md w-full">
                            {loading ? <DotLottieReact
                                src="https://lottie.host/e580eaa4-d189-480f-a6ce-f8c788dff90d/MP2FjoJFFE.lottie"
                                className="w-15 p-0"
                                loop
                                autoplay
                            /> : 'Criar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}