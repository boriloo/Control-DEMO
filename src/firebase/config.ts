

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_DB_URL,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);


// PARA USAR EMULADORES AO INVÉS DO AR

// if (import.meta.env.DEV) {
//     try {
//         console.log("Modo de desenvolvimento. Conectando aos emuladores do Firebase...");

//         connectFirestoreEmulator(db, '127.0.0.1', 8080);
//         connectAuthEmulator(auth, 'http://127.0.0.1:9099');

//         console.log("Conectado ao Firestore e Auth emulados.");
//     } catch (error) {
//         console.error("Erro ao conectar aos emuladores:", error);
//     }
// }
