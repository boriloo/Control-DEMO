import { Download, FolderUp, Info, Maximize, Maximize2, Minimize2, Minus, Trash, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useUser } from "../../context/AuthContext";
import { useWindowContext } from "../../context/WindowContext";
import { returnFilterEffects } from "../../types/auth";
import { deleteFile } from "../../services/file";
import { useAppContext } from "../../context/AppContext";

export default function ImageViewerWindow() {
    const { callToast } = useAppContext();
    const { user } = useUser();
    const { imgViewer } = useWindowContext();
    const [isFullsceen, setIsFullscreen] = useState<boolean>(false)
    const [imgFull, setImgFull] = useState<boolean>(false)
    const [downLoading, setDownLoading] = useState<boolean>(false)
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
    const [driveImage, setDriveImage] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (imgViewer.currentStatus != "open") {
            setImgFull(false)
        }
    }, [imgViewer.currentStatus])

    useEffect(() => {
        if (imgViewer.file?.url?.startsWith('https://drive.google.com')) {
            setLoading(true)
            const regex = /\/d\/([a-zA-Z0-9_-]+)/;
            const match = imgViewer.file?.url?.match(regex);

            if (match && match[1]) {
                const fileId = match[1];
                setDriveImage(`https://lh3.googleusercontent.com/d/${fileId}=s0`)
                setLoading(false)
            } else {
                console.warn("Não foi possível extrair o ID do arquivo do Google Drive.");
                setLoading(false)
            }
        } else {
            setDriveImage(null)
        }
    }, [imgViewer.file])

    const handleAreaClick = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target != e.currentTarget) return;
        imgViewer.closeWindow();
    }

    // const convertDriveUrl = (url: string) => {
    //     const match = url.match(/\/d\/([^/]+)/);
    //     if (match) {
    //         return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    //     }
    //     return url;
    // };

    const downloadImageSimples = async () => {
        if (!imgViewer.file?.url || !imgViewer.file?.name) return;
        if (driveImage) {
            // try {

            //     const auth = new GoogleAuth({
            //         scopes: 'https://www.googleapis.com/auth/drive',
            //     });
            //     const service = google.drive({ version: 'v3', auth });

            //     const fileId = "1DkRvGJ_xdfDGUh6TUkG4CFWU2cmW0hMn"

            //     const file = await service.files.get({
            //         fileId,
            //         alt: 'media',
            //     });
            //     return file.status;
            // } catch (error) {
            //     console.error('Erro ao tentar baixar link direto:', error);
            //     alert('Não foi possível baixar. Tente abrir o link em nova aba.');
            // } finally {
            //     setDownLoading(false);
            // }
        } else {
            try {
                setDownLoading(true)
                const response = await fetch(imgViewer.file?.url);
                if (!response.ok) {
                    throw new Error(`A resposta da rede não foi ok: ${response.statusText}`);
                }

                const blob = await response.blob();

                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = imgViewer.file?.name;
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

            } catch (error) {
                console.error('Erro ao baixar a imagem:', error);
                alert('Não foi possível baixar a imagem. Verifique o console para mais detalhes.');
            } finally {
                setDownLoading(false)
            }
        }

    }

    const handleDeleteFile = () => {
        try {
            deleteFile({ fileId: imgViewer.file?.id, filePath: imgViewer.file?.filePath });
            setConfirmDelete(false);
            imgViewer.setFile(null);
            imgViewer.closeWindow();
            callToast({ message: 'Arquivo deletado com sucesso!', type: 'success' })
        } catch (err) {
            callToast({ message: 'Erro ao excluir arquivo', type: 'error' })
            throw err
        }

    }


    return (
        <div onClick={handleAreaClick} className={`${isFullsceen ? 'pb-[40px]' : ' p-2 pb-[50px]'} ${imgViewer.currentStatus === "open" ? returnFilterEffects(user) : 'pointer-events-none'} 
        fixed z-100 flex-1 flex justify-center items-center w-full h-screen transition-all duration-500 cursor-pointer`}>

            <div className={`${imgFull ? '' : 'scale-90 opacity-0 pointer-events-none'} transition-all w-full min-h-screen fixed inset-0 bg-zinc-950 z-100 pb-10 flex justify-center items-center`}>
                <img src={driveImage ? driveImage : imgViewer.file?.url} className="max-h-full w-full max-w-full object-contain" />
                <Minimize2 onClick={() => setImgFull(false)} size={40} className="absolute bottom-10 right-0 p-1 transition-all cursor-pointer hover:bg-zinc-800" />
            </div>

            <div className={`${confirmDelete ? '' : 'pointer-events-none opacity-0'} transition-all cursor-default fixed top-0 bg-black/70 w-full h-full z-100 flex 
            justify-center items-center p-2 pb-11`}>
                <div className="bg-zinc-950 p-3 w-full max-w-[510px] h-full max-h-[180px] rounded-lg border-1 border-zinc-800 overflow-y-auto flex flex-col gap-1">
                    <p className="text-lg">Tem certeza que deseja excluir esse arquivo?</p>
                    <p className="text-xl text-red-500">{imgViewer.file?.name}.{imgViewer.file?.extension}</p>
                    <div className="flex flex-row gap-2 mt-4">
                        <button onClick={() => { setConfirmDelete(false); }} className="flex-1 p-1 px-5 text-lg text-zinc-300 border-1
                         border-zinc-300 cursor-pointer transition-all hover:bg-zinc-300/10 hover:text-white rounded-md">
                            Voltar
                        </button>
                        <button disabled={!confirmDelete} onClick={handleDeleteFile}
                            className={`flex-1 p-1 px-5 text-lg text-red-500 border-1 border-red-500 cursor-pointer transition-all 
                        hover:bg-red-500 hover:text-white rounded-md`}>
                            Excluir Arquivo
                        </button>
                    </div>
                    <p className="self-center text-md text-white/60">*Esta ação é irreversível.</p>
                </div>
            </div>

            <div className={`${isFullsceen ? 'max-w-full max-h-full' : 'rounded-lg max-w-[1200px] max-h-[700px]'} ${imgViewer.currentStatus === "open" ? 'scale-100' : 'scale-0 '} 
                bg-zinc-900 cursor-default origin-bottom relative transition-all duration-300 flex flex-col w-full h-full overflow-y-auto`}>
                <div className="z-50 sticky select-none top-0 w-full bg-black/50 h-8 flex flex-row justify-between items-center backdrop-blur-[2px]">
                    <p className="p-2">Visualizar Imagem</p>
                    <div className="flex flex-row h-full">
                        <Minus onClick={imgViewer.minimizeWindow} className="transition-colors cursor-pointer p-1 px-2 w-9 h-full hover:bg-white/20" />
                        <Maximize onClick={() => setIsFullscreen(!isFullsceen)} className="transition-colors cursor-pointer p-1 px-2 w-9 h-full hover:bg-white/20" />
                        <X onClick={imgViewer.closeWindow} className="transition-colors cursor-pointer p-1 px-2 w-9 h-full hover:bg-red-500" />
                    </div>
                </div>
                <div className="flex flex-row justify-between p-2 items-center px-3 bg-zinc-900/50">
                    <p className="flex-1"></p>
                    <p className="flex-1 text-center">{imgViewer.file?.name}</p>
                    <div className="flex flex-row flex-1 justify-end">
                        <Download onClick={downloadImageSimples} size={30} className={`${downLoading && 'pointer-events-none opacity-60'} p-1 transition-all cursor-pointer hover:bg-zinc-700 rounded-sm`} />
                    </div>
                </div>
                {!loading && (
                    <div className={`${downLoading && 'saturate-0 scale-80'} relative transition-all flex-1 overflow-hidden flex justify-center items-center w-full`}>
                        <h1 className={`${!downLoading && 'opacity-0'} pointer-events-none absolute text-[23px] p-2 bg-zinc-900 rounded-md px-5`}>Fazendo Download...</h1>
                        <img src={driveImage ? driveImage : imgViewer.file?.url} className="h-full max-h-full max-w-full object-contain" />
                    </div>
                )}

                <div className="mt-auto flex flex-row justify-between p-2 items-center bg-zinc-900/50">
                    <div className="flex flex-row gap-4 items-center p-2 px-3">
                        <Info size={30} className={"p-1 transition-all cursor-pointer hover:bg-zinc-700 rounded-sm"} />
                        <div className="h-5 w-[1px] bg-zinc-700"></div>

                    </div>

                    <div className="flex flex-row gap-3 items-center p-1 px-3">
                        <Trash onClick={() => setConfirmDelete(true)} size={40} className="p-2 transition-all cursor-pointer hover:bg-zinc-700 rounded-sm" />
                        <div className="h-5 w-[1px] bg-zinc-700"></div>
                        <div>
                            <FolderUp size={40} className="peer p-2 transition-all cursor-pointer hover:bg-zinc-700 rounded-sm" />
                            <p className="absolute mt-[-78px] ml-[-30px] transition-all bg-zinc-950/50 p-1 px-2 rounded-sm backdrop-blur-sm opacity-0 peer-hover:opacity-100">Mover para</p>
                        </div>
                        <div className="h-5 w-[1px] bg-zinc-700"></div>
                        <Maximize2 onClick={() => setImgFull(true)} size={40} className="p-2 transition-all cursor-pointer hover:bg-zinc-700 rounded-sm" />
                    </div>
                </div>
            </div>
        </div >
    )
}