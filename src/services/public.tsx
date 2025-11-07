import { User, UserProfile } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/config";

export const registerPublicUser = async (uid: string, name: string, email: string): Promise<UserProfile> => {
    try {
        await setDoc(doc(db, "public-users", uid), {
            name: name,
            email: email,
            profileImage: null,
        });

        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        const userProfile: UserProfile = {
            uid: uid,
            ...userDoc.data() as Omit<User, 'uid'>
        }

        return userProfile;

    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        throw error;
    }
};

export const updatePublicUserProfileImage = async (uid: string, imageURL: string): Promise<UserProfile> => {
    try {
        const userRef = doc(db, "public-users", uid);
        await updateDoc(userRef, {
            profileImage: imageURL
        });

        const updatedDoc = await getDoc(userRef);
        if (!updatedDoc.exists()) {
            throw new Error("O usuário não foi encontrado após a atualização.");
        }

        const updatedUserData = {
            uid: updatedDoc.id,
            ...updatedDoc.data()
        } as UserProfile;


        return updatedUserData;

    } catch (error) {
        console.error("Erro ao atualizar imagem de perfil:", error);
        throw error;
    }
};


export const getPublicUserByEmail = async (email: string): Promise<UserProfile> => {
    try {
        const q = query(collection(db, "public-users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        const user: UserProfile[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as UserProfile[];

        return user[0];

    } catch (error) {
        console.error("Erro ao buscar usuario publico por email:", error);
        throw error;
    }
};


