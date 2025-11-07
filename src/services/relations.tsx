import { addDoc, collection, getDoc } from "firebase/firestore";
import { RelationData } from "../types/relation";
import { db } from "../firebase/config";


export const createRelation = async (data: RelationData): Promise<RelationData> => {
    try {
        const newRelationRef = await addDoc(collection(db, "relations"), data);
        const relationDoc = await getDoc(newRelationRef);

        if (!relationDoc.exists()) {
            throw new Error("Documento não encontrado após a criação, o que não deveria acontecer.");
        }

        const relation = relationDoc.data() as RelationData;

        return relation;

    } catch (error) {
        console.error("Erro ao criar relação:", error);
        throw error;
    }
};


