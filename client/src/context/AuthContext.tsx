import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback,
} from "react";
import { useAppContext } from "./AppContext";
import { LoginData, RegisterData, UserData } from "../types/auth";
import { authLoginService, authLogoutService, authRefreshService, authRegisterService } from "../services/authServices";
import { getMeService } from "../services/userServices";
import { getDesktopByIdService, getDesktopByOwnerService } from "../services/desktopServices";
import { DesktopData } from "../types/desktop";
import { getSwatches } from 'colorthief';


interface UserContextProps {
    userFilters: any;
    setUserFilters: (filter: string) => void;
    isAuthenticated: boolean;
    user: UserData | null;
    changeUser: (user: UserData) => void;
    currentDesktop: DesktopData | null;
    changeCurrentDesktop: (desktop: DesktopData) => void;
    authLoginUser: (data: LoginData) => Promise<UserData>;
    authRegisterUser: (data: RegisterData) => Promise<void>;
    authLogoutUser: () => Promise<void>;
    isLoading: boolean;
    hasDesktops: boolean;
    setHasDesktops: (value: boolean) => void;
    toBase64Image: (value: any) => void;
    bgColors: any;
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
    const [bgColors, setBgColors] = useState({
        darker: '',
        dark: '',
        regular: '',
        light: '',
        lighter: ''
    });


    useEffect(() => {
        const getColorB = async () => {

            const base64 = currentDesktop?.backgroundImage;
            if (!base64) return;

            const img = new Image();
            img.src = base64;
            await new Promise((resolve) => (img.onload = resolve));

            const response = (await getSwatches(img)) as any;
            let color;

            if (response.Vibrant) {
                color = response.Vibrant.color
            } else {
                color = response.Muted.color
            }

            console.log(color)

            const { _r: r, _g: g, _b: b } = color;

            const toHex = (r: number, g: number, b: number) =>
                `#${[r, g, b].map(v => Math.min(255, Math.max(0, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;

            setBgColors({
                darker: toHex(r * 0.04, g * 0.04, b * 0.12), // Midnight Blue (Base fria)
                dark: toHex(r * 0.15, g * 0.12, b * 0.30), // Deep Violet (Contraste forte)
                regular: toHex(r * 0.45, g * 0.45, b * 0.50), // Neutro balanceado
                light: toHex(r * 0.95, g * 0.85, b * 0.65), // Champagne/Ouro (Complementar quente)
                lighter: toHex(r * 1.15, g * 1.10, b * 1.05)  // Marfim (Brilho suave)
            });


        };

        getColorB();
    }, [currentDesktop]);


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
            localStorage.setItem('color-filter', 'color')
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


    const initApp = useCallback(async () => {
        setIsLoading(true);
        try {
            const currentUser = await getMeService();
            setUser({
                ...currentUser,
                profileImage: toBase64Image(currentUser.profileImage)
            });
            setIsAuthenticated(true);

            const desktops = await getDesktopByOwnerService();
            if (desktops && desktops.length > 0) {
                setHasDesktops(true);
                const localStorageDesktop = localStorage.getItem('last-desktop');
                const firstDesktop = desktops[0];

                if (localStorageDesktop) {
                    try {
                        const desktop = await getDesktopByIdService(localStorageDesktop);
                        setCurrentDesktop({
                            ...desktop,
                            backgroundImage: toBase64Image(desktop.backgroundImage)
                        });
                    } catch (err) {
                        setCurrentDesktop({
                            ...firstDesktop,
                            backgroundImage: toBase64Image(firstDesktop.backgroundImage)
                        });
                    }
                } else {
                    setCurrentDesktop({
                        ...firstDesktop,
                        backgroundImage: toBase64Image(firstDesktop.backgroundImage)
                    });
                }
            }
        } catch (err) {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);


    useEffect(() => {
        initApp();
    }, [initApp]);


    async function authLoginUser(data: LoginData) {
        try {
            const userData = await authLoginService(data)
            const { token } = userData
            localStorage.setItem("accessToken", token);
            setUser(userData);
            setIsAuthenticated(true);
            await initApp();
            return userData.user;
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
                toBase64Image,
                bgColors
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
