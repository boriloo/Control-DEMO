import { useCallback, useEffect, useState } from "react";
import { useRootContext } from "../context/RootContext";
import { useWindowContext } from "../context/WindowContext";
import { FullFileData } from "../services/file";

export default function Icon(icon: FullFileData) {
    const { root } = useRootContext();
    const { fileViewer, openLink, imgViewer, newFile } = useWindowContext();
    const [imageSrc, setImageSrc] = useState<string>("/assets/images/file.png");
    const [isValidImage, setIsValidImage] = useState<boolean>(true)
    const [driveThumb, setDriveThumb] = useState<string | null>(null)

    function getDomainFromUrl(url: string): string {
        try {
            return new URL(url).hostname;
        } catch {
            return "";
        }
    }

    function validateImage(url: string): Promise<boolean> {
        return new Promise((resolve) => {
            let convertedUrl = null
            if (url.startsWith('https://drive.google.com')) {
                const regex = /\/d\/([a-zA-Z0-9_-]+)/;
                const match = url.match(regex);

                if (match && match[1]) {
                    const fileId = match[1];
                    convertedUrl = `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
                    setDriveThumb(convertedUrl)
                } else {
                    console.warn("Não foi possível extrair o ID do arquivo do Google Drive.");

                }
            } else if (/\.(jpg|jpeg|webp|png)$/i.test(url as string)) {
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
        if (icon.type === 'link') {
            async function validate() {
                const isValid = await validateImage(icon.url as string);
                setIsValidImage(isValid)
            }
            validate();
        }
    }, [icon]);


    useEffect(() => {
        function loadIcon() {
            if (icon.type === "folder") return setImageSrc("/assets/images/open-folder.png");
            if (icon.type === "text") return setImageSrc("/assets/images/text-file.png");

            if (icon.type === "link") {
                if (/\.(jpg|jpeg|webp|png)$/i.test(icon.url as string)) {
                    return setImageSrc(isValidImage ? icon.url as string : "/assets/images/image-file.png");
                } else {
                    const domain = getDomainFromUrl(icon.url as string);
                    return setImageSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=256`);
                }
            }

        }
        loadIcon();
    }, [icon, isValidImage]);


    const returnAction = useCallback(() => {
        if (!root.canOpenWindow) return;
        newFile.setFile(icon)
        if (icon.type === "link") {
            if (!icon.url) return;
            if (isValidImage) {
                imgViewer.setFile(icon);
                imgViewer.openWindow();
            } else {
                openLink.setUrl(icon.url as string);
                openLink.openWindow();
            }
        } else if (icon.type === "folder") {
            fileViewer.openWindow();
            fileViewer.setFile(icon)
        }
    }, [icon.url, isValidImage, root])

    return (
        <div onDoubleClick={returnAction} className="group select-none flex flex-col justify-center items-center gap-2 w-20 h-full max-h-40 p-1 px-2 rounded-sm cursor-pointer hover:bg-white/15">
            <div className={`max-w-13 flex justify-center items-center h-8 max-h-8`}>
                <img src={!isValidImage || !driveThumb ? imageSrc : driveThumb} alt={icon.name} className="w-full h-full object-contain pointer-events-none select-none" />
            </div>
            <p className="group-hover:bg-black/60 text-[14px] p-1 bg-black/30 backdrop-blur-sm rounded-md line-clamp-2 text-center max-w-19">{icon.name}</p>
        </div>
    );
}
