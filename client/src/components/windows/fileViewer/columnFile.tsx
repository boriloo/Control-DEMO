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
    const [imageSrc, setImageSrc] = useState<string | null>(null)


    function getDomainFromUrl(url: string): string {
        try {
            return new URL(url).hostname;
        } catch {
            return "";
        }
    }

    useEffect(() => {
        switch (file.fileType) {
            case ('folder'):
                setImageSrc('/assets/images/open-folder.png')
                break
            case ('link'):
                const domain = getDomainFromUrl(file.url as string);
                if (domain) {
                    setImageSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=256`)
                } else {
                    setImageSrc("/assets/images/file.png")
                }
                break;
            default:
                break
        }
    }, [file]);

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
            className={`group flex flex-row p-3 pl-4.5 gap-3 rounded-md bg-linear-to-b from-(--color-regular)/10 to-(--color-regular)/55 transition-all cursor-pointer bg-(--color-dark) 
                hover:bg-(--color-regular)/80 hover:to-(--color-light)/15 animate-slideIn opacity-0 items-center overflow-hidden
            shadow-md min-w-40`}
            style={{
                animationDelay: `${index * 120}ms`,
                animationFillMode: 'forwards'
            }}
        >
            <img src={imageSrc as string} alt="" className="max-h-8 w-8 object-contain transition-all group-hover:ml-0.5" />
            <div className="flex flex-col">
                <p className="text-[18px] w-full max-w-85 truncate transition-all group-hover:ml-1">{file.name}</p>
                <p className="text-[14px] mt-[-5px] opacity-80 transition-all group-hover:ml-1">{imageValidations[file.url as string] ? 'imagem' : file.fileType}</p>
            </div>
            <p className="ml-[-5px] p-1 px-2 opacity-0 transition-all rounded-md group-hover:opacity-100 group-hover:ml-2 text-(--color-lighter) bg-(--color-light)/15">Clique para abrir</p>
            <div className="ml-auto flex flex-row gap-3">

                <Trash onClick={handleDeleteFile} className="cursor-pointer transition-all opacity-0 group-hover:w-30 group-hover:opacity-100 hover:bg-red-700/35 
                absolute right-0 top-0 hover:border-red-500 hover:text-red-500 w-0 h-full p-3.5 bg-(--color-dark)" />
            </div>
        </div>
    )
}