import { ChevronDown, X } from "lucide-react"
import { useState } from "react"
import { useWindowContext } from "../../context/WindowContext";
import { returnFilterEffects } from "../../types/auth";
import { FileType } from "../../types/file";
import { createFile } from "../../services/file";
import { useUser } from "../../context/AuthContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAppContext } from "../../context/AppContext";

export default function NewFileWindow() {
    const { callToast } = useAppContext();
    const { user, currentDesktop } = useUser();
    const { newFile } = useWindowContext();
    const [fileType, setFileType] = useState<FileType>('folder')
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
            parentId: null,
            ownerId: user.uid,
            usersId: [user.uid],
            name: name,
            type: fileType,
            position: { x: 500, y: 500 },
            path: [{ id: null, name: 'Início' }],
        };

        let finalPayload: any = { ...basePayload };

        switch (fileType) {
            case 'text':
                const content = "";
                finalPayload.content = content;
                finalPayload.sizeInBytes = new Blob([content]).size;
                break;

            case 'link':
                const finalUrl = normalizeUrl(url);

                if (!finalUrl) {
                    alert("Por favor, insira uma URL válida.");
                    return;
                }

                finalPayload.url = finalUrl;
                finalPayload.sizeInBytes = 0;
                break;

            case 'folder':
                finalPayload.sizeInBytes = 0;
                break;

            default:
                console.error("Tipo de ficheiro desconhecido:", fileType);
                return;
        }
        try {
            await createFile(finalPayload);
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
            case ('text'):
                return '/assets/images/text-file.png'
            case ('link'):
                return '/assets/images/link.png'
            // case ('other'):
            //     return '/assets/images/other-file.png'
            default:
                break
        }
    }

    function textReturn() {
        switch (fileType) {
            case ('folder'):
                return 'Pasta'
            case ('text'):
                return 'Texto'
            case ('link'):
                return 'Link'
            // case ('other'):
            //     return 'Outro'
            default:
                break
        }
    }

    return (
        <div className={`${newFile.currentStatus === 'open' ? returnFilterEffects(user) : 'pointer-events-none '} 
        transition-all duration-500 fixed z-100 w-full h-screen flex justify-center items-center p-4 pb-[50px] cursor-pointer`}>
            <div className={`${newFile.currentStatus === 'open' ? 'scale-100' : 'scale-0'} cursor-default bg-zinc-900 origin-center rounded-md p-4 w-full max-w-[400px] max-h-full flex flex-col gap-4 overflow-y-auto transition-all relative`}>
                <X onClick={() => { setFileType("folder"); setDrop(false); newFile.closeWindow(); setName(null); setUrl(null); }} size={35} className="absolute top-0 right-0 p-2 rounded-bl-lg cursor-pointer transition-all hover:bg-red-500" />
                <h1 className="text-[20px]">Criar um novo arquivo</h1>
                <div className={`${loading && 'saturate-0 pointer-events-none opacity-60'} flex flex-col gap-3`}>
                    <button onClick={() => setDrop(!drop)} className={`${drop ? 'border-white rounded-t-md' : 'border-blue-500 rounded-md'} flex flex-row gap-2 p-4  border-1  items-center 
                        cursor-pointer transition-all hover:bg-zinc-700`}>
                        <img src={imageReturn()} className="w-7" />
                        <p className="text-lg">{textReturn()}</p>
                        <ChevronDown size={26} className={`${drop ? '' : 'rotate-180 text-blue-500'} transition-all ml-auto`} />
                    </button>
                    <div className={`${drop ? 'max-h-full' : 'max-h-0 py-0'} p-2 transition-all overflow-hidden flex flex-col bg-zinc-950 mt-[-10px] gap-2 rounded-b-xl`}>
                        <div onClick={() => { setFileType('folder'); setDrop(true) }}
                            className={`${fileType === 'folder' ? 'border-blue-500 text-blue-500' : 'border-transparent'} 
                            border-1 p-2 flex flex-row gap-4 transition-all hover:bg-zinc-800 rounded-md cursor-pointer select-none`}>
                            <img src="/assets/images/open-folder.png" className="w-6" />
                            Pasta
                        </div>
                        <div onClick={() => { setFileType('text'); setDrop(true) }} className={`${fileType === 'text' ? 'border-blue-500 text-blue-500' : 'border-transparent'} 
                            border-1 p-2 flex flex-row gap-4 transition-all hover:bg-zinc-800 rounded-md cursor-pointer select-none`}>
                            <img src="/assets/images/text-file.png" className="w-6" />
                            Texto
                        </div>
                        <div onClick={() => { setFileType('link'); setDrop(true) }}
                            className={`${fileType === 'link' ? 'border-blue-500 text-blue-500' : 'border-transparent'} 
                            border-1 p-2 flex flex-row gap-4 transition-all hover:bg-zinc-800 rounded-md cursor-pointer select-none`}>
                            <img src="/assets/images/link.png" className="w-6" />
                            Link
                        </div>
                        {/* <div onClick={() => { setFileType('other'); setDrop(true) }}
                            className={`${fileType === 'other' ? 'border-blue-500 text-blue-500' : 'border-transparent'} 
                            border-1 p-2 flex flex-row gap-4 transition-all hover:bg-zinc-800 rounded-md cursor-pointer select-none`}>
                            <img src="/assets/images/other-file.png" className="w-6" />
                            Outro
                        </div> */}
                    </div>
                    <div className="flex flex-col gap-1">
                        <p>Nome</p>
                        <div className="flex flex-col">
                            <input onChange={(e) => setName(e.target.value)} type="text" className="border-none outline-[1.5px] p-1 px-2 outline-transparent 
                            transition-all cursor-pointer hover:bg-zinc-800 rounded-sm focus:outline-blue-500 focus:cursor-text" />
                            <div className="w-full h-[1px] bg-zinc-400"></div>
                        </div>
                    </div>
                    {fileType === 'link' && (<div className="flex flex-col gap-1">
                        <p>URL</p>
                        <div className="flex flex-col">
                            <input onChange={(e) => setUrl(e.target.value)} type="text" className="border-none outline-[1.5px] p-1 px-2 
                            outline-transparent transition-all cursor-pointer hover:bg-zinc-700 rounded-sm focus:outline-blue-500 focus:cursor-text" />
                            <div className="w-full h-[1px] bg-zinc-400"></div>
                        </div>
                    </div>)}
                    <div className="flex flex-row w-full justify-end">
                        <button onClick={handleCreateFile} className="p-1 px-5 text-lg font-medium border-1 border-whit cursor-pointer transition-all 
                        hover:text-blue-500 hover:border-blue-500 hover:bg-zinc-900 rounded-md">
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