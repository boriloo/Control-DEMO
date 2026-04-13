import { useEffect, useState } from "react"
import { useUser } from "../../../context/AuthContext"
// import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { AvatarImageInput } from "../../avatarInput"
import { useAppContext } from "../../../context/AppContext"
import { deleteUserService, updateUserService } from "../../../services/userServices"
import { updateUserData } from "../../../types/auth"

export default function AccountOption() {
    const { callToast } = useAppContext();
    const { user, currentDesktop, changeUser, authLogoutUser } = useUser()
    const [currentImage, setCurrentImage] = useState<File | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [username, setUsername] = useState<string>('')
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
    const [formattedUserName, setFormattedUserName] = useState<string | null>(null)
    const [deleteInput, setDeleteInput] = useState<string>('')

    useEffect(() => {
        if (!user?.name || !user) return;
        setUsername(user.name as string)
        setFormattedUserName((user?.name as string).replace(/ /g, ''))
    }, [user])


    if (!currentDesktop) return;

    const handleEditBackground = async () => {
        if (!currentImage && !username) return;
        try {
            setLoading(true)
            const pictureForReq = currentImage ? currentImage : undefined
            const updatedUser = await updateUserService({ name: username, profileImage: pictureForReq } as updateUserData)

            changeUser(updatedUser);
            setCurrentImage(null)
            callToast({ message: 'Avatar alterado com sucesso!', type: 'success' })
        } catch (err) {
            console.log('ERRO AO ATUALIZAR IMAGEM PELAS CONFIGURAÇÕES: ', err)
        } finally {
            setLoading(false)
        }
    }

    const deleteUserFunction = async () => {
        if (!user) return

        try {
            await deleteUserService()

            setDeleteInput('')
            setConfirmDelete(false);
            await authLogoutUser()

        } catch (err) {
            console.error("Erro ao excluir usuario:", err);
            callToast({ message: 'Erro ao excluir usuario.', type: 'error' });
        }
    }



    return (
        <div className="flex flex-col items-start gap-4 p-6 py-5 w-full">
            <div className={`${confirmDelete ? '' : 'pointer-events-none opacity-0'} transition-all cursor-default fixed left-0 top-0 bg-black/70 w-full h-full z-100 flex 
            justify-center items-center p-2 `}>
                <div className="bg-zinc-950 p-3 w-full max-w-[510px] h-full max-h-[320px] rounded-lg border-1 border-zinc-800 overflow-y-auto flex flex-col gap-1">
                    <p className="text-lg">Atenção! Você está prestes a excluir esta conta. </p>
                    <p className="text-lg mt-4">
                        Esta ação <b className="font-medium text-red-500">excluirá permanentemente </b>
                        todos desktops e arquivos pertencentes a esta conta.
                    </p>
                    <p className="text-lg mt-4">Digite <b className="font-medium">{formattedUserName}/delete</b> para seguir com a exclusão.</p>
                    <input onChange={(e) => setDeleteInput(e.target.value)} value={deleteInput} autoCorrect="false" spellCheck={false} autoCapitalize="false" onPaste={(e) => e.preventDefault()} type="text"
                        className="border-1 border-white/20 outline-none bg-zinc-900 p-1 px-2 rounded-lg w-full 
                    transition-all hover:bg-zinc-800 focus:bg-zinc-950 focus:border-zinc-400" placeholder="Digite aqui" />
                    <div className="flex flex-row gap-2 mt-4">
                        <button onClick={() => { setConfirmDelete(false); setDeleteInput('') }} className="flex-1 p-1 px-5 text-lg text-zinc-300 border-1
                         border-zinc-300 cursor-pointer transition-all hover:bg-zinc-300/10 hover:text-white rounded-md">
                            Voltar
                        </button>
                        <button disabled={`${formattedUserName}/delete` != deleteInput} onClick={deleteUserFunction} className={`${`${formattedUserName}/delete` === deleteInput ? '' : 'pointer-events-none saturate-0 opacity-70'} 
                        flex-1 p-1 px-5 text-lg text-red-500 border-1 border-red-500 cursor-pointer transition-all 
                        hover:bg-red-500 hover:text-white rounded-md`}>
                            Excluir Conta
                        </button>
                    </div>
                    <p className="self-center text-md text-white/60">*Esta ação é irreversível.</p>
                </div>
            </div>

            <h1 className="text-[25px] flex">Sua Conta</h1>
            <p className="text-md mt-[-12px] mb-1">Dados pessoais e segurança.</p>
            <div className="w-full h-[1px] bg-white/40 mt-[-10px]"></div>

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
                        }} type="text" className="border-1 border-(--color-light) outline-none transition-all text-[17px] bg-(--color-regular)/50
                             hover:bg-(--color-regular)/70  
                                cursor-pointer focus:cursor-text p-1 px-2.5 rounded-sm focus:border-(--color-light) focus:bg-(--color-light)/40 text-(--color-lighter) focus:text-white w-full" />
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
                <button disabled={(!currentImage && !username)} onClick={handleEditBackground} className={`${(currentImage || username) ? '' : 'pointer-events-none saturate-0 opacity-50'} border-1 
                border-(--color-lighter) transition-all cursor-pointer 
            hover:bg-(--color-lighter) p-2 px-4 rounded-sm font-medium`}>Salvar alterações</button>
            )}

            <div className="w-full h-[1px] bg-white/40 mt-4"></div>

            <div className="bg-zinc-950/50 p-4 gap-3 flex flex-col w-full max-w-[400px] rounded-lg items-start border-1 border-(--color-regular)">
                <h1 className="text-2xl">Zona de risco</h1>

                <button onClick={() => setConfirmDelete(true)} className="p-1 px-5 text-lg text-red-500 border-1 border-red-500 cursor-pointer transition-all
                                hover:bg-red-500 hover:text-white rounded-md">
                    Excluir Conta
                </button>
            </div>



        </div>
    )
}