import { useCallback, useEffect, useState } from "react"
import { FullFileData } from "../../../services/file"
import { useRootContext } from "../../../context/RootContext"
import { useWindowContext } from "../../../context/WindowContext"
import { useAppContext } from "../../../context/AppContext"
import { Menu, Trash } from "lucide-react"

export interface ColumnFileProps {
    file: FullFileData
    animationKey: number
    index: number
    imageValidations: Record<string, boolean>
}

export default function ColumnFile({ file, animationKey, index, imageValidations }: ColumnFileProps) {
    const { root } = useRootContext();
    const { minimazeAllWindows } = useAppContext();
    const { newFile, imgViewer, openLink, fileViewer } = useWindowContext();
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
        switch (file.type) {
            case 'folder':
                return '/assets/images/open-folder.png'
            case 'text':
                return '/assets/images/text-file.png'
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

    const returnAction = useCallback(() => {
        if (!root.canOpenWindow) return;
        newFile.setFile(file)
        if (file.type === "link") {
            if (!file.url) return;
            minimazeAllWindows();
            if (imageValidations[file.url]) {
                imgViewer.setFile(file);
                imgViewer.openWindow();
            } else {
                openLink.setUrl(file.url as string);
                openLink.openWindow();
            }
        } else if (file.type === "folder") {
            fileViewer.setFile(file)
        }
    }, [imageValidations, root, file])


    return (
        <div
            key={`${file.id}-${animationKey}`}
            onClick={() => returnAction()}
            className="group flex flex-row p-3 gap-3 rounded-md bg-zinc-900 transition-all cursor-pointer hover:bg-zinc-800/85 animate-slideIn opacity-0 items-center"
            style={{
                animationDelay: `${index * 120}ms`,
                animationFillMode: 'forwards'
            }}
        >
            <img src={imageReturn()} alt="" className="max-h-8 w-8 object-contain" />
            <div className="flex flex-col">
                <p className="text-[18px] w-full max-w-70 truncate">{file.name}</p>
                <p className="text-[14px] mt-[-5px] opacity-80">{imageValidations[file.url as string] ? 'imagem' : file.type}</p>
            </div>
            <p className="ml-[-5px] p-1 px-2 opacity-0 transition-all rounded-md group-hover:opacity-100 group-hover:ml-2 text-blue-500 bg-blue-500/10">Clique para abrir</p>
            <div className="ml-auto flex flex-row gap-3">
                <Menu className="cursor-pointer transition-all opacity-0 scale-75 group-hover:scale-100 group-hover:opacity-100 hover:bg-blue-500/15 
                                        hover:border-blue-500 hover:text-blue-500 w-9 h-9 p-1.5 bg-white/5 border border-white/40 rounded-md" />
                <Trash className="cursor-pointer transition-all opacity-0 scale-75 group-hover:scale-100 group-hover:opacity-100 hover:bg-red-700/15 
                                        hover:border-red-500 hover:text-red-500 w-9 h-9 p-1.5 bg-white/5 border border-white/40 rounded-md" />
            </div>
        </div>
    )
}