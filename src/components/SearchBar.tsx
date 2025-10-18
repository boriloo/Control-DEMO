import { ExternalLink, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/AuthContext";
import { FullFileData, listenToAllFilesByDesktop } from "../services/file";
import { FileType } from "../types/file";

export default function SearchBar() {
    const { t } = useTranslation();
    const { user, currentDesktop } = useUser();
    const [allFiles, setAllFiles] = useState<FullFileData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [imageValidations, setImageValidations] = useState<Record<string, boolean>>({});

    function getDomainFromUrl(url: string): string {
        try {
            return new URL(url).hostname;
        } catch {
            return "";
        }
    }

    useEffect(() => {
        if (!user || !currentDesktop?.id) return;

        const unsubscribeAll = listenToAllFilesByDesktop(
            user.uid as string,
            currentDesktop.id,
            (newFiles) => {
                setAllFiles(newFiles);
            }
        );

        return () => unsubscribeAll();

    }, [currentDesktop?.id, user?.uid]);


    // Arquivos pesquisa filtradas
    const filteredFiles = useMemo(() => {
        if (searchTerm.trim() === '') {
            return [];
        }

        return allFiles.filter(file =>
            file.name && file.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, allFiles]);

    // Manter validações de imagem atualizadas
    useEffect(() => {
        filteredFiles.forEach(file => {
            if (file.type === 'link' && file.url && !imageValidations[file.url]) {
                validateImage(file.url).then(isValid => {
                    setImageValidations(prev => ({
                        ...prev,
                        [file.url as string]: isValid
                    }));
                });
            }
        });
    }, [filteredFiles]);

    function validateImage(url: string): Promise<boolean> {
        return new Promise((resolve) => {
            let convertedUrl = null
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
            case 'text':
                return '/assets/images/text-file.png'
            case 'link':
                const domain = getDomainFromUrl(fileUrl);
                if (imageValidations[fileUrl]) {
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



    return (
        <div className="w-full max-w-[400px] relative">
            <Search className='absolute left-3 z-10 top-1/2 -translate-y-1/2 text-zinc-200 transition-all duration-300' />
            <input
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                className="peer w-full h-10 pl-11 pr-4 cursor-pointer transition-all duration-300 outline-none border-1 border-transparent
                            bg-black/40 backdrop-blur-md hover:bg-black/45 focus:bg-black/55 focus:backdrop-blur-lg focus:border-blue-500 rounded-full"
                placeholder={t("dashboard.search")}
            />
            <div className={`z-10 absolute transition-all pointer-events-none peer-focus:pointer-events-auto 
            peer-focus:opacity-100 ${searchTerm.trim() !== '' ? '' : ''} 
            opacity-0 flex flex-col bg-zinc-900 top-10 rounded-md w-full max-h-[300px] overflow-y-auto`}>
                {filteredFiles.map((file) => (
                    <div key={file.id} className="min-h-13 group flex flex-row justify-between relative rounded-md cursor-pointer hover:bg-zinc-800 
                    overflow-hidden transition-all">
                        <div className="flex flex-row gap-2 p-3 w-full items-center">
                            <img src={imageReturn(file.type, file.url as string)} className="w-7 max-h-5 object-contain" alt={file.name} />
                            <div className="flex flex-col">
                                <p className="text-[18px]">{file.name}</p>
                                <p className="text-[14px] mt-[-5px] opacity-80">{imageValidations[file.url as string] ? 'imagem' : file.type}</p>
                            </div>
                            
                        </div>
                        <p className="absolute bg-blue-500 h-full right-0 flex items-center justify-end gap-2
                    transition-all text-center font-medium text-lg overflow-hidden max-w-0 w-full group-hover:pr-3 group-hover:max-w-[95px]">
                            Abrir <ExternalLink size={20} />
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}