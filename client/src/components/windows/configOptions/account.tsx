import { useEffect, useState } from "react"
import { useUser } from "../../../context/AuthContext"
// import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { AvatarImageInput } from "../../avatarInput"
import { useAppContext } from "../../../context/AppContext"

export default function AccountOption() {
    const { callToast } = useAppContext();
    const { user, currentDesktop, authChangeUserAvatar, authChangeUserName } = useUser()
    const [currentImage, setCurrentImage] = useState<File | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [username, setUsername] = useState<string>('')

    useEffect(() => {
        if (!user?.name || !user) return;
        setUsername(user.name as string)
    }, [user])


    if (!currentDesktop) return;

    const handleEditBackground = async () => {
        if (!currentImage || !currentDesktop) return;
        try {
            setLoading(true)
            // const storage = getStorage();
            // const storageRef = ref(storage, `users/${user?.uid}/avatar`);
            // const snapshot = await uploadBytes(storageRef, currentImage);
            // const downloadURL = await getDownloadURL(snapshot.ref);
            // await authChangeUserAvatar(downloadURL)

            setCurrentImage(null)
            callToast({ message: 'Avatar alterado com sucesso!', type: 'success' })
        } catch (err) {
            console.log('ERRO AO ATUALIZAR IMAGEM PELAS CONFIGURAÇÕES: ', err)
        } finally {
            setLoading(false)
        }
    }

    const handleEditUsername = async () => {
        if (!username) return;
        try {
            setLoading(true)
            await authChangeUserName(username)
            callToast({ message: 'Nome alterado com sucesso!', type: 'success' })
        } catch (err) {
            console.log('ERRO AO ATUALIZAR NOME PELAS CONFIGURAÇÕES: ', err)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="flex flex-col items-start gap-4 p-6 py-5 w-full">
            <h1 className="text-[25px] flex">Sua Conta</h1>
            <p className="text-md mt-[-12px] mb-1">Dados pessoais e segurança.</p>
            <div className="w-full h-[1px] bg-zinc-600 mt-[-10px]"></div>

            <div className="w-full flex flex-col gap-1 px-2">
                <p className="text-xl mt-2">Perfil</p>
                <p className="text-md mb-1">Suas informações exibidas a outros usuários.</p>
                <div className="flex flex-row gap-3 py-3 rounded-xl w-full">
                    <div className={`${loading ? 'pointer-events-none saturate-0 opacity-60 scale-80' : ''} origin-center flex justify-center transition-all w-25`}>
                        <AvatarImageInput onFileSelected={(file) => {
                            setCurrentImage(file)
                        }} />
                    </div>
                    <div className="flex flex-col gap-2 p-3 shadow-md">
                        <p className="text-md">Nome de exibição</p>
                        <input value={username} onChange={(e) => {
                            setUsername(e.target.value)
                        }} type="text" className="border-1 border-zinc-600 outline-none transition-all text-lg bg-zinc-800 hover:bg-zinc-700/60  
                                cursor-pointer focus:cursor-text p-0.5 px-1.5 rounded-sm focus:border-blue-500 focus:text-blue-100 w-full max-w-[300px]" />
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
                <button disabled={!currentImage} onClick={handleEditBackground} className={`${currentImage ? '' : 'pointer-events-none saturate-0 opacity-50'} border-1 border-blue-500 transition-all cursor-pointer 
            hover:bg-blue-500 p-2 px-4 rounded-sm font-medium`}>Salvar alterações</button>
            )}
            <div className="w-full h-[1px] bg-zinc-600 mt-4"></div>



           
        </div>
    )
}