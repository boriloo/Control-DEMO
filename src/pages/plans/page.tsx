import { CircleCheckBig } from "lucide-react";
import { useState } from "react";
import { useUser } from "../../context/AuthContext";

type Plan = "free" | "premium" | "pro"

export default function PlansPage() {
    const { user } = useUser();
    const [planType, setPlanType] = useState<Plan>("free")

    return (
        <div className="bg-zinc-950 w-full min-h-screen p-4 flex flex-col items-center overflow-w-hidden">
            <div className="flex flex-col w-full items-center gap-4 pt-12">
                <div className="w-full p-4">
                    <div className="flex flex-row absolute top-10 items-center gap-2">
                        <img src={`${user?.profileImage || "/assets/images/profile.png"}`} className="rounded-full w-11 h-11" />
                        <h1 className="text-[18px]">{user?.name as string}</h1>
                    </div>
                </div>
                <h1 className=" text-center text-[40px]">Traga mais <span className="text-blue-500">simplicidade</span> <br />ao fluxo dos seus dados.</h1>

                <div className="text-lg p-1 px-2 rounded-sm bg-zinc-950 border-1 border-zinc-700 z-10">Plano atual: Gratuito</div>

                <div className="z-20 flex flex-row w-full justify-between fixed bottom-0 p-5">
                    <button className="text-xl p-2 px-6 bg-transparent rounded-md border-1 border-zinc-600 transition-all cursor-pointer hover:bg-zinc-600/30 backdrop-blur-sm">
                        Voltar
                    </button>
                    <button className="text-xl p-2 px-6 bg-transparent rounded-md border-1 border-blue-500 transition-all cursor-pointer hover:bg-blue-500 backdrop-blur-sm">
                        Seguir
                    </button>
                </div>

                <div className={`${planType === 'free' ? 'bg-blue-500/10' :
                    planType === 'premium' ? 'bg-blue-500/15 scale-110' :
                        'bg-blue-500/20 scale-125'} z-0  
                transition-all duration-700 w-full max-w-[1300px] h-60 rounded-[100%] blur-3xl`}></div>

                <div className="z-10 flex flex-row gap-4 w-full max-w-[1300px] mt-[-220px] justify-center flex-wrap">
                    <div onClick={() => setPlanType('free')} className={`${planType === "free" ? 'scale-102 border-blue-400 bg-zinc-950' : 'border-zinc-800'} transition-all p-4 rounded-md bg-zinc-900 
                    w-full flex flex-col gap-2 max-w-[350px] border-1 cursor-pointer hover:bg-zinc-950 select-none pb-6`}
                        style={{
                            boxShadow: planType === 'free' ? '0px 0px 20px rgba(19, 105, 242, 0.5)' : ''
                        }}>
                        <div className="flex flex-row justify-between items-center gap-2">
                            <p>Uso Pessoal</p>
                            <div className={`${planType === "free" ? 'border-blue-500 bg-blue-500' : 'border-zinc-400'} transtion-all duration-300 border-1 w-5 h-5 rounded-full`}></div>
                        </div>

                        <h1 className="text-3xl">Gratuito</h1>

                        <div className="w-full h-[1px] bg-zinc-800"></div>
                        <p className="">Conheça a plataforma e comece a gerenciar suas conexões.</p>
                        <div className="flex flex-row gap-2 items-center mt-5">
                            <CircleCheckBig size={20} className="text-blue-500" />
                            <p>Armazenamento de até 25 items</p>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <CircleCheckBig size={20} className="text-blue-500" />
                            <p>1 Desktop pessoal</p>
                        </div>
                        <div className="flex flex-row gap-2 items-start">
                            <CircleCheckBig size={20} className="text-blue-500 w-6" />
                            <p>Imagens de fundo do Desktop com qualidade padrão</p>
                        </div>
                    </div>

                    <div onClick={() => setPlanType('premium')} className={`${planType === "premium" ? 'scale-102 border-blue-400 bg-zinc-950' : 'border-zinc-800'} transition-all p-4 rounded-md bg-zinc-900 
                    w-full flex flex-col gap-2 max-w-[350px] border-1 cursor-pointer hover:bg-zinc-950 select-none pb-6`}
                        style={{
                            boxShadow: planType === 'premium' ? '0px 0px 20px rgba(19, 105, 242, 0.5)' : ''
                        }}>
                        <div className="flex flex-row justify-between items-center gap-2">
                            <p>Para Equipes</p>
                            <div className={`${planType === "premium" ? 'border-blue-500 bg-blue-500' : 'border-zinc-400'} transtion-all duration-300 border-1 w-5 h-5 rounded-full`}></div>
                        </div>

                        <div className="flex flex-row justify-between items-end gap-2 flex-wrap">
                            <h1 className="text-3xl">Premium</h1>
                            <div className="flex flex-row items-end">
                                <h1 className="text-2xl">R$ 29,90</h1>
                                <p className="text-sm">/mês</p>
                            </div>

                        </div>
                        <div className="w-full h-[1px] bg-zinc-800"></div>
                        <p className="">Tenha as principais funcionalidades e otimize seu fluxo de desenvolvimento.</p>
                        <div className="flex flex-row gap-2 items-center mt-5">
                            <CircleCheckBig size={20} className="text-blue-500" />
                            <p>Armazenamento de até 1000 items</p>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <CircleCheckBig size={20} className="text-blue-500" />
                            <p>1 Desktop pessoal</p>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <CircleCheckBig size={20} className="text-blue-500" />
                            <p>2 Desktops equipe (máximo 5 membros)</p>
                        </div>
                        <div className="flex flex-row gap-2 items-start">
                            <CircleCheckBig size={20} className="text-blue-500" />
                            <p>Gerenciamento de Desktop compartilhado</p>
                        </div>
                        <div className="flex flex-row gap-2 items-start">
                            <CircleCheckBig size={20} className="text-blue-500 w-5.5" />
                            <p>Imagens de fundo do Desktop com alta resolução</p>
                        </div>
                        <div className="flex flex-row gap-2 items-start">
                            <CircleCheckBig size={20} className="text-blue-500 w-5.5" />
                            <p>Integração com Google Drive</p>
                        </div>
                        <div className="flex flex-row gap-2 items-start">
                            <CircleCheckBig size={20} className="text-blue-500 w-5.5" />
                            <p>Acesso a Widgets</p>
                        </div>
                    </div>

                    <div onClick={() => setPlanType('pro')} className={`${planType === "pro" ? 'scale-102 border-blue-400 bg-zinc-950' : 'border-zinc-800'} transition-all p-4 rounded-md bg-zinc-900 
                    w-full flex flex-col gap-2 max-w-[350px] border-1 cursor-pointer hover:bg-zinc-950 select-none pb-6`}
                        style={{
                            boxShadow: planType === 'pro' ? '0px 0px 20px rgba(19, 105, 242, 0.5)' : ''
                        }}>
                        <div className="flex flex-row justify-between items-center gap-2">
                            <p>Para Empresas</p>
                            <div className={`${planType === "pro" ? 'border-blue-500 bg-blue-500' : 'border-zinc-400'} transtion-all duration-300 border-1 w-5 h-5 rounded-full`}></div>
                        </div>

                        <div className="flex flex-row justify-between items-end gap-2 flex-wrap">
                            <h1 className="text-3xl">Pro</h1>
                            <div className="flex flex-row items-end">
                                <h1 className="text-2xl">R$ 69,90</h1>
                                <p className="text-sm">/mês</p>
                            </div>

                        </div>
                        <div className="w-full h-[1px] bg-zinc-800"></div>
                        <p className="">Tenha as principais funcionalidades e otimize seu fluxo de desenvolvimento.</p>
                        <div className="flex flex-row gap-2 items-center mt-5">
                            <CircleCheckBig size={20} className="text-blue-500" />
                            <p>Armazenamento de até 5000 items</p>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <CircleCheckBig size={20} className="text-blue-500" />
                            <p>2 Desktops pessoais</p>
                        </div>
                        <div className="flex flex-row gap-2 items-start">
                            <CircleCheckBig size={20} className="text-blue-500 w-5.5" />
                            <p>4 Desktops equipe (máximo 15 membros)</p>
                        </div>
                        <div className="flex flex-row gap-2 items-start">
                            <CircleCheckBig size={20} className="text-blue-500" />
                            <p>Gerenciamento de Desktop compartilhado</p>
                        </div>
                        <div className="flex flex-row gap-2 items-start">
                            <CircleCheckBig size={20} className="text-blue-500 w-5.5" />
                            <p>Imagens de fundo do Desktop com altíssima resolução</p>
                        </div>
                        <div className="flex flex-row gap-2 items-start">
                            <CircleCheckBig size={20} className="text-blue-500 w-5.5" />
                            <p>Integração com Google Drive</p>
                        </div>
                        <div className="flex flex-row gap-2 items-start">
                            <CircleCheckBig size={20} className="text-blue-500 w-5.5" />
                            <p>Acesso a Widgets</p>
                        </div>
                        <div className="flex flex-row gap-2 items-start">
                            <CircleCheckBig size={20} className="text-blue-500 w-5.5" />
                            <p>Personalização de items</p>
                        </div>
                        <div className="flex flex-row gap-2 items-start">
                            <CircleCheckBig size={20} className="text-blue-500 w-5.5" />
                            <p>Criação de comunidades (Em breve)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}