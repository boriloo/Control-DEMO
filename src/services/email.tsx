import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const createUserEmailRef = async (email: string) => {
    try {
        if (!email) {
            throw new Error("E-mail é necessário para criar a referência.");
        }

        await setDoc(doc(db, "emails", email), {});

    } catch (error) {
        console.error("Erro ao registrar ref do email do user", error);
        throw error;
    }
};