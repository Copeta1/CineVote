import { useAuth } from "@/hooks/useAuth";
import { useSession } from "@/hooks/useSession";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GENRES = [
  "Action",
  "Comedy",
  "Sci-Fi",
  "Horror",
  "Drama",
  "Thriller",
  "Romance",
  "Animation",
];
const DURATIONS = ["Any", "Under 1h", "Under 2h", "Over 2h"];
const PLATFORMS = [
  "Any",
  "Netflix",
  "HBO Max",
  "Disney+",
  "Prime Video",
  "Apple TV+",
];

export default function Create() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    createSession,
    updateFilters,
    listenToSession,
    refreshCode,
    startSwiping,
  } = useSession();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [duration, setDuration] = useState("Any");
  const [platform, setPlatform] = useState("Any");

  useEffect(() => {
    if (!user) return;
    if (sessionId) return;

    const init = async () => {
      try {
        setLoading(true);
        const result = await createSession({
          genres: [],
          duration: "Any",
          platform: "Any",
        });
        if (result) {
          setSessionId(result.sessionId);
          setCode(result.code);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user?.uid]);

  useEffect(() => {
    if (!sessionId) return;
    const unsub = listenToSession(sessionId, (data) => {
      setMembers(data.members);
    });
    return unsub;
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(async () => {
      const newCode = await refreshCode(sessionId);
      setCode(newCode);
    }, 30000);

    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    updateFilters(sessionId, {
      genres: selectedGenres,
      duration,
      platform,
    });
  }, [selectedGenres, duration, platform, sessionId]);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const formatCode = (code: string) => {
    return `${code.slice(0, 3)}-${code.slice(3)}`;
  };

  return (
    <ScrollView className="flex-1 bg-zinc-950">
      <View className="px-6 pt-14 pb-32">
        {/* Back */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-2 mb-8"
        >
          <Ionicons name="arrow-back" size={24} color="#f97316" />
          <Text className="text-orange-500 text-xl">Back</Text>
        </TouchableOpacity>

        {!code ? (
          <View className="flex-1 items-center justify-center pt-32">
            <ActivityIndicator size="large" color="#f97316" />
          </View>
        ) : (
          <>
            {/* Entry Code */}
            <Text className="text-zinc-400 text-sm uppercase tracking-widest text-center mb-2">
              Entry Code
            </Text>
            <Text className="text-white text-6xl font-black text-center mb-6">
              {formatCode(code)}
            </Text>

            {/* QR placeholder */}
            <View className="bg-white rounded-3xl p-4 w-48 h-48 self-center items-center justify-center mb-4">
              <Ionicons name="qr-code" size={140} color="black" />
            </View>

            <Text className="text-zinc-400 text-center mb-8">
              Invite friends to join the session
            </Text>

            {/* The Audience */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-xl font-bold">The Audience</Text>
              <Text className="text-orange-500 font-semibold">
                {members.length} Joined
              </Text>
            </View>

            <View className="gap-3 mb-8">
              {members.map((member, index) => (
                <View
                  key={index}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 flex-row items-center gap-3"
                >
                  <View className="bg-zinc-700 rounded-full w-10 h-10 items-center justify-center">
                    <Ionicons name="person" size={18} color="#f97316" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold">{member.name}</Text>
                    <Text className="text-zinc-400 text-xs uppercase">
                      {member.isHost ? "Host" : "Ready"}
                    </Text>
                  </View>
                  {member.isHost && (
                    <View className="bg-orange-500 rounded-full px-2 py-1">
                      <Text className="text-white text-xs font-bold">HOST</Text>
                    </View>
                  )}
                </View>
              ))}

              {/* Waiting placeholder */}
              <View className="bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl px-4 py-3 flex-row items-center gap-3">
                <View className="bg-zinc-800 rounded-full w-10 h-10 items-center justify-center">
                  <Ionicons
                    name="person-add-outline"
                    size={18}
                    color="#9CA3AF"
                  />
                </View>
                <Text className="text-zinc-500">Waiting...</Text>
              </View>
            </View>

            {/* Vibe Settings */}
            <Text className="text-white text-xl font-bold mb-4">
              Vibe Settings
            </Text>

            <Text className="text-zinc-400 text-sm uppercase tracking-widest mb-2">
              Genres
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {GENRES.map((genre) => (
                <TouchableOpacity
                  key={genre}
                  onPress={() => toggleGenre(genre)}
                  className={`px-4 py-2 rounded-full ${
                    selectedGenres.includes(genre)
                      ? "bg-orange-500"
                      : "bg-zinc-800"
                  }`}
                >
                  <Text className="text-white font-semibold">{genre}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row gap-3 mb-8">
              {/* Duration */}
              <View className="flex-1">
                <Text className="text-zinc-400 text-sm uppercase tracking-widest mb-2">
                  Duration
                </Text>
                <View className="bg-zinc-900 border border-zinc-800 rounded-xl">
                  {DURATIONS.map((d) => (
                    <TouchableOpacity
                      key={d}
                      onPress={() => setDuration(d)}
                      className={`px-4 py-3 ${
                        duration === d ? "bg-orange-500 rounded-xl" : ""
                      }`}
                    >
                      <Text className="text-white">{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Platform */}
              <View className="flex-1">
                <Text className="text-zinc-400 text-sm uppercase tracking-widest mb-2">
                  Platform
                </Text>
                <View className="bg-zinc-900 border border-zinc-800 rounded-xl">
                  {PLATFORMS.map((p) => (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setPlatform(p)}
                      className={`px-4 py-3 ${
                        platform === p ? "bg-orange-500 rounded-xl" : ""
                      }`}
                    >
                      <Text className="text-white">{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Start Swiping button */}
      {code && (
        <View className="absolute bottom-8 left-6 right-6">
          <TouchableOpacity
            className={`w-full py-4 rounded-2xl items-center ${
              members.length >= 2 ? "bg-orange-500" : "bg-zinc-700"
            }`}
            disabled={members.length < 2}
            onPress={async () => {
              if (sessionId) {
                await startSwiping(sessionId);
                router.push(`/session/swipe?sessionId=${sessionId}`);
              }
            }}
          >
            <Text className="text-white font-bold text-lg">
              {members.length >= 2
                ? "Start Swiping"
                : `Waiting for friends... (${members.length}/2)`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
