import { Bot, ExternalLink, Menu, X } from "lucide-react"
import { useWindowContext } from "../../context/WindowContext";
import { returnFilterEffects } from "../../types/auth";
import { useUser } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";
import { useEffect, useState } from "react";
// import { getDesktopById } from "../../services/desktop";
import { useTranslation } from "react-i18next";
import { getDesktopByIdService, getDesktopByOwnerService } from "../../services/desktopServices";
import { DesktopData } from "../../types/desktop";
import { useFileContext } from "../../context/FileContext";
// import { collection, onSnapshot, query, where } from "firebase/firestore";
// import { db } from "../../firebase/config";

export default function ListDesktopsWindow() {
    const { t } = useTranslation();
    const { changeRootFiles } = useFileContext();
    const { user, currentDesktop, changeCurrentDesktop, toBase64Image } = useUser();
    const { minimazeAllWindows } = useAppContext();
    const { listdt, newdt, dtConfig } = useWindowContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [allDesktops, setAllDesktops] = useState<DesktopData[]>([]);

    const handleAreaClick = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target != e.currentTarget) return;
        listdt.minimizeWindow();
    }

    useEffect(() => {
        if (!user) {
            setAllDesktops([]);
            return;
        };

        const getAllDesktops = async () => {
            const responseDesktops = await getDesktopByOwnerService();

            const otherDesktops = responseDesktops.filter((desktop: DesktopData) => desktop.id !== currentDesktop?.id);

            setAllDesktops(otherDesktops)
        }

        getAllDesktops();

    }, [user, dtConfig.desktop, currentDesktop?.id]);

    const handleChangeDesktop = async (id: string) => {
        setLoading(true)
        try {

            changeRootFiles([])

            const response = await getDesktopByIdService(id)

            changeCurrentDesktop(response)

            localStorage.setItem('last-desktop', response.id);

            // listdt.closeWindow()
        } catch (err) {
            console.log(err)
            throw err
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
    }

    return (
        listdt.currentStatus != 'closed' && <div onClick={handleAreaClick} className={`${listdt.currentStatus === 'open' ? returnFilterEffects() : 'pointer-events-none '} 
        transition-all duration-500 fixed z-100 w-full h-screen flex justify-center items-center p-4 pb-[50px] cursor-pointer`}>
            <div style={{ transition: 'background-color 1s, scale 0.2s, opacity 0.2s' }} className={`${listdt.currentStatus === 'open' ? 'scale-100' : 'scale-50 opacity-0'} 
            cursor-default bg-(--color-dark) origin-center rounded-md p-4 w-full 
                max-w-[700px] max-h-full flex flex-col gap-4 overflow-y-auto transition-all relative pb-10 `}>
                <X onClick={listdt.minimizeWindow} size={35} className="absolute top-0 right-0 p-2 rounded-bl-lg cursor-pointer transition-all hover:bg-red-500" />
                <h1 className="text-[24px]">{t("listdt.title")}</h1>
                <div className={`${loading ? 'opacity-20 saturate-0 pointer-events-none' : ''} transition-all flex flex-col gap-3 w-full max-h-[500px] items-center overflow-y-auto`}>
                    <div onClick={() => {
                        minimazeAllWindows()
                        dtConfig.openWindow()
                        dtConfig.setDesktop(currentDesktop)
                    }} className="group flex flex-row w-full p-4 justify-start bg-(--color-light) items-center rounded-sm  transition-all hover:bg-(--color-lighter) overflow-hidden cursor-pointer relative gap-2">
                        <div className="gap-1 flex flex-row text-lg white font-medium h-7.5 group-hover:scale-105 transition-all">
                            <p>Atual -</p>
                            {currentDesktop?.name}
                        </div>
                        <h1 className="text-lg">


                            {/* VERSÃO LANÇAMENTO */}

                            {/* ({currentDesktop?.type}) */}
                        </h1>

                        <p className="transition-all opacity-0 ml-[-10px] group-hover:opacity-100 group-hover:ml-1 text-white bg-black/30 p-1 px-2 rounded-sm">Clique para editar</p>

                        <div className="flex flex-row gap-2 items-center">
                            <p className="transition-all opacity-0 group-hover:opacity-100 mr-[-5px] group-hover:mr-1">

                                {/* VERSÃO LANÇAMENTO */}

                                {/* {currentDesktop?.members.length} {''}
                                {currentDesktop?.members.length && currentDesktop?.members.length > 1 ? t("listdt.members") : t("listdt.member")} */}
                            </p>
                            {/* <div
                                className="absolute right-0 h-full cursor-pointer transition-all opacity-0 group-hover:opacity-100 group-hover:w-28
                                    hover:border-(--color-lighter)  w-0 p-2 bg-(--color-lighter) text-white
                                    flex flex-row items-center gap-2 justify-center">
                                <Menu size={28} />
                                <p className="text-[18px]">Editar</p>
                            </div> */}

                        </div>
                    </div>
                    {allDesktops.length >= 1 ?
                        allDesktops.map((desktop) => (
                            <div key={desktop.id} onClick={() => handleChangeDesktop(desktop.id)} className="group flex flex-row w-[98%] p-3 items-center bg-(--color-darker) border-2 border-transparent 
                            cursor-pointer hover:bg-(--color-regular)/40 hover:scale-102 hover:border-(--color-light) relative overflow-hidden
                            rounded-sm transition-all justify-start gap-4">
                                <h1 className="text-lg group-hover:scale-105 transition-all h-7.5">
                                    {desktop.name}


                                    {/* VERSÃO LANÇAMENTO */}

                                    {/* ({desktop.type}) */}


                                </h1>

                                <p className="transition-all opacity-0 ml-[-10px] group-hover:opacity-100 group-hover:ml-0 text-(--color-lighter)">Clique para abrir</p>
                                <div className="flex flex-row gap-2 items-center">


                                    {/* VERSÃO LANÇAMENTO */}

                                    {/* <p className="transition-all opacity-0 group-hover:opacity-100 mr-[-5px] group-hover:mr-1">
                                        {desktop.members.length} {desktop.members.length > 1 ? t("listdt.members") : t("listdt.member")}
                                    </p> */}


                                    <div onClick={(e) => {
                                        e.stopPropagation();
                                        minimazeAllWindows()
                                        dtConfig.openWindow()
                                        dtConfig.setDesktop({
                                            ...desktop,
                                            backgroundImage: toBase64Image(desktop.backgroundImage) ?? desktop.backgroundImage
                                        })

                                    }}
                                        className="absolute right-0 h-full cursor-pointer transition-all opacity-0 group-hover:opacity-100 group-hover:w-28
                                    hover:border-(--color-lighter)  w-0 p-2 hover:bg-(--color-lighter) hover:text-(--color-dark)
                                    bg-(--color-light) flex flex-row items-center gap-2 justify-center">
                                        <Menu size={28} />
                                        <p className="text-[18px]">Editar</p>
                                    </div>

                                </div>
                            </div>
                        )) :
                        <div className="p-2 w-full flex flex-col items-center gap-2 mt-6">
                            <Bot size={60} />
                            <h1 className="text-center text-xl">{t("listdt.lost_1")}</h1>
                            <h1 className="text-center text-xl">{t("listdt.lost_2")}</h1>
                        </div>
                    }

                    <button onClick={() => {
                        minimazeAllWindows();
                        newdt.openWindow();
                        dtConfig.setDesktop(null)
                    }} className={`sticky max-w-55 mt-5 bottom-0 left-[50%] bg-(--color-light) translate-x-[-50%]  transition-all cursor-pointer 
            hover:bg-white hover:text-(--color-regular) p-2 px-3 rounded-sm font-medium`}>{t("listdt.create")}</button>
                </div>
            </div>
        </div>
    )
}