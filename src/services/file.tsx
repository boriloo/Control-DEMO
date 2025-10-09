import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, Unsubscribe, updateDoc, where } from "firebase/firestore";
import { FileData } from "../types/file";
import { db } from "../firebase/config";

export type FullFileData = FileData & { id: string };

export const createFile = async (data: FileData): Promise<FullFileData> => {
    try {
        const filePayload: any = {
            desktopId: data.desktopId,
            parentId: data.parentId,
            ownerId: data.ownerId,
            usersId: data.usersId,
            name: data.name,
            type: data.type,
            position: data.position,
            path: data.path,
            createdAt: serverTimestamp()
        };

        if (data.content !== undefined) {
            filePayload.content = data.content;
        }
        if (data.url !== undefined) {
            filePayload.url = data.url;
        }
        if (data.imageUrl !== undefined) {
            filePayload.imageUrl = data.imageUrl;
        }
        if (data.extension !== undefined) {
            filePayload.extension = data.extension;
        }
        if (data.sizeInBytes !== undefined) {
            filePayload.sizeInBytes = data.sizeInBytes;
        }

        const newDocRef = await addDoc(collection(db, "files"), filePayload);
        const fileDoc = await getDoc(newDocRef);

        if (!fileDoc.exists()) {
            throw new Error("Documento não encontrado após a criação, o que não deveria acontecer.");
        }

        const file: FullFileData = {
            id: fileDoc.id,
            ...(fileDoc.data() as FileData)
        };

        return file;

    } catch (error) {
        console.error("Erro ao criar arquivo:", error);
        throw error;
    }
};

export const getFilesByDesktop = async (userId: string, desktopId: string): Promise<FullFileData[]> => {
    try {
        const q = query(
            collection(db, "files"),
            where("desktopId", "==", desktopId),
            where("parentId", "==", null),
            where("usersId", "array-contains", userId)
        );

        const querySnapshot = await getDocs(q);

        const files: FullFileData[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as FullFileData[];

        return files;

    } catch (error) {
        console.error("Erro ao buscar files:", error);
        throw error;
    }
};

export const listenToFilesByDesktop = (
    userId: string,
    desktopId: string,
    callback: (files: FullFileData[]) => void
): Unsubscribe => {

    const q = query(
        collection(db, "files"),
        where("desktopId", "==", desktopId),
        where("parentId", "==", null),
        where("usersId", "array-contains", userId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const files = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as FullFileData[];

        callback(files);
    });

    return unsubscribe;
};

export const updateFilePosition = async (fileId: string, position: { x: number, y: number }): Promise<FullFileData> => {
    try {
        const fileRef = doc(db, "files", fileId);
        await updateDoc(fileRef, {
            position: position
        })

        const updatedDoc = await getDoc(fileRef);

        if (!updatedDoc.exists()) {
            throw new Error("O desktop não foi encontrado após a atualização.");
        }

        const updatedDesktopData: FullFileData = {
            id: updatedDoc.id,
            ...updatedDoc.data() as FileData
        };

        return updatedDesktopData;

    } catch (err) {
        throw err;
    }
}

