import { db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function useFirestore() {
  const createUser = async (userId: string, data: object) => {
    await setDoc(doc(db, "users", userId), data, { merge: true });
  };

  const getUser = async (userId: string) => {
    const docSnap = await getDoc(doc(db, "users", userId));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  };

  return { createUser, getUser };
}
