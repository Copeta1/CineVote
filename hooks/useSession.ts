import { db } from "@/config/firebase";
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "./useAuth";

const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export function useSession() {
  const { user } = useAuth();
  const createSession = async (filters: {
    genres: string[];
    duration: string;
    platform: string;
  }) => {
    if (!user) return null;

    const code = generateCode();

    const session = await addDoc(collection(db, "sessions"), {
      code,
      hostId: user.uid,
      hostName: user.displayName ?? "Host",
      members: [
        {
          uid: user.uid,
          name: user.displayName ?? "Host",
          ready: true,
          isHost: true,
        },
      ],
      filters,
      status: "waiting",
      createdAt: new Date(),
    });

    return { sessionId: session.id, code };
  };

  const joinSession = async (code: string) => {
    // Implementiramo kasnije
  };

  const listenToSession = (
    sessionId: string,
    callback: (data: any) => void,
  ) => {
    const unsub = onSnapshot(doc(db, "sessions", sessionId), (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() });
      }
    });
    return unsub;
  };

  return { createSession, joinSession, listenToSession };
}
