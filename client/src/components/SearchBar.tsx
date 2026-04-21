import { ExternalLink, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/AuthContext";
// import { FullFileData, listenToAllFilesByDesktop } from "../services/file";
import { useRootContext } from "../context/RootContext";
import { useAppContext } from "../context/AppContext";
import { useWindowContext } from "../context/WindowContext";
import { FileData, FileType } from "../types/file";
import { useFileContext } from "../context/FileContext";
import { getAllFilesFromDesktopService } from "../services/fileServices";

export default function SearchBar() {
    const { allFiles, changeAllFiles } = useFileContext()
    const { t } = useTranslation();
    const { root } = useRootContext();
    const { minimazeAllWindows } = useAppContext();
    const { newFile, imgViewer, openLink, fileViewer } = useWindowContext();
    const { user, currentDesktop } = useUser();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [imageValidations, setImageValidations] = useState<Record<string, boolean>>({});

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
        if (!user || !currentDesktop?.id) return;

        const getAllFiles = async () => {
            try {
                const files = await getAllFilesFromDesktopService(currentDesktop.id)

                changeAllFiles(files)

            } catch (err) {
                alert(err)
            }
        }

        getAllFiles()

    }, [currentDesktop?.id, user?.id]);



    const filteredFiles = useMemo(() => {
        if (searchTerm.trim() === '') {
            return [];
        }

        return allFiles.filter(file =>
            file.name && file.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, allFiles]);


    useEffect(() => {
        filteredFiles.forEach(file => {
            if (file.fileType === 'link' && file.url && !imageValidations[file.url]) {
                validateImage(file.url).then(isValid => {
                    setImageValidations(prev => ({
                        ...prev,
                        [file.url as string]: isValid
                    }));
                });
            }
        });
    }, [filteredFiles, allFiles]);

    function validateImage(url: string): Promise<boolean> {
        return new Promise((resolve) => {
            let convertedUrl = 'null'
            if (url.startsWith('https://drive.google.com')) {
                const regex = /\/d\/([a-zA-Z0-9_-]+)/;
                const match = url.match(regex);

                if (match && match[1]) {
                    const fileId = match[1];
                    convertedUrl = `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
                } else {
                    console.warn("Não foi possível extrair o ID do arquivo do Google Drive.");
                }
            } else if (/\.(jpg|jpeg|webp|png|gif|bmp|svg)$/i.test(url)) {
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

    function imageReturn(fileType: FileType, fileUrl: string) {
        switch (fileType) {
            case 'folder':
                return '/assets/images/open-folder.png'
            case 'link':
                const domain = getDomainFromUrl(fileUrl);
                if (imageValidations[fileUrl]) {
                    if (fileUrl?.startsWith('https://drive.google.com')) {
                        const regex = /\/d\/([a-zA-Z0-9_-]+)/;
                        const match = fileUrl.match(regex);

                        if (match && match[1]) {
                            const fileId = match[1];
                            return `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
                        } else {
                            console.warn("Não foi possível extrair o ID do arquivo do Google Drive.");
                        }
                    }
                    return fileUrl
                } else if (domain) {
                    return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
                } else {
                    return '/assets/images/link.png'
                }
            default:
                return '/assets/images/link.png'
        }
    }

    const returnAction = useCallback((file: FileData) => {
        if (!root.canOpenWindow) return;

        newFile.setFile(file)
        minimazeAllWindows();
        if (file.fileType === "link") {
            if (!file.url) return;
            if (imageValidations[file.url]) {
                imgViewer.setFile(file);
                imgViewer.openWindow();
            } else {
                openLink.setName(file.name)
                openLink.setUrl(file.url as string);
                openLink.openWindow();
            }
        } else if (file.fileType === "folder") {
            fileViewer.openWindow();
            fileViewer.setFile(file)
        }
    }, [imageValidations, root, allFiles])



    return (
        <div className="w-full max-w-[400px] relative select-none">
            <Search className='absolute left-3 z-10 top-1/2 -translate-y-1/2 text-zinc-200 transition-all duration-300' />
            <input
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                className="peer w-full h-10 pl-11 pr-4 cursor-pointer transition-all duration-300 outline-none border-[2px] border-transparent
                            bg-black/40 backdrop-blur-md hover:bg-black/45 focus:bg-black/55 focus:backdrop-blur-lg focus:border-(--color-lighter) rounded-full"
                placeholder={t("dashboard.search")}
            />
            <div className={`z-10 absolute transition-all pointer-events-none peer-focus:pointer-events-auto hover:pointer-events-auto
            peer-focus:opacity-100 hover:opacity-100 ${searchTerm.trim() !== '' ? '' : ''} 
            opacity-0 flex flex-col bg-(--color-dark) top-10 rounded-md w-full max-h-[300px] overflow-y-auto`}>
                {filteredFiles.map((file) => (
                    <div key={file.id} onClick={() => returnAction(file)} className="min-h-14 group flex flex-row justify-between relative rounded-md 
                    cursor-pointer hover:bg-(--color-regular)/30 overflow-hidden transition-all">
                        <div className="flex flex-row gap-2 p-3 w-full items-center">
                            <img src={imageReturn(file.fileType, file.url as string)} className="w-7 max-h-5 object-contain" alt={file.name} />
                            <div className="flex flex-col">
                                <p className="text-[18px] max-w-55 truncate">{file.name}</p>
                                <p className="text-[14px] mt-[-5px] opacity-80">{imageValidations[file.url as string] ? 'imagem' : file.fileType}</p>
                            </div>
                            <p className="ml-[-5px] p-1 px-2 opacity-0 transition-all rounded-md group-hover:opacity-100 group-hover:ml-2 text-(--color-lighter) bg-(--color-light)/15">Clique para abrir</p>
                        </div>
                        {/* <p className="absolute bg-(--color-light) h-full right-0 flex items-center justify-end gap-2
                    transition-all text-center font-medium text-lg overflow-hidden max-w-0 w-full group-hover:pr-3 group-hover:max-w-[95px]">
                            Abrir <ExternalLink size={20} />
                        </p> */}
                    </div>
                ))}
            </div>
        </div>
    )
}