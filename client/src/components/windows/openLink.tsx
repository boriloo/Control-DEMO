import { useWindowContext } from "../../context/WindowContext";
import { returnFilterEffects } from "../../types/auth";
import { useUser } from "../../context/AuthContext";
import { useEffect, useState } from "react";

export default function OpenLinkWindow({ url }: { url: string | null }) {
    const { user } = useUser();
    const { openLink } = useWindowContext();
    const [imageSrc, setImageSrc] = useState<string | null>(null)

    const handleAreaClick = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target != e.currentTarget) return;
        openLink.closeWindow();
    }


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
        function loadIcon() {
            const domain = getDomainFromUrl(openLink.url as string);
            if (domain) {
                setImageSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=256`);
            } else {
                setImageSrc("/assets/images/file.png");
            }
        }

        loadIcon();
    }, [openLink.url]);


    return (
        <div onClick={handleAreaClick} className={`${openLink.currentStatus === 'open' ? returnFilterEffects() : 'pointer-events-none '} 
        transition-all duration-500 fixed z-110 w-full h-screen flex justify-center items-center p-4 pb-[50px] cursor-pointer`}>
            <div className={`${openLink.currentStatus === 'open' ? 'scale-100' : 'scale-0'} cursor-default bg-(--color-dark)
             origin-center rounded-md p-4 w-full max-w-[700px] max-h-full flex flex-col gap-4 overflow-y-auto transition-all relative`}>
                <div className="p-1.5 bg-(--color-regular) border border-(--color-light)/50 rounded-md absolute top-4 right-4">
                    <img src={imageSrc as string} className="w-10 object-contain pointer-events-none select-none" />
                </div>
                <h1 className="text-[25px] truncate max-w-[85%]">{openLink.name}</h1>
                <p className="mt-[-10px] text-[18px] text-red-400">Aviso - Você será redirecionado à outra página</p>
                <div className="flex flex-col gap-1">
                    {url && (
                        <>
                            <p className="text-[18px]">Domínio</p>
                            <p className="text-[18px] max-w-full p-1 bg-(--color-regular) border-1 rounded-md border-(--color-light)/50 px-2">
                                {new URL(url).hostname}
                            </p>
                            <p className="text-[18px] mt-2">URL</p>
                            <p className="text-[18px] max-w-full overflow-auto p-1 bg-(--color-regular) border-1 rounded-md border-(--color-light)/50 px-2">
                                {url}
                            </p>
                        </>
                    )}

                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row w-full justify-between mt-1">

                        {/* VERSAO LANCAMENTO */}

                        {/* <div className="flex flex-row gap-2 items-center p-1 px-2 hover:bg-(--color-regular) rounded-sm transition-all cursor-pointer">
                            <div className="w-6 h-6 border-1 rounded-sm"></div>
                            <p className="text-lg">Confiar neste link</p>
                        </div> */}
                        <div className="flex flex-row gap-2 w-full">
                            <button onClick={openLink.closeWindow} className="flex-1 p-1 px-8 text-lg text-white bg-(--color-regular) cursor-pointer transition-all hover:bg-red-500 rounded-md">
                                Voltar
                            </button>
                            <button onClick={() => {
                                window.open(url as string, '_blank')?.focus();
                                openLink.closeWindow();
                            }} className="flex-1 p-1 px-6 text-lg text-(--color-lighter) border-1 border-(--color-lighter) cursor-pointer transition-all hover:bg-(--color-lighter) hover:text-white rounded-md">
                                Acessar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}