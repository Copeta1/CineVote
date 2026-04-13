import { db } from "@/config/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useCallback } from "react";

export function useSession() {
  const { user } = useAuth();

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const createSession = useCallback(
    async (filters: { genres: string[]; duration: string; platform: string }) => {
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
    },
    [user],
  );

  const refreshCode = async (sessionId: string) => {
    const newCode = generateCode();
    await updateDoc(doc(db, "sessions", sessionId), {
      code: newCode,
    });
    return newCode;
  };

  const joinSession = async (code: string) => {
    // Implementiramo kasnije
  };

  const updateFilters = async (
    sessionId: string,
    filters: { genres: string[]; duration: string; platform: string },
  ) => {
    await updateDoc(doc(db, "sessions", sessionId), { filters });
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

  return { createSession, updateFilters, refreshCode, joinSession, listenToSession };
}
