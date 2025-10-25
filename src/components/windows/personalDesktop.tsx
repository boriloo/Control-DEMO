import { useState } from "react"
import { ClickableImageInput } from "../imageInput";
import { createDesktop, updateDesktopBackground } from "../../services/desktop";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { useUser } from "../../context/AuthContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { LogOut } from "lucide-react";

interface PersonalProps {
    onFinish: (boolean: true) => void;
}


export default function PersonalDesktopWindow({ onFinish }: PersonalProps) {
    const { user, changeCurrentDesktop, authLogoutUser } = useUser();
    const [imageSelected, setImageSelected] = useState<File>()
    const [desktopName, setDesktopName] = useState<string | null>()
    const [loading, setLoading] = useState<boolean>(false)
    const [done, setDone] = useState<boolean>(false)
    const [done2, setDone2] = useState<boolean>(false)
    const [percentage, setPercentage] = useState<number>(0)

    const handleSubmit = async () => {
        if (!imageSelected) return;
        try {
            const localUrl = URL.createObjectURL(imageSelected)
            setLoading(true)
            if (!imageSelected || !user || !desktopName) return;
            const newDesktop = await createDesktop({
                name: desktopName,
                type: 'personal',
                ownerId: user.uid as string,
                members: [{
                    userId: user.uid as string,
                    userName: user.name as string,
                    userImage: user.profileImage as string,
                    role: 'owner'
                }],
                membersId: [user.uid as string]
            })
            setPercentage(prev => (prev + 16.66))

            const storage = getStorage();
            setPercentage(prev => (prev + 16.66))

            const storageRef = ref(storage, `desktops/${newDesktop.id}/background`);
            setPercentage(prev => (prev + 16.66))

            const snapshot = await uploadBytes(storageRef, imageSelected);
            setPercentage(prev => (prev + 16.66))

            const downloadURL = await getDownloadURL(snapshot.ref);
            setPercentage(prev => (prev + 16.66))

            const updatedDesktop = await updateDesktopBackground(newDesktop.id, downloadURL)

            localStorage.setItem('background', localUrl);

            changeCurrentDesktop(updatedDesktop)
            setPercentage(prev => (prev + 18.66))
            setTimeout(() => {
                setDone(true)
                setTimeout(() => {
                    setDone2(true)
                    setTimeout(() => {
                        onFinish(true)
                    }, 1000)
                }, 2000)
            }, 1000)
        } catch (err) {
            console.log('Erro ao criar: ', err)
            setLoading(false)
        }
    }


    return (
        <div
            className={`${done2 ? '' : 'bg-zinc-900'} absolute z-200  w-full min-h-screen flex justify-center items-center p-8`}>
            <div className={`${done2 ? 'opacity-0 pointer-events-none' : done ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-all duration-500 
            absolute z-200 bg-zinc-900 w-full min-h-screen flex justify-center items-center p-4`}>
                <h1 className={`${done ? 'opacity-100 mt-0' : 'opacity-0 mt-7'} transition-all duration-700 text-[40px] text-center`}>Tudo pronto. <br /> Aproveite :)</h1>
            </div>
            {loading ?
                (<div className={`${done2 ? 'opacity-0' : ''} flex flex-col gap-2 items-center w-full max-w-[600px]`}>
                    <DotLottieReact
                        src="https://lottie.host/e580eaa4-d189-480f-a6ce-f8c788dff90d/MP2FjoJFFE.lottie"
                        className="w-26 p-0"
                        loop
                        autoplay
                    />
                    <h1 className="text-[30px] text-center">Seu desktop está sendo feito...</h1>
                    <div className="mt-2 w-full h-6 bg-zinc-300 rounded-md overflow-hidden relative">
                        <div style={{ width: `${percentage}%` }} className={`absolute h-full transition-all duration-150 bg-blue-500`}>
                        </div>
                    </div>
                </div>)
                :
                (<div className="flex flex-col items-start w-full max-w-[1000px] gap-8">
                    <div className="flex flex-row items-center gap-3">
                        <img src={`${user?.profileImage || "/assets/images/profile.png"}`} className="rounded-full w-11 h-11" />
                        <div className="flex flex-col justify-center">
                            <h1 className="text-[18px]">{user?.name as string}</h1>
                            <h1 className="text-[16px] opacity-80">{user?.email as string}</h1>
                        </div>
                        <button onClick={authLogoutUser} className="flex flex-row gap-2 items-center ml-1 mt-1 text-[18px] 
                                    p-2 border-[1.5px] border-white/50 cursor-pointer rounded-md bg-zinc-950/50 text-white transition-all hover:border-red-500 hover:text-red-500">
                            <LogOut size={18} />
                        </button>
                    </div>

                    <h1 className="text-[55px] gap-1">Crie seu primeiro <p className="text-blue-500">Desktop</p></h1>
                    <div className="flex flex-col gap-1 w-full">
                        <p className="text-xl">Nome</p>
                        <input type="text" onChange={(e) => setDesktopName(e.target.value)} className="outline-none transition-all text-lg hover:bg-zinc-800 border-b-1 
                    cursor-pointer focus:cursor-text p-1 px-2 rounded-t-sm focus:border-blue-500 focus:text-blue-100 border-white/50 w-full max-w-[500px]" />
                    </div>
                    <div className="flex flex-col gap-2 w-full max-w-[1000px]">
                        <p className="text-lg">Tela de fundo</p>
                        <ClickableImageInput onFileSelected={(file) => {
                            setImageSelected(file)
                            console.log(imageSelected)
                        }} />
                    </div>

                    <button onClick={handleSubmit} disabled={!imageSelected || !desktopName} className={`${!imageSelected || !desktopName ? 'pointer-events-none saturate-0 opacity-40' : ''}
                    bg-blue-500 border-none text-xl p-2 px-6 font-medium cursor-pointer rounded-sm transition-all hover:bg-blue-600`}>
                        Criar Desktop
                    </button>
                </div>)}

        </div >
    )
}


