import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback,
} from "react";
import { getUserProfile, loginUser, registerUser, updateUserFilters, updateUserName, updateUserProfileImage } from "../services/auth";
import { browserLocalPersistence, browserSessionPersistence, onAuthStateChanged, setPersistence, signOut, UserProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAppContext } from "./AppContext";
import { FullDesktopData, getDesktopById, getDesktopsByMember } from "../services/desktop";
import { BasicFilter, ColorFilter } from "../types/auth";
import { createUserEmailRef } from "../services/email";


interface UserContextProps {
    isAuthenticated: boolean;
    user: UserProfile | null;
    currentDesktop: FullDesktopData | null;
    changeCurrentDesktop: (desktop: FullDesktopData) => void;
    authLoginUser: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    authRegisterUser: (name: string, email: string, password: string, rememberMe: boolean, filterDark: BasicFilter, filterBlur: BasicFilter, filterColor: ColorFilter) => Promise<void>;
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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentDesktop, setCurrentDesktop] = useState<FullDesktopData | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [hasDesktops, setHasDesktops] = useState<boolean>(false);

    const changeCurrentDesktop = useCallback((desktop: FullDesktopData) => {
        setCurrentDesktop(desktop)
    }, [])



    async function authLoginUser(email: string, password: string, rememberMe: boolean) {
        try {
            const persistenceType = rememberMe
                ? browserLocalPersistence
                : browserSessionPersistence;

            await setPersistence(auth, persistenceType);

            const user = await loginUser({ email, password });

            const userProfile = await getUserProfile(user.uid)
            setUser(userProfile);
        } catch (err) {
            throw err;
        }
    }

    async function authRegisterUser(name: string, email: string, password: string, rememberMe: boolean, filterDark: BasicFilter, filterBlur: BasicFilter, filterColor: ColorFilter) {
        try {
            const persistenceType = rememberMe
                ? browserLocalPersistence
                : browserSessionPersistence;

            await setPersistence(auth, persistenceType);

            const user: UserProfile = await registerUser({ name, email, password, filterDark, filterBlur, filterColor });
            await createUserEmailRef(email)
            const userProfile = await getUserProfile(user.uid as string)
            setUser(userProfile);

        } catch (err) {
            throw err;
        }
    }

    async function authLogoutUser() {
        try {
            closeAllWindows()
            signOut(auth)
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
            const updatedUser = await updateUserFilters(
                user.uid as string,
                filterDark,
                filterBlur,
                filterColor
            );
            console.log('FILTROS ATUALIZADOS COM SUCESSO! ', updatedUser)
            setUser(updatedUser)
        } catch (err) {
            throw err;
        }
    }

    async function authChangeUserAvatar(imageURl: string) {
        try {
            if (!user) return;
            const updatedUser = await updateUserProfileImage(
                user.uid as string,
                imageURl
            );
            setUser(updatedUser)
        } catch (err) {
            throw err;
        }
    }

    async function authChangeUserName(username: string) {
        try {
            if (!user) return;
            const updatedUser = await updateUserName(
                user.uid as string,
                username
            );
            setUser(updatedUser)
        } catch (err) {
            throw err
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.log("não foi possível encontrar usuário autenticado");
                setIsLoading(false);
                return;
            }
            setIsAuthenticated(true);
            try {
                const item = localStorage.getItem("last-desktop");
                if (item === null) {
                    const desktops = await getDesktopsByMember(user.uid as string);
                    if (desktops.length > 0) {
                        setHasDesktops(true);
                        changeCurrentDesktop(desktops[0]);
                    }
                } else {
                    setHasDesktops(true);
                    const lastDesktop = await getDesktopById(item);
                    changeCurrentDesktop(lastDesktop);
                }
                const userProfile = await getUserProfile(user.uid);
                if (userProfile) setUser(userProfile);
            } catch (err) {
                localStorage.removeItem("last-desktop")
            } finally {
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);




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
