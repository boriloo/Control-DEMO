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
import { BasicFilter, ColorFilter, LoginData, RegisterData, returnFilterEffects, UserData } from "../types/auth";
import { authLoginService, authLogoutService, authRefreshService, authRegisterService } from "../services/authServices";
import { api } from "../lib/axiosConfig";
import { getMeService } from "../services/userServices";
import { getDesktopByIdService, getDesktopByOwnerService } from "../services/desktopServices";
import { DesktopData } from "../types/desktop";
import { FileData } from "../types/file";
// import { createUserEmailRef } from "../services/email";
// import { registerPublicUser, updatePublicUserProfileImage } from "../services/public";


interface UserContextProps {
    userFilters: any;
    isAuthenticated: boolean;
    user: UserData | null;
    changeUser: (user: UserData) => void;
    standardUser: (user: any) => UserData;
    currentDesktop: DesktopData | null;
    changeCurrentDesktop: (desktop: DesktopData) => void;
    standardDesktop: (desktop: any) => DesktopData;
    standardFile: (file: any) => FileData;
    authLoginUser: (data: LoginData) => Promise<void>;
    authRegisterUser: (data: RegisterData) => Promise<void>;
    authLogoutUser: () => Promise<void>;
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
    const [userFilters, setUserFilters] = useState<any>()

    useEffect(() => {
        setUserFilters(returnFilterEffects(user))
    }, [user?.filterBlur, user?.filterColor, user?.filterDark])


    const changeCurrentDesktop = useCallback((desktop: any) => {
        setCurrentDesktop(desktop)
    }, [currentDesktop])

    const changeUser = useCallback((user: UserData) => {
        setUser(user)
    }, [user])

    const standardUser = (user: any) => {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            profileImage: user.profile_image
                ? user.profile_image.startsWith('data:')
                    ? user.profile_image
                    : `data:image/png;base64,${user.profile_image}`
                : null,
            filterBlur: user.filter_blur,
            filterDark: user.filter_dark,
            filterColor: user.filter_color,
            createdAt: user.created_at,
        } as UserData
    }

    const standardDesktop = (desktop: any) => {
        return {
            id: desktop.id,
            name: desktop.name,
            ownerId: desktop.owner_id,
            backgroundImage: desktop.background_image.startsWith('data:')
                ? desktop.background_image
                : `data:image/png;base64,${desktop.background_image}`,
            createdAt: desktop.created_at,
        } as DesktopData
    }

    const standardFile = (file: any) => {
        return {
            id: file.id,
            name: file.name,
            ownerId: file.owner_id,
            parentId: file.parent_id,
            desktopId: file.desktop_id,
            fileType: file.file_type,
            url: file.url,
            xPos: file.xpos,
            yPos: file.ypos,
            createdAt: file.created_at,
        } as FileData;
    }

    useEffect(() => {
        const initApp = async () => {
            setIsLoading(true);
            try {
                const currentUser = await getMeService();
                console.log(currentUser)
                
                const standart = standardUser(currentUser)

                setUser(standart as UserData);

                setIsAuthenticated(true);

                console.log(currentUser)

                const desktops = await getDesktopByOwnerService();

                const firstDesktop = desktops[0]

                const localStorageDesktop = localStorage.getItem('last-desktop')

                if (desktops && desktops.length > 0) {

                    setHasDesktops(true);

                    if (localStorageDesktop) {
                        const desktop = await getDesktopByIdService(localStorageDesktop)

                        const standart = standardDesktop(desktop)

                        setCurrentDesktop(standart as DesktopData);

                    } else {
                        const standart = standardDesktop(firstDesktop)

                        setCurrentDesktop(standart as DesktopData);
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
                isAuthenticated,
                user,
                changeUser,
                standardUser,
                currentDesktop,
                changeCurrentDesktop,
                standardDesktop,
                standardFile,
                authLoginUser,
                authRegisterUser,
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
