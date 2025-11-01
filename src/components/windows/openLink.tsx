import { useWindowContext } from "../../context/WindowContext";
import { returnFilterEffects } from "../../types/auth";
import { useUser } from "../../context/AuthContext";

export default function OpenLinkWindow({ url }: { url: string | null }) {
    const { user } = useUser();
    const { openLink } = useWindowContext();

    const handleAreaClick = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target != e.currentTarget) return;
        openLink.closeWindow();
    }



    return (
        <div onClick={handleAreaClick} className={`${openLink.currentStatus === 'open' ? returnFilterEffects(user) : 'pointer-events-none '} 
        transition-all duration-500 fixed z-110 w-full h-screen flex justify-center items-center p-4 pb-[50px] cursor-pointer`}>
            <div className={`${openLink.currentStatus === 'open' ? 'scale-100' : 'scale-0'} cursor-default bg-zinc-900 shadow-[inset_0_5px_10px_rgba(255,255,255,0.05),0_5px_10px_rgba(0,0,0,0.3)]
             origin-center rounded-md p-4 w-full max-w-[700px] max-h-full flex flex-col gap-4 overflow-y-auto transition-all relative`}>
                <h1 className="text-[20px]">Aviso - Você será redirecionado à outra página</h1>
                <div className="flex flex-col gap-1">
                    {url && (
                        <>
                            <p className="text-[18px]">Domínio</p>
                            <p className="text-[18px] max-w-full p-1 bg-zinc-800 border-1 rounded-md border-zinc-700">
                                {new URL(url).hostname}
                            </p>
                            <p className="text-[18px] mt-2">URL</p>
                            <p className="text-[18px] max-w-full overflow-auto p-1 bg-zinc-800 border-1 rounded-md border-zinc-700">
                                {url}
                            </p>
                        </>
                    )}

                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row w-full justify-between mt-1">
                        <div className="flex flex-row gap-2 items-center p-1 px-2 hover:bg-white/10 rounded-sm transition-all cursor-pointer">
                            <div className="w-6 h-6 border-1 rounded-sm"></div>
                            <p className="text-lg">Confiar neste link</p>
                        </div>
                        <div className="flex flex-row gap-2">
                            <button onClick={openLink.closeWindow} className="p-1 px-5 text-lg text-white border-1 border-white cursor-pointer transition-all hover:border-red-500 hover:text-red-500 rounded-md">
                                Voltar
                            </button>
                            <button onClick={() => {
                                window.open(url as string, '_blank')?.focus();
                                openLink.closeWindow();
                            }} className="p-1 px-5 text-lg text-blue-500 border-1 border-blue-500 cursor-pointer transition-all hover:bg-blue-500 hover:text-white rounded-md">
                                Acessar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}