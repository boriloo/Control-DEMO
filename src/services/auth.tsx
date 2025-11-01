import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User, UserProfile } from "firebase/auth"
import { BasicFilter, ColorFilter, LoginData, RegisterData } from "../types/auth"
import { auth, db } from "../firebase/config";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where, writeBatch, } from "firebase/firestore";
import { MemberType } from "../types/desktop";
import { GoogleAuthProvider } from "firebase/auth";
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

export const registerUser = async ({ name, email, password }: RegisterData): Promise<UserProfile> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    await updateProfile(newUser, {
      displayName: name,
    });

    await setDoc(doc(db, "users", newUser.uid), {
      name: name,
      email: newUser.email,
      filterDark: 'low',
      filterBlur: 'low',
      filterColor: 'color',
      profileImage: null,
      createdAt: serverTimestamp()
    });

    const userDocRef = doc(db, "users", newUser.uid);
    const userDoc = await getDoc(userDocRef);

    const userProfile: UserProfile = {
      uid: newUser.uid,
      ...userDoc.data() as Omit<User, 'uid'>
    }

    return userProfile;

  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
};



export const loginUser = async ({ email, password }: LoginData): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("Usuário autenticado, mas não possui dados no Firestore.")
    }

    const userProfile: User = {
      uid: user.uid,
      ...userDoc.data() as Omit<User, 'uid'>
    }

    return userProfile;

  } catch (error) {
    console.error("Erro ao entrar", error);
    throw error;
  }
};


export const getUserProfile = async (uid: string): Promise<UserProfile> => {
  const userDocRef = doc(db, "users", uid);

  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    throw new Error("Perfil de utilizador não encontrado no Firestore.");
  }

  const userProfile: UserProfile = {
    uid: uid,
    ...userDoc.data() as Omit<UserProfile, 'uid'>
  };

  return userProfile;
};


export const userWithEmailExists = async (email: string): Promise<boolean> => {

  const emailDoc = await getDoc(doc(db, "emails", email))

  if (!emailDoc.exists()) {
    return false;
  }

  return true;
};


export const updateUserFilters = async (uid: string, filterDark: BasicFilter, filterBlur: BasicFilter, filterColor: ColorFilter): Promise<UserProfile> => {
  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      filterDark: filterDark,
      filterBlur: filterBlur,
      filterColor: filterColor,
    });

    const updatedDoc = await getDoc(userDocRef);

    if (!updatedDoc.exists()) {
      throw new Error("O desktop não foi encontrado após a atualização.");
    }

    const userProfile: UserProfile = {
      uid: uid,
      ...updatedDoc.data() as Omit<UserProfile, 'uid'>
    };


    return userProfile;

  } catch (error) {
    console.error("Erro ao atualizar o fundo do desktop:", error);
    throw error;
  }
};

export const updateUserProfileImage = async (uid: string, imageURL: string): Promise<UserProfile> => {
  try {
    const userRef = doc(db, "users", uid);
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


    const q = query(
      collection(db, "desktops"),
      where("membersId", "array-contains", uid)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const batch = writeBatch(db);

      querySnapshot.forEach((desktopDoc) => {
        const members = desktopDoc.data().members as MemberType[];

        const updatedMembers = members.map(member => {
          if (member.userId === uid) {
            return { ...member, userImage: imageURL };
          }
          return member;
        });

        batch.update(desktopDoc.ref, { members: updatedMembers });
      });

      await batch.commit();
      console.log(`${querySnapshot.size} desktops foram atualizados com a nova imagem.`);
    }

    return updatedUserData;

  } catch (error) {
    console.error("Erro ao atualizar imagem de perfil:", error);
    throw error;
  }
};

export const updateUserName = async (userId: string, userName: string): Promise<UserProfile> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      name: userName
    });
    const updatedDoc = await getDoc(userRef);

    if (!updatedDoc.exists()) {
      throw new Error("O user não foi encontrado após a atualização.");
    }

    const updatedUserData: UserProfile = {
      uid: updatedDoc.id,
      ...updatedDoc.data() as Omit<UserProfile, 'uid'>
    };

    const q = query(
      collection(db, "desktops"),
      where("membersId", "array-contains", userId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const batch = writeBatch(db);

      querySnapshot.forEach((desktopDoc) => {
        const members = desktopDoc.data().members as MemberType[];

        const updatedMembers = members.map(member => {
          if (member.userId === userId) {
            return { ...member, userName: userName };
          }
          return member;
        });

        batch.update(desktopDoc.ref, { members: updatedMembers });
      });

      await batch.commit();
      console.log(`${querySnapshot.size} desktops foram atualizados com a nova imagem.`);
    }

    return updatedUserData;

  } catch (error) {
    console.error("Erro ao atualizar o nome do user:", error);
    throw error;
  }
};