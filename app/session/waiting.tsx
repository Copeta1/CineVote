import { useSession } from "@/hooks/useSession";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Waiting() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { listenToSession } = useSession();
  const [members, setMembers] = useState<any[]>([]);
  const [hostName, setHostName] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    const unsub = listenToSession(sessionId, (data) => {
      setMembers(data.members);
      setHostName(data.hostName);

      if (data.status === "swiping") {
        router.replace(`/session/swipe?sessionId=${sessionId}`);
      }
    });

    return unsub;
  }, [sessionId]);

  return (
    <View className="flex-1 bg-zinc-950 px-6 pt-14 items-center justify-center">
      {/* Animated waiting indicator */}
      <View className="bg-zinc-900 border border-zinc-800 rounded-full p-8 mb-8">
        <Ionicons name="film" size={48} color="#f97316" />
      </View>

      <Text className="text-white text-3xl font-black mb-2 text-center">
        Waiting for host...
      </Text>
      <Text className="text-zinc-400 text-center mb-12">
        {hostName} will start the session soon
      </Text>

      {/* Members */}
      <View className="w-full gap-3">
        {members.map((member, index) => (
          <View
            key={index}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 flex-row items-center gap-3"
          >
            <View className="bg-zinc-700 rounded-full w-10 h-10 items-center justify-center">
              <Ionicons name="person" size={18} color="#f97316" />
            </View>
            <Text className="text-white font-bold flex-1">{member.name}</Text>
            {member.isHost && (
              <View className="bg-orange-500 rounded-full px-2 py-1">
                <Text className="text-white text-xs font-bold">HOST</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
