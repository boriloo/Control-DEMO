import { useEffect, useState } from "react"
import { Eye, EyeOff, Check } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import { FirebaseError } from "firebase/app";
import '../../App.css'
import { useUser } from "../../context/AuthContext";
import { LoginData } from "../../types/auth";

const loginSchema = z.object({
    email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
    password: z.string()
        .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
        .regex(/[A-Z]/, { message: "Deve conter pelo menos uma letra maiúscula." })
        .regex(/[a-z]/, { message: "Deve conter pelo menos uma letra minúscula." })
        .regex(/[0-9]/, { message: "Deve conter pelo menos um número." })
        .regex(/[^a-zA-Z0-9]/, { message: "Deve conter pelo menos um caractere especial." }),
});

const registerSchema = z.object({
    name: z.string().min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
    email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
    password: z.string()
        .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
        .regex(/[A-Z]/, { message: "Deve conter pelo menos uma letra maiúscula." })
        .regex(/[a-z]/, { message: "Deve conter pelo menos uma letra minúscula." })
        .regex(/[0-9]/, { message: "Deve conter pelo menos um número." })
        .regex(/[^a-zA-Z0-9]/, { message: "Deve conter pelo menos um caractere especial." }),
    confirmPassword: z.string()
}).refine((data: any) => data.password === data.confirmPassword, {
    path: ['password'],
    message: 'As senhas não coincidem',
});


type FormData = z.infer<typeof loginSchema> | z.infer<typeof registerSchema>;

