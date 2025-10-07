import { ArrowRight, Maximize, Menu, Plus, UserRound, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useUser } from "../../context/AuthContext";
import { useWindowContext } from "../../context/WindowContext";
import { returnFilterEffects } from "../../types/auth";
import { ClickableImageInput } from "../imageInput";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { deleteDesktopById, FullDesktopData, getDesktopById, getDesktopsByMember, updateDesktopBackground } from "../../services/desktop";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";


export default function DesktopConfigWindow() {
    const { user, currentDesktop, changeCurrentDesktop, setHasDesktops } = useUser();
    const { dtConfig } = useWindowContext();
    const [loading, setLoading] = useState<boolean>(false)
    const [currentImage, setCurrentImage] = useState<File | null>(null)
    const [isFullsceen, setIsFullscreen] = useState<boolean>(false)
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
    const [windowDesktop, setWindowDesktop] = useState<FullDesktopData | null>(null)
    const [formattedUserName, setFormattedUserName] = useState<string | null>(null)
    const [formattedDtName, setFormattedDtName] = useState<string | null>(null)
    const [deleteInput, setDeleteInput] = useState<string>('')
    const [value, setValue] = useState('')

    useEffect(() => {
        const desktopId = dtConfig.desktop?.id;

        if (!desktopId) {
            setWindowDesktop(null);
            return;
        };

        const desktopRef = doc(db, "desktops", desktopId);

        const unsubscribe = onSnapshot(desktopRef, (desktop) => {

            if (desktop.exists()) {
                const desktopData = {
                    id: desktop.id,
                    ...desktop.data()
                } as FullDesktopData

                setWindowDesktop(desktopData)
                setValue(desktopData.name)
                const formatUser = (user?.name as string).replace(/ /g, '')
                setFormattedUserName(formatUser)
                const formatDt = (desktopData.name).replace(/ /g, '')
                setFormattedDtName(formatDt)
            }
            else {
                console.log("O documento do desktop não existe mais.");
                setWindowDesktop(null);
            }
        }, (error) => {
            console.error("Erro ao ouvir os desktops:", error);
        });

        return () => {
            console.log("Cancelando o listener do desktop.");
            unsubscribe();
        };

    }, [dtConfig.desktop])

    if (!user) return null;

    const handleAreaClick = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target != e.currentTarget) return;
        dtConfig.closeWindow();
    }


    const handleEditBackground = async () => {
        if (!currentImage || !windowDesktop) return;
        try {
            setLoading(true)
            const localUrl = URL.createObjectURL(currentImage)
            const storage = getStorage();
            const storageRef = ref(storage, `desktops/${windowDesktop.id}/background`);
            const snapshot = await uploadBytes(storageRef, currentImage);
            const downloadURL = await getDownloadURL(snapshot.ref);
            const updatedDesktop = await updateDesktopBackground(windowDesktop.id as string, downloadURL)
            setWindowDesktop(updatedDesktop)

            setCurrentImage(null)

            if (currentDesktop?.id === windowDesktop.id) {
                localStorage.setItem('background', localUrl);
                changeCurrentDesktop({
                    ...windowDesktop,
                    background: localUrl,
                });
            }

        } catch (err) {
            console.log('ERRO AO ATUALIZAR IMAGEM PELAS CONFIGURAÇÕES: ', err)
        } finally {
            setLoading(false)
        }
    }

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


    const deleteDesktopFunction = async () => {
        if (currentDesktop?.id === dtConfig.desktop?.id) {
            const desktops = await getDesktopsByMember(user?.uid as string);
            const filteredDesktops = desktops.filter(desktop => desktop.id !== dtConfig.desktop?.id);
            if (filteredDesktops.length < 1) {
                setHasDesktops(false)
            } else {
                changeCurrentDesktop(desktops[0])
            }
        }
        deleteDesktopById(user.uid as string, dtConfig.desktop?.id as string)
        setConfirmDelete(false)
        dtConfig.closeWindow()
        dtConfig.setDesktop(null)
    }


    return (

        <div onClick={handleAreaClick} className={`${isFullsceen ? 'pb-[40px]' : ' p-2 pb-[50px]'} ${dtConfig.currentStatus === "open" ? returnFilterEffects(user) : 'pointer-events-none'} 
        fixed z-100 flex-1 flex justify-center items-center w-full h-screen transition-all duration-500 cursor-pointer`}>

            <div className={`${confirmDelete ? '' : 'pointer-events-none opacity-0'} transition-all cursor-default fixed top-0 bg-black/70 w-full h-full z-100 flex 
            justify-center items-center p-2 pb-11`}>
                <div className="bg-zinc-950 p-3 w-full max-w-[510px] h-full max-h-[370px] rounded-lg border-1 border-zinc-800 overflow-y-auto flex flex-col gap-1">
                    <p className="text-lg">Atenção! Você está prestes a excluir um desktop </p>
                    <p className="text-xl text-red-500">{windowDesktop?.name}</p>
                    <p className="text-lg mt-4">
                        Esta ação removerá todos os membros do desktop e <b className="font-medium text-red-500">excluirá permanentemente </b>
                        todos os arquivos presentes nele.
                    </p>
                    <p className="text-lg mt-4">Digite <b className="font-medium">{formattedUserName}/{formattedDtName}</b> para seguir com a exclusão.</p>
                    <input onChange={(e) => setDeleteInput(e.target.value)} value={deleteInput} autoCorrect="false" spellCheck={false} autoCapitalize="false" onPaste={(e) => e.preventDefault()} type="text"
                        className="border-1 border-zinc-600 outline-none bg-zinc-900 p-1 px-2 rounded-lg w-full 
                    transition-all hover:bg-zinc-800 focus:bg-zinc-950 focus:border-zinc-400" placeholder="Digite aqui" />
                    <div className="flex flex-row gap-2 mt-4">
                        <button onClick={() => { setConfirmDelete(false); setDeleteInput('') }} className="flex-1 p-1 px-5 text-lg text-zinc-300 border-1
                         border-zinc-300 cursor-pointer transition-all hover:bg-zinc-300/10 hover:text-white rounded-md">
                            Voltar
                        </button>
                        <button onClick={deleteDesktopFunction} className={`${`${formattedUserName}/${formattedDtName}` === deleteInput ? '' : 'pointer-events-none saturate-0 opacity-70'} flex-1 p-1 px-5 text-lg text-red-500 border-1 border-red-500 cursor-pointer transition-all 
                        hover:bg-red-500 hover:text-white rounded-md`}>
                            Excluir Desktop
                        </button>
                    </div>
                    <p className="self-center text-md text-white/60">*Esta ação é irreversível.</p>
                </div>
            </div>


            <div className={`${isFullsceen ? 'max-w-full max-h-full' : 'rounded-lg max-w-[1200px] max-h-[700px]'} ${dtConfig.currentStatus === "open" ? 'scale-100' : 'scale-0 '} 
                bg-zinc-900 cursor-default origin-center relative transition-all duration-300 flex flex-col w-full h-full overflow-y-auto`}>
                <div className="z-50 sticky select-none top-0 w-full bg-black/60 h-8 flex flex-row justify-between items-center backdrop-blur-[6px]">
                    <p className="p-2">Configurar Desktop</p>
                    <div className="flex flex-row h-full">
                        <Maximize onClick={() => setIsFullscreen(!isFullsceen)} className="transition-colors cursor-pointer p-1 px-2 w-9 h-full hover:bg-white/20" />
                        <X onClick={dtConfig.closeWindow} className="transition-colors cursor-pointer p-1 px-2 w-9 h-full hover:bg-red-500" />
                    </div>
                </div>

                <div className="absolute w-full top-0 h-[450px] z-1 bg-cover bg-center" style={{ backgroundImage: `url(${windowDesktop?.background})` }} />
                <div className="absolute w-full h-[450px] z-2 bg-gradient-to-b from-zinc-900/40 to-zinc-900" />
                <div className="absolute w-full top-0 h-[450px] z-0 flex justify-center items-center">
                    <DotLottieReact
                        src="https://lottie.host/e580eaa4-d189-480f-a6ce-f8c788dff90d/MP2FjoJFFE.lottie"
                        className="w-20 p-0"
                        loop
                        autoplay
                    />
                </div>

                {currentDesktop?.id === windowDesktop?.id ? (
                    <p className="z-10 m-5 mb-[-55px] p-1 px-3 self-start border-1 border-blue-500 bg-blue-950/50 backdrop-blur-sm rounded-full">Desktop atual</p>
                ) : (
                    <p onClick={() => handleChangeDesktop(windowDesktop?.id as string)} className="z-10 m-5 mb-[-55px] p-1 px-3 self-start border-1 
                    border-white/80 bg-zinc-200/5 hover:border-blue-500 hover:bg-blue-950/50 transition-all
                    hover:text-blue-500 backdrop-blur-sm rounded-full flex flex-row gap-1 items-center group cursor-pointer">Abrir Desktop  <ArrowRight size={20} className="opacity-0 
                    max-w-0 transition-all group-hover:opacity-100 group-hover:max-w-5"/></p>
                )}

                <div className="flex flex-col gap-2 p-4 mt-[80px] z-3">
                    <div className="flex flex-row justify-between gap-2 p-4 items-center flex-wrap">
                        <div className="flex flex-col gap-1 items-start">
                            <p className="text-[15px] opacity-80">Criado em {windowDesktop?.createdAt?.toDate().toLocaleDateString('pt-BR')}</p>
                            <h1 className="text-[38px] mt-[-10px]">{windowDesktop?.name}</h1>
                            <p className="text-[18px]">Desktop {windowDesktop?.type}</p>
                            <p className="p-1 px-3 mt-5 bg-zinc-950/50 border-1 border-zinc-600 rounded-full">{windowDesktop?.members.length}
                                {windowDesktop?.members.length && windowDesktop?.members.length > 1 ? ' Membros' : ' Membro'}</p>
                        </div>
                        <div className="p-2 flex flex-col bg-zinc-900 border-1 border-zinc-800 rounded-lg w-full max-w-[300px]">
                            <p>Espaço Ocupado</p>
                            <h1 className="text-[30px]">178 mb</h1>
                        </div>
                    </div>
                    <div className="flex flex-row gap-6 p-2 mt-[80px] items-start">

                        <div className="flex flex-col w-full items-start gap-4">
                            <h1 className="text-2xl">Informações</h1>

                            <div className="flex flex-col gap-1 w-full">
                                <p>Nome do Desktop</p>
                                <input value={value} onChange={(e) => {
                                    setValue(e.target.value)
                                }} type="text" className="border-1 border-zinc-800 border-b-white/70  outline-none transition-all text-lg hover:bg-zinc-800  
                                cursor-pointer focus:cursor-text p-0.5 px-1 rounded-t-sm focus:border-blue-500 focus:text-blue-100 w-full max-w-[300px]" />
                            </div>


                            <button className="p-1 px-5 text-lg text-blue-500 border-1 border-blue-500 cursor-pointer transition-all hover:bg-blue-500 hover:text-white rounded-md">
                                Salvar Alterações
                            </button>

                            <div className="w-[100%] h-[1px] mt-1 bg-zinc-400/50"></div>

                            <h1 className="text-2xl">Tela de Fundo</h1>
                            <p className="text-md mt-[-12px] mb-1">Imagem exibida no fundo do Desktop atual.</p>

                            {currentImage && !loading && (<p className="mb-[-5px] p-1 px-2 bg-white/10 rounded-lg">Prévia</p>)}

                            <div className={`${loading ? 'saturate-0 pointer-events-none opacity-50 scale-90' : ''} origin-left flex flex-col transition-all w-full`}>
                                <ClickableImageInput onFileSelected={(file) => {
                                    setCurrentImage(file)
                                }} />
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
            hover:bg-blue-500 p-2 px-3 rounded-sm font-medium`}>Salvar fundo</button>
                            )}

                            <div className="w-[100%] h-[1px] mb-1 bg-zinc-400/50"></div>

                            <div className="bg-zinc-950/50 p-4 gap-3 flex flex-col w-full max-w-[400px] rounded-lg items-start border-1 border-zinc-800">
                                <h1 className="text-2xl">Zona de risco</h1>

                                <button onClick={() => setConfirmDelete(true)} className="p-1 px-5 text-lg text-red-500 border-1 border-red-500 cursor-pointer transition-all
                                hover:bg-red-500 hover:text-white rounded-md">
                                    Excluir Desktop
                                </button>
                            </div>


                        </div>


                        <div className="flex flex-col w-full max-w-[500px] p-4 rounded-xl gap-3 bg-zinc-950/70">
                            <div className="flex flex-row justify-between gap-2 items-center">
                                <p className="text-xl">Membros</p>
                                <Plus size={35} className="p-1 rounded-full hover:bg-zinc-800 cursor-pointer transition-all" />
                            </div>

                            <div className="w-[100%] h-[1px] bg-zinc-400/40" />

                            <div className="flex flex-col w-full gap-3 mt-3 max-h-[570px] overflow-y-auto">
                                {windowDesktop?.members.map((member) =>
                                    <div key={member.userId} className="flex flex-row w-full justify-between items-center bg-zinc-900 
                                    p-3 px-3 rounded-md group hover:bg-zinc-800/70 transition-all select-none">
                                        <div className="flex flex-row gap-2 items-center">
                                            <img src={`${member.userImage}`} className={`
                                                ${member.role === 'owner' && 'shadow-[0px_0px_10px_5px] shadow-blue-500/30 border-2 border-blue-400'} 
                                                rounded-full w-12 h-12`} />
                                            <div className="flex flex-col">
                                                <p className="text-lg flex gap-1 items-end">{member.userName} {member.userId === user.uid && (
                                                    <p className="text-[15px] opacity-60 mb-0.5">(você)</p>)}</p>
                                                <p className="text-md opacity-80 mt-[-5px]">{member.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row gap-3">
                                            <Menu className="cursor-pointer transition-all opacity-0 scale-75 group-hover:scale-100 group-hover:opacity-100 hover:bg-blue-500/15 
                                        hover:border-blue-500 hover:text-blue-500 w-9 h-9 p-1 bg-white/5 border border-white/40 rounded-md" />
                                            <UserRound className="cursor-pointer transition-all opacity-0 scale-75 group-hover:scale-100 group-hover:opacity-100 hover:bg-blue-500/15 
                                        hover:border-blue-500 hover:text-blue-500 w-9 h-9 p-1 bg-white/5 border border-white/40 rounded-md" />
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>



                </div>
            </div>
        </div>
    )
}