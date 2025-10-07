import { Maximize, Minus, Palette, Shield, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useWindowContext } from "../../context/WindowContext";
import AppearanceOption from "./configOptions/appearance";
import { useUser } from "../../context/AuthContext";
import { returnFilterEffects } from "../../types/auth";
import AccountOption from "./configOptions/account";

export type tabs = "account" | "security" | "appearance"

export default function ConfigWindow() {
    const { user } = useUser();
    const { config } = useWindowContext();
    const [isFullsceen, setIsFullscreen] = useState<boolean>(false)

    useEffect(() => {
        console.log('estado atual de user: ', user)
    }, [user])

    const handleAreaClick = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target != e.currentTarget) return;
        config.minimizeWindow();
    }

    const returnTab = () => {
        switch (config.currentTab) {
            case ('account'):
                return <AccountOption />
            case ('security'):
                return
            case ('appearance'):
                return <AppearanceOption />
        }
    }

    return (
        config.currentStatus != "closed" && (<div onClick={handleAreaClick} className={`${isFullsceen ? 'pb-[40px]' : ' p-2 pb-[50px]'} 
            ${config.currentStatus === "open" ? returnFilterEffects(user) : 'pointer-events-none'} 
        fixed z-100 flex-1 flex justify-center items-center w-full h-screen transition-all duration-500 cursor-pointer`}>
            <div className={`${isFullsceen ? 'max-w-full max-h-full' : 'rounded-lg max-w-[1200px] max-h-[700px]'} ${config.currentStatus === "open" ? 'scale-100' : 'scale-0 '} 
                cursor-default origin-bottom relative transition-all rounded-lg duration-300 flex flex-col bg-zinc-900 w-full h-full overflow-hidden`}
            >
                <div className="z-50 sticky select-none top-0 w-full bg-black/50 h-8 flex flex-row justify-between items-center backdrop-blur-[2px]">
                    <p className="p-2">Configurações</p>
                    <div className="flex flex-row h-full">
                        <Minus onClick={config.minimizeWindow} className="transition-colors cursor-pointer p-1 px-2 w-9 h-full hover:bg-white/20" />
                        <Maximize onClick={() => setIsFullscreen(!isFullsceen)} className="transition-colors cursor-pointer p-1 px-2 w-9 h-full hover:bg-white/20" />
                        <X onClick={config.closeWindow} className="transition-colors cursor-pointer p-1 px-2 w-9 h-full hover:bg-red-500" />
                    </div>
                </div>
                <div className="flex flex-row w-full h-full">
                    <div className="group bg-zinc-950 h-auto flex flex-col gap-2 p-4 select-none">
                        <div onClick={() => config.setCurrentTab('account')} className={`${config.currentTab === 'account' ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-zinc-800'} 
                            flex flex-row w-full items-center cursor-pointer rounded-md p-2 gap-0 transition-all hover:gap-1`}>
                            <User />
                            <p className="overflow-hidden max-w-0 transition-all group-hover:pr-10 group-hover:ml-2 group-hover:max-w-80 text-lg">Conta</p>
                        </div>
                        <div onClick={() => config.setCurrentTab('security')} className={`${config.currentTab === 'security' ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-zinc-800'} 
                            flex flex-row w-full items-center cursor-pointer rounded-md p-2 gap-0 transition-all hover:gap-1`}>
                            <Shield />
                            <p className="overflow-hidden max-w-0 transition-all group-hover:pr-10 group-hover:ml-2 group-hover:max-w-80 text-lg">Segurança</p>
                        </div>
                        <div onClick={() => config.setCurrentTab('appearance')} className={`${config.currentTab === 'appearance' ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-zinc-800'} 
                            flex flex-row w-full items-center cursor-pointer rounded-md p-2 gap-0 transition-all hover:gap-1`}>
                            <Palette />
                            <p className="overflow-hidden max-w-0 transition-all group-hover:pr-10 group-hover:ml-2 group-hover:max-w-80 text-lg">Aparência</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-full overflow-y-auto pb-15">
                        {returnTab()}
                    </div>
                </div>
            </div>
        </div >)
    )
}