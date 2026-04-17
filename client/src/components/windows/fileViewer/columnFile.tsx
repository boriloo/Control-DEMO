import { useCallback, useEffect, useState } from "react"
import { useRootContext } from "../../../context/RootContext"
import { useWindowContext } from "../../../context/WindowContext"
import { useAppContext } from "../../../context/AppContext"
import { Menu, Trash } from "lucide-react"
import { FileData } from "../../../types/file"
import { useUser } from "../../../context/AuthContext"

export interface ColumnFileProps {
    file: FileData
    animationKey: number
    index: number
    imageValidations: Record<string, boolean>
}

export default function ColumnFile({ file, animationKey, index, imageValidations }: ColumnFileProps) {
    const { root } = useRootContext();
    const { minimazeAllWindows } = useAppContext();
    const { newFile, imgViewer, openLink, fileViewer, deleteFile } = useWindowContext();
    const [driveThumb, setDriveThumb] = useState<string | null>(null)


    function getDomainFromUrl(url: string): string {
        try {
            return new URL(url).hostname;
        } catch {
            return "";
        }
    }

    useEffect(() => {
        if (file.url?.startsWith('https://drive.google.com')) {
            const regex = /\/d\/([a-zA-Z0-9_-]+)/;
            const match = file.url.match(regex);

            if (match && match[1]) {
                const fileId = match[1];
                const convertedUrl = `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
                setDriveThumb(convertedUrl)
            } else {
                console.warn("Não foi possível extrair o ID do arquivo do Google Drive.");
            }
        }
    }, [file])

    function imageReturn() {
        if (driveThumb) return driveThumb

        switch (file.fileType) {

            case 'folder':
                return '/assets/images/open-folder.png'
            case 'link':
                const domain = getDomainFromUrl(file.url ?? '');
                if (imageValidations[file.url ?? '']) {
                    return file.url
                } else if (domain) {
                    return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
                } else {
                    return '/assets/images/link.png'
                }
            default:
                return '/assets/images/link.png'
        }
    }

    const handleDeleteFile = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        deleteFile.setFile(file)
        deleteFile.openWindow()
    }, [file])

    const returnAction = useCallback(() => {
        if (!root.canOpenWindow) return;
        newFile.setFile(file)
        if (file.fileType === "link") {
            if (!file.url) return;
            if (imageValidations[file.url]) {
                minimazeAllWindows();
                imgViewer.setFile(file);
                imgViewer.openWindow();
            } else {
                openLink.setName(file.name as string);
                openLink.setUrl(file.url as string);
                openLink.setBackPath(true);
                openLink.openWindow();
            }
        } else if (file.fileType === "folder") {
            fileViewer.setFile(file)
        }
    }, [imageValidations, root, file])


    return (
        <div
            key={`${file.id}-${animationKey}`}
            onClick={() => returnAction()}
            className={`group flex flex-row p-3 gap-3 rounded-md bg-linear-to-b from-(--color-regular)/10 to-(--color-regular)/55 transition-all cursor-pointer bg-(--color-dark) 
                hover:bg-(--color-regular)/80 hover:to-(--color-light)/15 animate-slideIn opacity-0 items-center
            shadow-md min-w-40`}
            style={{
                animationDelay: `${index * 120}ms`,
                animationFillMode: 'forwards'
            }}
        >
            <img src={imageReturn()} alt="" className="max-h-8 w-8 object-contain transition-all group-hover:ml-0.5" />
            <div className="flex flex-col">
                <p className="text-[18px] w-full max-w-85 truncate transition-all group-hover:ml-1">{file.name}</p>
                <p className="text-[14px] mt-[-5px] opacity-80 transition-all group-hover:ml-1">{imageValidations[file.url as string] ? 'imagem' : file.fileType}</p>
            </div>
            <p className="ml-[-5px] p-1 px-2 opacity-0 transition-all rounded-md group-hover:opacity-100 group-hover:ml-2 text-(--color-lighter) bg-(--color-light)/15">Clique para abrir</p>
            <div className="ml-auto flex flex-row gap-3">
                <Menu className="cursor-pointer transition-all opacity-0 scale-75 group-hover:scale-100 group-hover:opacity-100 hover:bg-(--color-lighter)/15 
                                        hover:border-(--color-lighter) hover:text-(--color-lighter) w-9 h-9 p-1.5 bg-white/5 border border-white/40 rounded-md" />
                <Trash onClick={handleDeleteFile} className="cursor-pointer transition-all opacity-0 scale-75 group-hover:scale-100 group-hover:opacity-100 hover:bg-red-700/15 
                                        hover:border-red-500 hover:text-red-500 w-9 h-9 p-1.5 bg-white/5 border border-white/40 rounded-md" />
            </div>
        </div>
    )
}