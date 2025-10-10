import { useState } from "react"
import { useUser } from "../../../context/AuthContext"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { AvatarImageInput } from "../../avatarInput"
import { useAppContext } from "../../../context/AppContext"

export default function AccountOption() {
    const { callToast } = useAppContext();
    const { user, currentDesktop, authChangeUserAvatar } = useUser()
    const [currentImage, setCurrentImage] = useState<File | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

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

            setCurrentImage(null)
            callToast({ message: 'Avatar alterado com sucesso!', type: 'success' })
        } catch (err) {
            console.log('ERRO AO ATUALIZAR IMAGEM PELAS CONFIGURAÇÕES: ', err)
        } finally {
            setLoading(false)
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