import { useEffect, useState } from "react";
import { useRootContext } from "../context/RootContext";
import { useWindowContext } from "../context/WindowContext";
import { FullFileData } from "../services/file";

export default function Icon(icon: FullFileData) {
    const { root } = useRootContext();
    const { file, openLink, imgViewer } = useWindowContext();
    const [imageSrc, setImageSrc] = useState<string>("/assets/images/file.png");
    const [isValidImage, setIsValidImage] = useState<boolean>(true)

    function getDomainFromUrl(url: string): string {
        try {
            return new URL(url).hostname;
        } catch {
            return "";
        }
    }

    function validateImage(url: string): Promise<boolean> {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
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

    function returnAction() {
        if (!root.canOpenWindow) return;

        if (icon.type === "link") {
            if (/\.(jpg|jpeg|webp|png)/i.test(icon.url as string)) {
                if (isValidImage) {
                    imgViewer.setFile(icon);
                    imgViewer.openWindow();
                } else {
                    openLink.setUrl(icon.url as string);
                    openLink.openWindow();
                }
            } else {
                openLink.setUrl(icon.url as string);
                openLink.openWindow();
            }
        } else if (icon.type === "image") {
            imgViewer.setFile(icon);
            imgViewer.openWindow();
        } else {
            file.openWindow();
        }
    }

    return (
        <div onClick={returnAction} className="group select-none flex flex-col justify-center items-center gap-2 w-20 p-1 px-2 rounded-sm cursor-pointer hover:bg-white/15">
            <div className={`${icon.type === 'image' ? '' : 'max-w-10'} flex justify-center items-center h-12 max-h-12`}>
                <img src={imageSrc} alt={icon.name} className="w-full h-full object-contain pointer-events-none select-none" />
            </div>
            <p className="group-hover:bg-black/60 text-[14px] p-1 px-2 bg-black/30 backdrop-blur-sm rounded-md truncate max-w-19">{icon.name}</p>
        </div>
    );
}
