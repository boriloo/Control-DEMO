import { Bot, ExternalLink, Menu, X } from "lucide-react"
import { useWindowContext } from "../../context/WindowContext";
import { returnFilterEffects } from "../../types/auth";
import { useUser } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";
import { useEffect, useState } from "react";
import { getDesktopById, getDesktopsByMember } from "../../services/desktop";
import { useTranslation } from "react-i18next";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";



export default function ListDesktopsWindow() {
    const { t } = useTranslation();
    const { user, currentDesktop, changeCurrentDesktop } = useUser();
    const { minimazeAllWindows } = useAppContext();
    const { listdt, newdt, dtConfig } = useWindowContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [allDesktops, setAllDesktops] = useState<any[]>([]);

    const handleAreaClick = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target != e.currentTarget) return;
        listdt.minimizeWindow();
    }

    useEffect(() => {
        if (!user) {
            setAllDesktops([]);
            return;
        };

        const q = query(collection(db, "desktops"), where("members", "array-contains", user.uid));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const desktopsFromDb = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const otherDesktops = desktopsFromDb.filter(desktop => desktop.id !== currentDesktop?.id);
            setAllDesktops(otherDesktops);
        }, (error) => {
            console.error("Erro ao ouvir os desktops:", error);
        });

        return () => unsubscribe();

    }, [user, currentDesktop?.id]);

    const handleChangeDesktop = async (id: string) => {
        setLoading(true)
        try {
            const newDesktop = await getDesktopById(id)
            changeCurrentDesktop(newDesktop)
            localStorage.setItem('last-desktop', id);
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
            <div className={`${listdt.currentStatus === 'open' ? 'scale-100' : 'scale-0'} cursor-default bg-zinc-900 origin-center rounded-md p-4 w-full 
                max-w-[700px] max-h-full flex flex-col gap-4 overflow-y-auto transition-all relative pb-10 `}>
                <X onClick={listdt.minimizeWindow} size={35} className="absolute top-0 right-0 p-2 rounded-bl-lg cursor-pointer transition-all hover:bg-red-500" />
                <h1 className="text-[24px]">{t("listdt.title")}</h1>
                <div className={`${loading ? 'opacity-20 saturate-0 pointer-events-none' : ''} transition-all flex flex-col gap-2 w-full max-h-[500px] overflow-y-auto`}>
                    <p className="text-lg">{t("listdt.current")}</p>
                    <div className="group flex flex-row w-full p-3 justify-between items-center rounded-sm border-1 border-blue-500 transition-all hover:bg-zinc-950">
                        <h1 className="text-lg">
                            {currentDesktop?.name} {''}
                            ({currentDesktop?.type})
                        </h1>
                        <div className="flex flex-row gap-2 items-center">
                            <p className="transition-all opacity-0 group-hover:opacity-100 mr-[-5px] group-hover:mr-1">
                                {currentDesktop?.members.length} {''}
                                {currentDesktop?.members.length && currentDesktop?.members.length > 1 ? t("listdt.members") : t("listdt.member")}
                            </p>
                            <Menu onClick={() => {
                                minimazeAllWindows()
                                dtConfig.openWindow()
                                dtConfig.setDesktop(currentDesktop)
                            }} className="cursor-pointer transition-all opacity-0 group-hover:opacity-100 hover:bg-blue-500/15 hover:border-blue-500 
                            hover:text-blue-500 w-9 h-9 p-1 bg-white/5 border-1 border-white/40 rounded-md" />
                        </div>
                    </div>
                    <p className="text-lg mt-2">{t("listdt.others")}</p>
                    {allDesktops.length >= 1 ?
                        allDesktops.map((desktop) => (
                            <div key={desktop.id} className="group flex flex-row w-full p-3 justify-between items-center rounded-sm border border-white/30 transition-all hover:bg-zinc-950">
                                <h1 className="text-lg">
                                    {desktop.name} ({desktop.type})
                                </h1>
                                <div className="flex flex-row gap-2 items-center">
                                    <p className="transition-all opacity-0 group-hover:opacity-100 mr-[-5px] group-hover:mr-1">
                                        {desktop.members.length} {desktop.members.length > 1 ? t("listdt.members") : t("listdt.member")}
                                    </p>
                                    <Menu onClick={() => {
                                        minimazeAllWindows()
                                        dtConfig.openWindow()
                                        dtConfig.setDesktop(desktop)
                                    }} className="cursor-pointer transition-all opacity-0 group-hover:opacity-100 hover:bg-blue-500/15 hover:border-blue-500 hover:text-blue-500 w-9 h-9 p-1 bg-white/5 border border-white/40 rounded-md" />
                                    <ExternalLink onClick={() => handleChangeDesktop(desktop.id)} className="cursor-pointer transition-all opacity-0 group-hover:opacity-100 hover:bg-blue-500/15 hover:border-blue-500 hover:text-blue-500 w-9 h-9 p-1 bg-white/5 border border-white/40 rounded-md" />
                                </div>
                            </div>
                        )) :
                        <div className="p-2 w-full flex flex-col items-center gap-2">
                            <Bot size={60} />
                            <h1 className="text-center text-xl">{t("listdt.lost_1")}</h1>
                            <h1 className="text-center text-xl">{t("listdt.lost_2")}</h1>
                        </div>
                    }

                    <button onClick={() => {
                        minimazeAllWindows();
                        newdt.openWindow();
                        dtConfig.setDesktop(null)
                    }} className={`sticky max-w-55 mt-5 bottom-0 left-[50%] bg-zinc-900 translate-x-[-50%] border-1 border-blue-500 transition-all cursor-pointer 
            hover:bg-blue-500 p-2 px-3 rounded-sm font-medium`}>{t("listdt.create")}</button>
                </div>
            </div>
        </div>
    )
}