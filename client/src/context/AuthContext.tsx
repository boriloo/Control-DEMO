import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback,
} from "react";
// import { getUserProfile, loginUser, registerUser, updateUserFilters, updateUserName, updateUserProfileImage } from "../services/auth";
// import { browserLocalPersistence, browserSessionPersistence, onAuthStateChanged, setPersistence, signOut, UserProfile } from "firebase/auth";
// import { auth } from "../firebase/config";
import { useAppContext } from "./AppContext";
// import { FullDesktopData, getDesktopById, getDesktopsByMember } from "../services/desktop";
import { BasicFilter, ColorFilter, LoginData, RegisterData, UserData } from "../types/auth";
import { authLoginService, authLogoutService, authRefreshService, authRegisterService } from "../services/authServices";
import { api } from "../lib/axiosConfig";
import { getMeService } from "../services/userServices";
import { getDesktopByOwnerService } from "../services/desktopServices";
import { DesktopData } from "../types/desktop";
// import { createUserEmailRef } from "../services/email";
// import { registerPublicUser, updatePublicUserProfileImage } from "../services/public";


interface UserContextProps {
    isAuthenticated: boolean;
    user: UserData | null;
    currentDesktop: any | null;
    changeCurrentDesktop: (desktop: any) => void;
    authLoginUser: (data: LoginData) => Promise<void>;
    authRegisterUser: (data: RegisterData) => Promise<void>;
    authLogoutUser: () => Promise<void>;
    authChangeUserAvatar: (imageURL: string) => void;
    authChangeUserFilters: (filterDark: BasicFilter, filterBlur: BasicFilter, filterColor: ColorFilter) => Promise<void>;
    authChangeUserName: (username: string) => void;
    isLoading: boolean;
    hasDesktops: boolean;
    setHasDesktops: (value: boolean) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { closeAllWindows } = useAppContext();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const [currentDesktop, setCurrentDesktop] = useState<DesktopData | null>(null);
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [hasDesktops, setHasDesktops] = useState<boolean>(false);

    console.log('ESTADO ATUAL DO DESKTOP:', currentDesktop);

    const changeCurrentDesktop = useCallback((desktop: any) => {
        setCurrentDesktop(desktop)
    }, [])

    useEffect(() => {
        const initApp = async () => {
            setIsLoading(true);
            let currentUser = null;

            try {
                currentUser = await getMeService();
                setUser(currentUser);
                setIsAuthenticated(true);
            } catch (err) {
                try {
                    const { token } = await authRefreshService();
                    localStorage.setItem("accessToken", token);
                    currentUser = await getMeService();
                    setUser(currentUser);
                    setIsAuthenticated(true);
                } catch (refreshErr) {
                    setIsAuthenticated(false);
                    setUser(null);
                    setIsLoading(false);
                    return;
                }
            }


            if (currentUser) {
                try {

                    const desktops = await getDesktopByOwnerService();

                    if (desktops && desktops.length > 0) {

                        setHasDesktops(true);

                        const firstDesktop = desktops[0];

                        setCurrentDesktop({
                            id: firstDesktop.id,
                            name: firstDesktop.name,
                            ownerId: firstDesktop.owner_id,
                            backgroundImage: firstDesktop.background_image.startsWith('data:')
                                ? firstDesktop.background_image
                                : `data:image/png;base64,${firstDesktop.background_image}`,
                            createdAt: firstDesktop.created_at
                        } as DesktopData);


                    } else {
                        setHasDesktops(false);
                    }
                } catch (err) {
                    setHasDesktops(false);
                    setCurrentDesktop(null);
                }
            }

            setIsLoading(false);
        };

        initApp();
    }, []);


    useEffect(() => {
        api.interceptors.request.use((config) => {
            const token = user?.token
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }, [])

    async function authLoginUser(data: LoginData) {
        try {
            const userData = await authLoginService(data)
            const { token } = userData
            localStorage.setItem("accessToken", token);
            setUser(userData);
            setIsAuthenticated(true);
        } catch (err) {
            throw err;
        }
    }

    async function authRegisterUser(data: RegisterData) {
        try {

            const userData = await authRegisterService(data)

            setUser(userData);

        } catch (err) {
            throw err;
        }
    }

    async function authLogoutUser() {
        try {
            closeAllWindows()
            await authLogoutService();
            setIsAuthenticated(false)
            setUser(null)
            setHasDesktops(false)
            setCurrentDesktop(null)
            localStorage.clear();
        } catch (err) {
            throw err;
        }
    }

    async function authChangeUserFilters(filterDark: BasicFilter, filterBlur: BasicFilter, filterColor: ColorFilter) {
        try {
            if (!user) return;
            // const updatedUser = await updateUserFilters(
            //     user.uid as string,
            //     filterDark,
            //     filterBlur,
            //     filterColor
            // );
            // console.log('FILTROS ATUALIZADOS COM SUCESSO! ', updatedUser)
            // setUser(updatedUser)
        } catch (err) {
            throw err;
        }
    }

    async function authChangeUserAvatar(imageURl: string) {
        try {
            if (!user) return;
            // const updatedUser = await updateUserProfileImage(
            //     user.uid as string,
            //     imageURl
            // );
            // await updatePublicUserProfileImage(updatedUser.uid as string, imageURl)
            // setUser(updatedUser)
        } catch (err) {
            throw err;
        }
    }

    async function authChangeUserName(username: string) {
        try {
            if (!user) return;
            // const updatedUser = await updateUserName(
            //     user.uid as string,
            //     username
            // );
            // setUser(updatedUser)
        } catch (err) {
            throw err
        }
    }

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, async (user) => {
    //         if (!user) {
    //             console.log("não foi possível encontrar usuário autenticado");
    //             setIsLoading(false);
    //             return;
    //         }
    //         setIsAuthenticated(true);
    //         try {
    //             const item = localStorage.getItem("last-desktop");
    //             if (item === null) {
    //                 const desktops = await getDesktopsByMember(user.uid as string);
    //                 if (desktops.length > 0) {
    //                     setHasDesktops(true);
    //                     changeCurrentDesktop(desktops[0]);
    //                 }
    //             } else {
    //                 setHasDesktops(true);
    //                 const lastDesktop = await getDesktopById(item);
    //                 changeCurrentDesktop(lastDesktop);
    //             }
    //             const userProfile = await getUserProfile(user.uid);
    //             if (userProfile) setUser(userProfile);
    //         } catch (err) {
    //             localStorage.removeItem("last-desktop")
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     });
    //     return () => unsubscribe();
    // }, []);




    return (
        <UserContext.Provider
            value={{
                authChangeUserAvatar,
                isAuthenticated,
                user,
                currentDesktop,
                changeCurrentDesktop,
                authLoginUser,
                authChangeUserFilters,
                authRegisterUser,
                authChangeUserName,
                isLoading,
                authLogoutUser,
                hasDesktops,
                setHasDesktops
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser deve ser usado dentro de <AuthProvider>");
    return ctx;
}
