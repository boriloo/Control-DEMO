import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback,
} from "react";
import { useAppContext } from "./AppContext";
import { BasicFilter, ColorFilter, LoginData, RegisterData, returnFilterEffects, UserData } from "../types/auth";
import { authLoginService, authLogoutService, authRefreshService, authRegisterService } from "../services/authServices";
import { api } from "../lib/axiosConfig";
import { getMeService } from "../services/userServices";
import { getDesktopByIdService, getDesktopByOwnerService } from "../services/desktopServices";
import { DesktopData } from "../types/desktop";
import { FileData } from "../types/file";


interface UserContextProps {
    userFilters: any;
    setUserFilters: (filter: string) => void;
    isAuthenticated: boolean;
    user: UserData | null;
    changeUser: (user: UserData) => void;
    currentDesktop: DesktopData | null;
    changeCurrentDesktop: (desktop: DesktopData) => void;
    authLoginUser: (data: LoginData) => Promise<void>;
    authRegisterUser: (data: RegisterData) => Promise<void>;
    authLogoutUser: () => Promise<void>;
    isLoading: boolean;
    hasDesktops: boolean;
    setHasDesktops: (value: boolean) => void;
    toBase64Image: (value: any) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { closeAllWindows } = useAppContext();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const [currentDesktop, setCurrentDesktop] = useState<DesktopData | null>(null);
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [hasDesktops, setHasDesktops] = useState<boolean>(false);
    const [userFilters, setUserFilters] = useState<string>()

    useEffect(() => {
        const darkFilter = localStorage.getItem('dark-filter')
        const blurFilter = localStorage.getItem('blur-filter')
        const colorFilter = localStorage.getItem('color-filter')


        if (darkFilter) {
            localStorage.setItem('dark-filter', darkFilter)
        } else {
            localStorage.setItem('dark-filter', 'low')
        }

        if (blurFilter) {
            localStorage.setItem('blur-filter', blurFilter)
        } else {
            localStorage.setItem('blur-filter', 'low')
        }

        if (colorFilter) {
            localStorage.setItem('color-filter', colorFilter)
        } else {
            localStorage.setItem('color-filter', '')
        }
    }, [])


    const changeCurrentDesktop = useCallback((desktop: any) => {
        setCurrentDesktop({
            ...desktop,
            backgroundImage: toBase64Image(desktop.backgroundImage) as string
        })
        localStorage.setItem('last-desktop', desktop.id);
    }, [currentDesktop])


    const changeUser = useCallback((user: UserData) => {
        setUser({
            ...user,
            profileImage: toBase64Image(user.profileImage) as string
        })
    }, [])


    const toBase64Image = (image: any): string | null => {
        if (!image) return null

        if (typeof image === 'string' && image.startsWith('data:')) return image

        if (typeof image === 'string') return `data:image/png;base64,${image}`

        if (Buffer.isBuffer(image)) return `data:image/png;base64,${image.toString('base64')}`

        if (image instanceof Uint8Array) return `data:image/png;base64,${Buffer.from(image).toString('base64')}`

        return null
    }


    useEffect(() => {
        const initApp = async () => {
            setIsLoading(true);
            try {
                const currentUser = await getMeService();

                setUser({
                    ...currentUser,
                    profileImage: toBase64Image(currentUser.profileImage)
                })

                setIsAuthenticated(true);

                const desktops = await getDesktopByOwnerService();

                const firstDesktop = desktops[0]

                const localStorageDesktop = localStorage.getItem('last-desktop')

                if (desktops && desktops.length > 0) {

                    setHasDesktops(true);

                    if (localStorageDesktop) {
                        try {
                            const desktop = await getDesktopByIdService(localStorageDesktop)

                            setCurrentDesktop({
                                ...desktop,
                                backgroundImage: toBase64Image(desktop.backgroundImage)
                            })
                        } catch (err) {
                            setCurrentDesktop({
                                ...firstDesktop,
                                backgroundImage: toBase64Image(firstDesktop.backgroundImage)
                            })
                        }
                    }
                }
            } catch (err) {
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initApp();
    }, []);


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


    return (
        <UserContext.Provider
            value={{
                userFilters,
                setUserFilters,
                isAuthenticated,
                user,
                changeUser,
                currentDesktop,
                changeCurrentDesktop,
                authLoginUser,
                authRegisterUser,
                isLoading,
                authLogoutUser,
                hasDesktops,
                setHasDesktops,
                toBase64Image
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
