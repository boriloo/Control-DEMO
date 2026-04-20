import { useCallback, useEffect, useState } from "react"
import { useWindowContext } from "../../context/WindowContext";
import { returnFilterEffects } from "../../types/auth";
import { deleteFileService } from "../../services/fileServices";
import { useFileContext } from "../../context/FileContext";
// import { createFile } from "../../services/file";


export type CreateFileType = "folder" | "link"

export default function DeleteFileWindow() {
    const { rootFiles, changeRootFiles, allFiles, changeAllFiles } = useFileContext();
    const { deleteFile, fileViewer, imgViewer } = useWindowContext();
    const [name, setName] = useState<string | null>(null)
    const [url, setUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [imageSrc, setImageSrc] = useState<string | null>(null)


    function getDomainFromUrl(url: string): string {
        try {
            const hostname = new URL(url).hostname;

            const parts = hostname.split(".");

            const isCompoundSuffix = parts.length > 2 && parts[parts.length - 2].length <= 3;
            const rootDomain = isCompoundSuffix
                ? parts.slice(-3).join(".")
                : parts.slice(-2).join(".");
            return rootDomain;
        } catch {
            return "";
        }
    }


    useEffect(() => {
        switch (deleteFile.file?.fileType) {
            case ('folder'):
                console.log('é paxta')
                setImageSrc('/assets/images/open-folder.png')
                break
            case ('link'):
                console.log('é paxta')
                const domain = getDomainFromUrl(deleteFile.file?.url as string);
                if (domain) {
                    setImageSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=256`)
                } else {
                    setImageSrc("/assets/images/file.png")
                }
                break;
            default:
                break
        }
    }, [deleteFile.file]);



    const handleDelete = useCallback(async () => {
        console.log('um')
        if (!deleteFile.file?.id) return
        console.log('dois')
        try {
            await deleteFileService(deleteFile.file?.id as string)

            deleteFile.closeWindow();

            const filteredRootFiles = rootFiles.filter((file) => file.id != deleteFile.file?.id)

            changeRootFiles(filteredRootFiles)

            const filteredAllFiles = allFiles.filter((file) => file.id != deleteFile.file?.id)

            changeAllFiles(filteredAllFiles)

            deleteFile.setFile(null)

            imgViewer.closeWindow();

            if (deleteFile.file === fileViewer.file) {
                fileViewer.closeWindow()
            }


        } catch (err) {
            console.log(err)
        }
    }, [deleteFile.file, rootFiles, allFiles])


    const handleAreaClick = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target != e.currentTarget) return;
        deleteFile.closeWindow();
        setName(null);
        setUrl(null);
    }


    return (
        <div onClick={handleAreaClick} className={`${deleteFile.currentStatus == 'open' ? returnFilterEffects() : 'pointer-events-none'} 
        transition-all duration-500 fixed z-200 w-full h-screen flex justify-center items-center p-4 pb-[50px] cursor-pointer`}>
            <div className={`${deleteFile.currentStatus == 'open' ? 'scale-100' : 'scale-50 opacity-0'} cursor-default bg-(--color-dark) origin-center rounded-md p-4 w-full max-w-[600px] 
            max-h-full flex flex-col gap-4 overflow-y-auto transition-all relative`}>
                <div className="p-1.5 bg-(--color-regular) border border-(--color-light)/50 rounded-md absolute top-4 right-4">
                    <img src={imageSrc as string} className="w-10 object-contain pointer-events-none select-none" />
                </div>
                <h1 className="text-[20px] flex gap-1.5">Deseja excluir <p className="text-(--color-lighter) max-w-70 truncate">
                    {`${deleteFile.file?.name} (${deleteFile.file?.fileType})?`}</p></h1>
                <p className="mt-[-10px] text-lg text-white/60">Essa ação não pode ser desfeita</p>
                <div className={`${loading && 'saturate-0 pointer-events-none opacity-60'} flex flex-col gap-3 items-center`}>

                    <div className="flex flex-row gap-2 w-full">
                        <button onClick={deleteFile.closeWindow} className="flex-1 p-1 px-6 text-lg text-(--color-lighter) border-1 border-(--color-lighter) cursor-pointer 
                        transition-all hover:bg-(--color-lighter) hover:text-white rounded-md">
                            Voltar
                        </button>
                        <button onClick={handleDelete} className="flex-1 p-1 px-6 text-lg text-white bg-(--color-regular) cursor-pointer transition-all hover:bg-red-500 rounded-md">
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}