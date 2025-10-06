import { useEffect, useState } from "react"
import { useUser } from "../../../context/AuthContext"
import { ClickableImageInput } from "../../imageInput"
import { updateDesktopBackground } from "../../../services/desktop"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { BasicFilter, ColorFilter } from "../../../types/auth"
import { AvatarImageInput } from "../../avatarInput"
import { updateUserProfileImage } from "../../../services/auth"

export default function AccountOption() {

    const { user, currentDesktop, authChangeUserFilters, authChangeUserAvatar } = useUser()
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
            const storage = getStorage();
            const storageRef = ref(storage, `users/${user?.uid}/avatar`);
            const snapshot = await uploadBytes(storageRef, currentImage);
            const downloadURL = await getDownloadURL(snapshot.ref);
            await authChangeUserAvatar(downloadURL)

            setLoading(false)
            setCurrentImage(null)

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
            <h1 className="text-[25px] flex">Sua Conta</h1>
            <div className="w-full h-[1px] bg-zinc-600"></div>
            <p className="text-xl">Avatar</p>

            <AvatarImageInput onFileSelected={(file) => {
                setCurrentImage(file)
            }} />
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
                <button disabled={!currentImage} onClick={handleEditBackground} className={`${currentImage ? '' : 'pointer-events-none saturate-0 opacity-50'} border-1 border-blue-500 transition-all cursor-pointer 
            hover:bg-blue-500 p-2 px-3 rounded-sm font-medium`}>Aplicar avatar</button>
            )}
            <div className="w-full h-[1px] bg-zinc-600 mt-4"></div>
        </div>
    )
}