export default function AuthPage() {
    const { authLoginUser, authRegisterUser } = useUser();
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [seePass, setSeePass] = useState<boolean>(false);
    const [sent, setSent] = useState<boolean>(false);
    const [loginForm, setLoginForm] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null)
    const [approved, setApproved] = useState<boolean>(true)

    useEffect(() => {
        setTimeout(() => { setApproved(false) }, 100);
    }, []);

    const { register, handleSubmit, formState: { errors }, clearErrors } = useForm<FormData>({
        resolver: zodResolver(loginForm ? loginSchema : registerSchema),
        mode: "all"
    });

    useEffect(() => {
        clearErrors();
    }, [loginForm, clearErrors]);


    const handleFormSubmit = async (data: FormData) => {
        if (loginForm) {
            try {
                setError(null);
                setSent(true);
                const loginData = data as z.infer<typeof loginSchema>
                console.log('REMEMBER ME?', rememberMe)
                await authLoginUser({ email: loginData.email, password: loginData.password, rememberMe } as LoginData);
                setApproved(true)

                setTimeout(() => {
                    navigate('/dashboard')
                }, 1000)
                console.log('oi')
            } catch (error) {
                setSent(false)
                // const fbError = error as FirebaseError
                // switch (fbError.code) {
                //     case 'auth/invalid-credential':
                //         setError("Dados inválidos");
                //         break;
                //     case 'auth/too-many-requests':
                //         setError("Muitas tentativas, espere um pouco");
                //         break;
                //     default:
                //         setError("Ocorreu um erro inesperado");
                //         break;
                // }
            }
        } else {
            try {
                setError(null);
                setSent(true);
                const registerData = data as z.infer<typeof registerSchema>
                await authRegisterUser({
                    name: registerData.name, email: registerData.email, password: registerData.password,
                    filterDark: 'low', filterBlur: 'low', filterColor: 'color'
                });
                setApproved(true)
                setTimeout(() => {
                    navigate('/dashboard')
                }, 1000)
            } catch (error) {
                setSent(false)
                console.error("❌ Ocorreu um erro durante o processo de registro:", error);
            }
        }
    };


    return (
        <>
            <div className="pointer-events-none fixed z-50 flex justify-center items-center w-full min-h-screen">
                <p className={`${approved ? 'opacity-100' : 'opacity-0'} control-text text-[50px] transition-all duration-500`}>Control</p>
            </div>
            <div className={`${approved ? 'scale-101 brightness-0' : 'scale-125'} min-h-screen w-full fixed bg-black 
                bg-[url('/assets/images/authBG6.jpg')] bg-cover bg-center transition-all duration-1000 z-[-1]`}>
            </div>
            <div className="flex justify-center items-center p-4 w-full min-h-screen">
                <div className={`${approved ? 'opacity-0' : 'opacity-100'} max-w-[550px] p-6 py-10 transition-all duration-500 select-none flex flex-col items-start w-full  bg-black/40 rounded-lg backdrop-blur-md `}>

                    <h1 className={`${error ? 'text-red-400 p-1 px-2 bg-red-700/20' : ''} rounded-md transition-all text-[30px]`}>{error ? error : loginForm ? 'Entrar com e-mail' : 'Crie sua conta'}</h1>
                    <form className="w-full mt-6 flex flex-col gap-4 items-start" id="loginForm" onSubmit={handleSubmit(handleFormSubmit)}>
                        {!loginForm && (
                            <input {...register("name")} type="text" name="name" placeholder="Nome"
                                className={`p-3 w-full placeholder-white/80 rounded-md bg-black/30 text-white
                         hover:bg-black/40 transition-all outline-1 outline-transparent duration-400 cursor-pointer focus:cursor-text focus:bg-black/50 focus:outline-blue-500`} />
                        )}

                        <input {...register("email")} type="email" name="email" placeholder="E-mail"
                            className="w-full p-3 placeholder-white/80 rounded-md bg-black/30 text-white hover:bg-black/40 transition-all outline-1 outline-transparent duration-400 
                    cursor-pointer focus:cursor-text focus:bg-black/50 focus:outline-blue-500" />
                        <p className={`${errors.email?.message ? 'p-1 px-3' : 'opacity-0 mt-[-10px] '} text-red-500 bg-red-700/10  rounded-sm text-[15px] transition-all`}>{errors.email?.message}</p>
                        <div className="relative w-full">
                            <input {...register("password")} type={`${seePass ? 'text' : 'password'}`} name="password" placeholder="Senha"
                                className="w-full p-3 placeholder-white/80 rounded-md bg-black/30 text-white hover:bg-black/40 transition-all 
                            outline-1 outline-transparent duration-400 cursor-pointer focus:cursor-text focus:bg-black/50 focus:outline-blue-500" />
                            {!seePass ?
                                (<Eye onClick={() => setSeePass(true)} className="absolute top-2 text-blue-500 cursor-pointer right-2 rounded-sm w-8 h-8 p-1 transition-all hover:bg-blue-500 hover:text-white" />)
                                :
                                (<EyeOff onClick={() => setSeePass(false)} className="absolute top-2 text-blue-500 cursor-pointer right-2 rounded-sm w-8 h-8 p-1 transition-all hover:bg-blue-500 hover:text-white" />)}
                        </div>
                        <p className={`${errors.password?.message ? 'p-1 px-3' : 'opacity-0 mt-[-10px] '} text-red-500 bg-red-700/10  rounded-sm text-[15px] transition-all`}>{errors.password?.message}</p>
                        {!loginForm && (
                            <input {...register("confirmPassword")} type={`${seePass ? 'text' : 'password'}`} name="confirmPassword" placeholder="Confirmar Senha"
                                className={`p-3 w-full placeholder-white/80 rounded-md bg-black/30 text-white hover:bg-black/40 
                        transition-all outline-1 outline-transparent duration-400 cursor-pointer focus:cursor-text focus:bg-black/50 focus:outline-blue-500`} />
                        )}
                        {loginForm && (
                            <div className="select-none flex flex-row justify-between w-full gap-2 flex-wrap-reverse">
                                <div className="flex flex-row gap-2 p-1 px-2 rounded-md transition-all items-center cursor-pointer hover:bg-blue-200/15" onClick={() => setRememberMe(!rememberMe)}>
                                    <div className={`w-5 h-5 rounded-sm flex justify-center items-center border-[1px] transition-all ${rememberMe ? 'border-blue-500 bg-blue-500' : 'border-white'} `}>
                                        {rememberMe && (
                                            <Check className="w-full" />
                                        )}
                                    </div>
                                    <p className={`${rememberMe ? 'text-blue-300' : 'text-white'} `}>Lembrar de mim</p>
                                </div>
                                <div className="text-blue-300 font-medium text-md cursor-pointer p-1 px-2 transition-all hover:bg-blue-500/40 rounded-lg">
                                    Esqueci minha senha
                                </div>
                            </div>
                        )}

                        <button type="submit"
                            disabled={sent}
                            className={`${loginForm ? '' : 'mt-4'} ${sent ? 'opacity-50' : 'hover:bg-blue-500 cursor-pointer'} flex justify-center items-center overflow-hidden p-3 w-full max-h-10 bg-blue-600 text-white font-bold rounded-lg  transition-all`}>
                            {sent ? (<DotLottieReact
                                src="https://lottie.host/e580eaa4-d189-480f-a6ce-f8c788dff90d/MP2FjoJFFE.lottie"
                                className="w-26 p-0"
                                loop
                                autoplay
                            />) : loginForm ? 'Entrar' : 'Criar conta'}
                        </button>
                    </form>

                    {/* <div className="flex w-full justify-center items-center mt-4">
                    <p className={`${error ? 'p-1 px-3' : 'opacity-0 mt-[-10px] '} text-red-500 bg-red-700/10  rounded-sm text-[18px] font-medium transition-all`}>{error}</p>
                </div> */}

                    <button disabled={sent} onClick={() => setLoginForm(!loginForm)}
                        className={`${sent ? 'opacity-50' : 'cursor-pointer hover:bg-blue-500/40'} underline text-blue-400 font-medium mt-5 text-md  p-1 px-2 transition-all  rounded-lg`}>
                        {loginForm ? 'Não possui uma conta?' : 'Já possui uma conta?'}
                    </button>

                    {/* <div className="bg-white/50 w-full h-[1px] mt-8 mb-8"></div>

                    <div className="flex flex-col gap-2 w-full items-center">
                        <p className="text-lg">Entrar com</p>
                        <button className="cursor-pointer p-3 w-full flex justify-center items-center max-w-[300px] bg-gray-200 text-white font-bold rounded-lg hover:bg-white transition-colors">
                            <img src="/assets/images/google.png" className="w-5 h-5" />
                        </button>
                    </div> */}
                </div>
            </div>

        </>
    )
}