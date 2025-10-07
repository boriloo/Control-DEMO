import { db } from "../firebase/config";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import { DesktopData } from "../types/desktop";

export type FullDesktopData = DesktopData & { id: string };

export const createDesktop = async (data: DesktopData): Promise<FullDesktopData> => {
    try {
        const desktopPayload: any = {
            name: data.name,
            type: data.type,
            ownerId: data.ownerId,
            members: data.members,
            membersId: data.membersId,
            createdAt: serverTimestamp()
        };

        if (data.background !== undefined) {
            desktopPayload.background = data.background;
        }

        const newDocRef = await addDoc(collection(db, "desktops"), desktopPayload);
        const desktopDoc = await getDoc(newDocRef);

        if (!desktopDoc.exists()) {
            throw new Error("Documento não encontrado após a criação, o que não deveria acontecer.");
        }

        const desktop: FullDesktopData = {
            id: desktopDoc.id,
            ...(desktopDoc.data() as DesktopData)
        };

        return desktop;

    } catch (error) {
        console.error("Erro ao criar desktop:", error);
        throw error;
    }
};


export const getDesktopsByOwner = async (ownerId: string): Promise<FullDesktopData[]> => {
    try {
        const q = query(collection(db, "desktops"), where("ownerId", "==", ownerId));

        const querySnapshot = await getDocs(q);

        const desktops: FullDesktopData[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as FullDesktopData[];

        return desktops;

    } catch (error) {
        console.error("Erro ao buscar desktops:", error);
        throw error;
    }
};

export const getDesktopById = async (desktopId: string): Promise<FullDesktopData> => {
    try {
        const docRef = doc(db, "desktops", desktopId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error("Desktop não encontrado");
        }

        const desktop: FullDesktopData = {
            id: docSnap.id,
            ...(docSnap.data() as DesktopData),
        };

        return desktop;
    } catch (error) {
        console.error("Erro ao buscar desktop:", error);
        throw error;
    }
};

export const getDesktopsByMember = async (memberId: string): Promise<FullDesktopData[]> => {
    try {
        const q = query(collection(db, "desktops"), where("members", "array-contains", memberId));
        const querySnapshot = await getDocs(q);
        const desktops: FullDesktopData[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as FullDesktopData[];
        return desktops;

    } catch (error) {
        console.error("Erro ao buscar desktops:", error);
        throw error;
    }
};


export const updateDesktopBackground = async (desktopId: string, imageURL: string): Promise<FullDesktopData> => {
    try {
        const desktopRef = doc(db, "desktops", desktopId);
        await updateDoc(desktopRef, {
            background: imageURL
        });
        const updatedDoc = await getDoc(desktopRef);

        if (!updatedDoc.exists()) {
            throw new Error("O desktop não foi encontrado após a atualização.");
        }

        const updatedDesktopData: FullDesktopData = {
            id: updatedDoc.id,
            ...updatedDoc.data() as DesktopData
        };

        return updatedDesktopData;

    } catch (error) {
        console.error("Erro ao atualizar o fundo do desktop:", error);
        throw error;
    }
};

export const deleteDesktopById = async (userId: string, desktopId: string) => {
    try {
        const q = query(
            collection(db, "files"),
            where("desktopId", "==", desktopId),
            where("parentId", "==", null),
            where("usersId", "array-contains", userId)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("Nenhum documento encontrado para apagar.");
        } else {
            const batch = writeBatch(db);

            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();
        }

        const docRef = doc(db, "desktops", desktopId);

        await deleteDoc(docRef);

        console.log("Desktop Excluido com sucesso!");

    } catch (error) {
        console.error("Erro ao excluir desktop:", error);
        throw error;
    }
};
