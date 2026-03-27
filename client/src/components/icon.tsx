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
    const { fileViewer, openLink, imgViewer, newFile } = useWindowContext();
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
                    console.log('imagem tem png no nome')
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

        if (!root.canOpenWindow) return;
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
        <div onDoubleClick={returnAction} className={`${beingDragged ? 'scale-105' : ''} transition-all duration-300 group select-none flex flex-col justify-center 
        items-center gap-2 w-20 h-full max-h-40 p-1 px-2 rounded-sm cursor-pointer hover:bg-white/15`}>
            <div className={`max-w-13 flex justify-center items-center h-8 max-h-8`}>
                <img src={imageSrc} alt={icon.name} className="w-full h-full object-contain pointer-events-none select-none" />
            </div>
            <p className="group-hover:bg-black/60 text-[14px] p-1 bg-black/30 backdrop-blur-sm rounded-md line-clamp-2 text-center max-w-19 transition-all">{icon.name}</p>
        </div>
    );
}
