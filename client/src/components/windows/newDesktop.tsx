import { X } from "lucide-react"
import { useWindowContext } from "../../context/WindowContext";
import { returnFilterEffects } from "../../types/auth";
import { useUser } from "../../context/AuthContext";
import { useState } from "react";
// import { createDesktop, updateDesktopBackground } from "../../services/desktop";
// import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ClickableImageInput } from "../imageInput";
// import { DesktopType } from "../../types/desktop";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAppContext } from "../../context/AppContext";
import { createDesktopService } from "../../services/desktopServices";
import { CreateDesktopData } from "../../types/desktop";


export default function NewDesktopWindow() {
    const { callToast } = useAppContext();
    const { newdt } = useWindowContext();
    const { user, changeCurrentDesktop } = useUser();
    const [imageSelected, setImageSelected] = useState<File>()
    const [desktopName, setDesktopName] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)


    // VERSAO LANCAMENTO

    // const [desktopType, setDesktopType] = useState<DesktopType>('personal')


    const handleSubmit = async () => {
        if (!imageSelected) return;
        try {

            setLoading(true)
            if (!imageSelected || !user || !desktopName) return;
            const response = await createDesktopService({ name: desktopName, backgroundImage: imageSelected } as CreateDesktopData)


            changeCurrentDesktop(response)

            newdt.closeWindow();

            callToast({ message: 'Novo Desktop criado!', type: 'success' })

        } catch (err) {
            console.log('Erro ao criar: ', err)
        } finally {
            setLoading(false)
        }
    }


    return (
        newdt.currentStatus != 'closed' && <div className={`${newdt.currentStatus === 'open' ? returnFilterEffects() : 'pointer-events-none '} 
        transition-all duration-500 fixed z-100 w-full h-screen flex justify-center items-center p-4 pb-[50px] cursor-pointer`}>
            <div className={`${newdt.currentStatus === 'open' ? 'scale-100' : 'scale-50 opacity-0'} cursor-default bg-(--color-dark) origin-center rounded-md p-4 w-full 
                max-w-[600px] max-h-full flex flex-col gap-4 overflow-y-auto transition-all relative pb-5 `}>
                <X onClick={newdt.closeWindow} size={35} className="absolute top-0 right-0 p-2 rounded-bl-lg cursor-pointer transition-all hover:bg-red-500" />
                <h1 className="text-[24px]">Criar novo Desktop</h1>
                <div className="flex flex-col gap-1 w-full">
                    <p className="text-xl">Nome</p>
                    <input type="text" onChange={(e) => setDesktopName(e.target.value)} className="border-1 border-(--color-light) outline-none transition-all text-[17px] bg-(--color-regular)/50
                             hover:bg-(--color-regular)/70  
                                cursor-pointer focus:cursor-text p-1 px-2.5 rounded-sm focus:border-(--color-light) focus:bg-(--color-light)/40 text-(--color-lighter) focus:text-white w-full" />
                </div>
                <div className="flex flex-col gap-2 w-full items-start max-w-[1000px]">
                    <p className="text-lg">Tela de fundo</p>
                    <ClickableImageInput onFileSelected={(file) => {
                        setImageSelected(file)
                        console.log(imageSelected)
                    }} />
                    {/* {!imageSelected && (
                        <p>(Caso não escolhida, será a padrão)</p>
                    )} */}
                </div>
                {/* <div className="flex flex-col gap-2 w-full items-start max-w-[1000px]">
                    <p className="text-lg">Tipo de Desktop</p>
                    <div className="flex flex-row gap-2 w-full">
                        <div className="flex-1 relative">

                            <button
                                onClick={() => setDesktopType('personal')}
                                className={`${desktopType === 'personal' ? 'bg-(--color-lighter)' : 'hover:bg-white/10'} 
                                peer font-medium border border-(--color-lighter) rounded-md p-2 w-full transition-all cursor-pointer`}
                            >
                                Pessoal
                            </button>

                            <p className="bg-(--color-dark)/30 backdrop-blur-sm rounded-lg p-1 px-2 absolute top-0 left-[50%] mt-[-65px] 
                            translate-x-[-50%] w-[90%] peer-hover:opacity-100 opacity-0 transition-opacity duration-400 text-center">Apenas para você, deixe tudo do seu jeito</p>
                        </div>
                        <div className="flex-1 relative">


                            <button onClick={() => setDesktopType('team')} className={`${desktopType === 'team' ? 'bg-(--color-lighter)' : 'hover:bg-white/10'} 
                              peer font-medium border-1 border-(--color-lighter) rounded-md p-2 w-full transition-all cursor-pointer `}>Equipe</button>

                            <p className="bg-(--color-dark)/30 backdrop-blur-sm rounded-lg p-1 px-2 absolute top-0 left-[50%] mt-[-65px] 
                            translate-x-[-50%] w-[90%] peer-hover:opacity-100 opacity-0 transition-opacity duration-400 text-center">Adicione membros, e compartilhe seus arquivos</p>
                        </div>


                    </div>
                </div> */}
                <button onClick={handleSubmit} disabled={!imageSelected || desktopName === '' || loading} className={`${!imageSelected || desktopName === '' ? 'pointer-events-none saturate-0 opacity-40' : ''}
                    bg-(--color-lighter) border-none text-xl ${loading ? 'saturate-0 pointer-events-none' : 'p-2'} flex justify-center px-6 font-medium cursor-pointer mt-2 rounded-sm transition-all hover:bg-(--color-light)`}>
                    {loading ? <DotLottieReact
                        src="https://lottie.host/e580eaa4-d189-480f-a6ce-f8c788dff90d/MP2FjoJFFE.lottie"
                        className="w-26 p-0"
                        loop
                        autoplay
                    /> : 'Criar Desktop'}
                </button>
            </div>

        </div>
    )
}