import { useEffect, useState } from "react"
import { useUser } from "../../../context/AuthContext"
import { ClickableImageInput } from "../../imageInput"
import { updateDesktopBackground } from "../../../services/desktop"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { BasicFilter, ColorFilter } from "../../../types/auth"

export default function AppearanceOption() {

    const { user, currentDesktop, changeCurrentDesktop, hasDesktops, authChangeUserFilters } = useUser()
    const [currentImage, setCurrentImage] = useState<File | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [darkFilter, setDarkFilter] = useState<BasicFilter>('low')
    const [blurFilter, setBlurFilter] = useState<BasicFilter>('low')
    const [colorFilter, setColorFilter] = useState<ColorFilter>('color')

    useEffect(() => {
        if (!user) return;
        setDarkFilter(user.filterDark as BasicFilter)
        setBlurFilter(user.filterBlur as BasicFilter)
        setColorFilter(user.filterColor as ColorFilter)
    }, [user])


    if (!currentDesktop) return;

    const handleEditBackground = async () => {
        if (!currentImage || !currentDesktop) return;
        try {
            setLoading(true)
            const localUrl = URL.createObjectURL(currentImage)
            const storage = getStorage();
            const storageRef = ref(storage, `desktops/${currentDesktop.id}/background`);
            const snapshot = await uploadBytes(storageRef, currentImage);
            const downloadURL = await getDownloadURL(snapshot.ref);
            await updateDesktopBackground(currentDesktop.id, downloadURL)

            changeCurrentDesktop({
                ...currentDesktop,
                background: localUrl,
            });
            setLoading(false)
            setCurrentImage(null)
            localStorage.setItem('background', localUrl);
            console.log('DESTKOP ATUAL ', currentDesktop)
        } catch (err) {
            setLoading(false)
            console.log('ERRO AO ATUALIZAR IMAGEM PELAS CONFIGURAÇÕES: ', err)
        }
    }

    const handleEditFilters = async () => {
        if (!currentDesktop) return;
        try {
            setLoading(true)
            await authChangeUserFilters(darkFilter, blurFilter, colorFilter)
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.log('ERRO AO ATUALIZAR IMAGEM PELAS CONFIGURAÇÕES: ', err)
        }
    }


    return (
        <div className="flex flex-col items-start gap-4 p-4 w-full">
            {hasDesktops && (<h1 className="text-[25px] flex">Desktop atual - {currentDesktop.name} ({currentDesktop.type})</h1>)}
            <div className="w-full h-[1px] bg-zinc-600"></div>
            
            <div className="flex flex-col gap-4 px-2 items-start">
                <p className="text-xl mt-2">Filtros</p>
                <p className="text-md mt-[-12px] mb-1">Efeitos aplicados ao fundo quando uma janela é aberta.</p>


                <div className="flex flex-col gap-1">
                    <p className="text-lg">Filtro escuro</p>
                    <div className="flex flex-row gap-4">
                        <div onClick={() => setDarkFilter('off')} className={`flex flex-row gap-2 items-center transition-all p-2 cursor-pointer hover:bg-zinc-800 rounded-md`}>
                            <div className={`${darkFilter === 'off' ? 'bg-blue-500 border-blue-500' : ''} transition-all w-5 h-5 border-1 rounded-full`}></div>
                            <p>Desativado</p>
                        </div>
                        <div onClick={() => setDarkFilter("low")} className={`flex flex-row gap-2 items-center transition-all p-2 cursor-pointer hover:bg-zinc-800 rounded-md`}>
                            <div className={`${darkFilter === "low" ? 'bg-blue-500 border-blue-500' : ''} transition-all w-5 h-5 border-1 rounded-full`}></div>
                            <p>Pouco</p>
                        </div>
                        <div onClick={() => setDarkFilter("high")} className={`flex flex-row gap-2 items-center transition-all p-2 cursor-pointer hover:bg-zinc-800 rounded-md`}>
                            <div className={`${darkFilter === "high" ? 'bg-blue-500 border-blue-500' : ''} transition-all w-5 h-5 border-1 rounded-full`}></div>
                            <p>Muito</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-lg">Desfoque</p>
                    <div className="flex flex-row gap-4">
                        <div onClick={() => setBlurFilter('off')} className={`flex flex-row gap-2 items-center transition-all p-2 cursor-pointer hover:bg-zinc-800 rounded-md`}>
                            <div className={`${blurFilter === 'off' ? 'bg-blue-500 border-blue-500' : ''} transition-all w-5 h-5 border-1 rounded-full`}></div>
                            <p>Desativado</p>
                        </div>
                        <div onClick={() => setBlurFilter("low")} className={`flex flex-row gap-2 items-center transition-all p-2 cursor-pointer hover:bg-zinc-800 rounded-md`}>
                            <div className={`${blurFilter === "low" ? 'bg-blue-500 border-blue-500' : ''} transition-all w-5 h-5 border-1 rounded-full`}></div>
                            <p>Pouco</p>
                        </div>
                        <div onClick={() => setBlurFilter("high")} className={`flex flex-row gap-2 items-center transition-all p-2 cursor-pointer hover:bg-zinc-800 rounded-md`}>
                            <div className={`${blurFilter === "high" ? 'bg-blue-500 border-blue-500' : ''} transition-all w-5 h-5 border-1 rounded-full`}></div>
                            <p>Muito</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-lg">Saturação</p>
                    <div className="flex flex-row gap-4">
                        <div onClick={() => setColorFilter("color")} className={`flex flex-row gap-2 items-center transition-all p-2 cursor-pointer hover:bg-zinc-800 rounded-md`}>
                            <div className={`${colorFilter === "color" ? 'bg-blue-500 border-blue-500' : ''} transition-all w-5 h-5 border-1 rounded-full`}></div>
                            <p>Cor</p>
                        </div>
                        <div onClick={() => setColorFilter("gray")} className={`flex flex-row gap-2 items-center transition-all p-2 cursor-pointer hover:bg-zinc-800 rounded-md`}>
                            <div className={`${colorFilter === "gray" ? 'bg-blue-500 border-blue-500' : ''} transition-all w-5 h-5 border-1 rounded-full`}></div>
                            <p>Preto e Branco</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className={`
            p-0.5 px-3 rounded-sm font-medium`}>
                        <DotLottieReact
                            src="https://lottie.host/e580eaa4-d189-480f-a6ce-f8c788dff90d/MP2FjoJFFE.lottie"
                            className="w-20 p-0"
                            loop
                            autoplay
                        />
                    </div>
                ) : (
                    <button disabled={loading} onClick={handleEditFilters} className={`border-1 border-blue-500 transition-all cursor-pointer 
            hover:bg-blue-500 p-2 px-3 rounded-sm font-medium`}>Salvar filtros</button>
                )}
            </div>

        </div >
    )
}