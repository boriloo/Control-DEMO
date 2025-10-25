import { Clipboard, Maximize, Menu, Minus, UserRoundX, X } from "lucide-react"
import { useState } from "react"
import { useUser } from "../../context/AuthContext";
import { useWindowContext } from "../../context/WindowContext";
import { returnFilterEffects } from "../../types/auth";
import { useAppContext } from "../../context/AppContext";

export default function SocialWindow() {
    const { user, authLogoutUser } = useUser();
    const { profile, config } = useWindowContext();
    const [friendList, setFriendList] = useState<boolean>(true)
    const [isFullsceen, setIsFullscreen] = useState<boolean>(false)

    if (!user) return null;

    const handleAreaClick = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target != e.currentTarget) return;
        profile.closeWindow();
    }


    return (

        <div onClick={handleAreaClick} className={`${isFullsceen ? 'pb-[40px]' : ' p-2 pb-[50px]'} ${profile.currentStatus != "open" ? returnFilterEffects(user) : 'pointer-events-none'} 
        fixed z-100 flex-1 flex justify-center items-center w-full h-screen transition-all duration-500 cursor-pointer`}>
            <div className={`${isFullsceen ? 'max-w-full max-h-full' : 'rounded-lg max-w-[1200px] max-h-[700px]'} ${profile.currentStatus != "open" ? 'scale-100' : 'scale-0 '} 
                bg-zinc-900 cursor-default origin-bottom relative transition-all duration-300 flex flex-col w-full h-full overflow-y-auto`}>

                <div className="z-50 sticky select-none top-0 w-full bg-black/50 h-8 flex flex-row justify-between items-center backdrop-blur-[2px]">
                    <p className="p-2">Social</p>
                    <div className="flex flex-row h-full">
                        <Minus onClick={profile.minimizeWindow} className="transition-colors cursor-pointer p-1 px-2 w-9 h-full hover:bg-white/20" />
                        <Maximize onClick={() => setIsFullscreen(!isFullsceen)} className="transition-colors cursor-pointer p-1 px-2 w-9 h-full hover:bg-white/20" />
                        <X onClick={profile.closeWindow} className="transition-colors cursor-pointer p-1 px-2 w-9 h-full hover:bg-red-500" />
                    </div>
                </div>

                <div className="flex flex-row w-full p-6 gap-6 items-start flex-wrap">
                    <div className="flex-1 flex flex-col gap-2 min-w-[300px]">
                        <h1 className="text-[24px]">Suas Informações</h1>
                        <div className="min-h-40 flex-1 bg-zinc-800 rounded-md p-4 py-5 flex flex-col gap-4">
                            <div className="flex flex-row gap-2 items-center">
                                <img src={`${user.profileImage || "/assets/images/profile.png"}`} alt="" className="z-20 w-12 h-12 rounded-full" />
                                <div className="flex flex-col">
                                    <h1>{user.name as string}</h1>
                                    <p>{user.email as string}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p>15 Amigos</p>
                                <p>23 Colaboradores</p>
                            </div>

                            <button className="flex flex-row gap-2 items-center p-1 mt-2 text-[16px] 
                            px-3 border-[1.5px] border-white/50 cursor-pointer rounded-md bg-zinc-900 self-center text-white transition-all hover:border-blue-500 hover:text-blue-500 hover:bg-zinc-950">
                                <p>Copiar Link de amizade</p>
                                <Clipboard size={16} />
                            </button>

                            <div className="w-full h-[1px] bg-zinc-600"></div>

                        </div>
                    </div>
                    <div className="flex-2 flex flex-col gap-2">
                        <div className="flex flex-row gap-2">
                            <input type="text" placeholder="Email do usuário" className="bg-zinc-950/40 border-1 flex-1 rounded-sm p-1.5 px-2 border-zinc-800
                            hover:bg-zinc-950/60 transition-all outline-none focus:border-zinc-500 focus:bg-zinc-950/80" />
                            <button className="p-1 px-2 border-1 rounded-sm text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white
                            transition-all cursor-pointer">Enviar pedido</button>
                        </div>
                        <div className="min-h-40 bg-zinc-950 p-4 gap-3 rounded-md flex flex-col">

                            <div className="flex flex-row w-full">
                                <div className="flex-1 flex justify-center">
                                    <h1 onClick={() => setFriendList(true)} className={`${friendList ? 'border-blue-500 text-blue-500 w-full hover:bg-blue-500/10' :
                                        'border-white hover:bg-zinc-300/5'}
                                    border-b-1 p-1 text-lg w-20 hover:w-full  rounded-t-sm text-center transition-all cursor-pointer`}>Amigos</h1>
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <h1 onClick={() => setFriendList(false)} className={`${!friendList ? 'border-blue-500 text-blue-500 w-full hover:bg-blue-500/10' :
                                        'border-white hover:bg-zinc-300/5'}
                                    border-b-1 p-1 text-lg w-20 hover:w-full rounded-t-sm text-center transition-all cursor-pointer`}>Pendente</h1>
                                </div>

                            </div>

                            <div className="group flex flex-row items-center gap-2 p-4 rounded-sm bg-zinc-900">
                                <img src={`${user.profileImage || "/assets/images/profile.png"}`} alt="" className="z-20 w-10 h-10 rounded-full" />

                                <h1 className="text-lg">{user.name as string}</h1>
                                <UserRoundX className="cursor-pointer transition-all opacity-0 scale-75 group-hover:scale-100 group-hover:opacity-100 hover:bg-red-500/15 
                                hover:border-red-500 hover:text-red-500 w-9.5 h-9.5 p-1.5 bg-white/5 border border-white/40 rounded-md ml-auto" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}