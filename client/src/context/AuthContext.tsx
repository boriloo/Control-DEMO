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
import { FileData } from "../types/file";
// import { createUserEmailRef } from "../services/email";
// import { registerPublicUser, updatePublicUserProfileImage } from "../services/public";


interface UserContextProps {
    isAuthenticated: boolean;
    user: UserData | null;
    currentDesktop: DesktopData | null;
    changeCurrentDesktop: (desktop: DesktopData) => void;
    standardDesktop: (desktop: any) => DesktopData;
    standardFile: (file: any) => FileData;
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

    const changeCurrentDesktop = useCallback((desktop: any) => {
        setCurrentDesktop(desktop)
    }, [])

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
            xPos: file.xPos,
            yPos: file.yPos,
            createdAt: file.created_at,
        } as FileData;
    }

    useEffect(() => {
        const initApp = async () => {
            setIsLoading(true);

            try {
                const currentUser = await getMeService();

                setUser({
                    id: currentUser.id,
                    email: currentUser.email,
                    name: currentUser.name,
                    filterDark: currentUser.filter_dark,
                    filterBlur: currentUser.filter_blur,
                    filterColor: currentUser.filter_color,
                    createdAt: currentUser.created_at
                } as UserData);

                setIsAuthenticated(true);

                console.log(currentUser)

                const desktops = await getDesktopByOwnerService();

                const firstDesktop = desktops[0]

                if (desktops && desktops.length > 0) {
                    setHasDesktops(true);
                    setCurrentDesktop({
                        id: firstDesktop.id,
                        name: firstDesktop.name,
                        ownerId: firstDesktop.owner_id,
                        backgroundImage: firstDesktop.background_image.startsWith('data:')
                            ? firstDesktop.background_image
                            : `data:image/png;base64,${firstDesktop.background_image}`,
                        createdAt: firstDesktop.created_at,

                    } as DesktopData);
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

    return (
        <UserContext.Provider
            value={{
                authChangeUserAvatar,
                isAuthenticated,
                user,
                currentDesktop,
                changeCurrentDesktop,
                standardDesktop,
                standardFile,
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
