import { useCallback, useEffect, useState } from "react";
import { useRootContext } from "../context/RootContext";
import { useWindowContext } from "../context/WindowContext";
import { FileData } from "../types/file";

interface IconProps {
    icon: FileData;
    beingDragged: boolean;
}

export default function Icon({ icon, beingDragged }: IconProps) {

    const { root } = useRootContext();
    const { fileViewer, openLink, imgViewer, newFile, contextMenu } = useWindowContext();
    const [imageSrc, setImageSrc] = useState<string>("/assets/images/file.png");
    // const [loading, setLoading] = useState<>
    const [isValidImage, setIsValidImage] = useState<boolean | null>(null)
    const [driveThumb, setDriveThumb] = useState<string | null>(null)


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
        const validateImage = async (): Promise<boolean> => {
            return new Promise((resolve) => {
                if (!icon.url || icon.fileType !== 'link') return;
                let convertedUrl = 'null'

                if (icon.url.startsWith('https://drive.google.com')) {
                    const regex = /\/d\/([a-zA-Z0-9_-]+)/;
                    const match = icon.url.match(regex);

                    if (match && match[1]) {
                        const fileId = match[1];
                        convertedUrl = `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
                        setDriveThumb(convertedUrl)
                    } else {
                        console.warn("Não foi possível extrair o ID do arquivo do Google Drive.");
                    }
                } else if (/\.(jpg|jpeg|webp|png)/i.test(icon.url as string)) {
                    convertedUrl = icon.url
                }

                const img = new Image();


                if (convertedUrl) {
                    img.src = convertedUrl;
                } else {
                    img.src = icon.url
                }
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
            });
        }


        const callValidateFunction = async () => {
            const isValid = await validateImage();

            setIsValidImage(isValid)
        }

        callValidateFunction()

    }, [icon.url])


    useEffect(() => {
        function loadIcon() {
            if (icon.fileType === "folder") {
                return setImageSrc("/assets/images/open-folder.png");
            }

            if (icon.fileType === "link") {
                if (isValidImage === null) return;

                if (isValidImage) {
                    if (driveThumb) {
                        setImageSrc(driveThumb);
                    } else {
                        setImageSrc(icon.url as string);
                    }
                } else {
                    const domain = getDomainFromUrl(icon.url as string);
                    if (domain) {
                        setImageSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=256`);
                    } else {
                        setImageSrc("/assets/images/file.png");
                    }
                }
            }
        }
        loadIcon();
    }, [icon, isValidImage]);


    const returnAction = useCallback(() => {

        if (!root.canOpenWindow || beingDragged) return;
        newFile.setFile(icon)
        if (icon.fileType === "link") {
            if (!icon.url) return;
            if (isValidImage) {
                imgViewer.setFile(icon);
                imgViewer.openWindow();
            } else {
                openLink.setName(icon.name as string);
                openLink.setUrl(icon.url as string);
                openLink.setBackPath(false);
                openLink.openWindow();
            }
        }

        if (icon.fileType === "folder") {
            fileViewer.openWindow();
            fileViewer.setFile(icon)
        }
    }, [icon.url, isValidImage, root])


    return (
        <div onDoubleClick={returnAction} className={`${contextMenu.selectedIconId === icon.id ? 'bg-blue-500/30  border-blue-500' : `border-transparent ${beingDragged ? 'scale-105 bg-blue-500/25' : 'hover:bg-white/15'}`} 
        border-2  transition-all p-1 px-2 duration-300 group select-none flex flex-col justify-center 
        items-center gap-2 w-20 h-full max-h-40  rounded-sm cursor-pointer `}>
            <div className={`${beingDragged ? 'scale-106' : 'group-hover:scale-103'} max-w-13 flex justify-center items-center h-8 max-h-8 transition-transform origin-center drop-shadow-zinc-950/40 drop-shadow-md`}>
                <img src={imageSrc} alt={icon.name} className="w-full h-full object-contain pointer-events-none select-none " />
            </div>
            <p className={`${contextMenu.selectedIconId === icon.id ? 'bg-black/70' : `group-hover:bg-black/60 bg-black/40 ${beingDragged ? 'scale-106' : 'group-hover:scale-103'}`}  
             text-[14px]/5 p-1  backdrop-blur-sm rounded-md line-clamp-2 text-center 
            max-w-19 transition-all origin-top text-shadow-sm text-shadow-black/40`}>{icon.name}</p>
        </div>
    );
}
