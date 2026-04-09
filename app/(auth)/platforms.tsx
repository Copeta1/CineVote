import { useAuth } from "@/hooks/useAuth";
import { useFirestore } from "@/hooks/useFirestore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const PLATFORMS = [
  {
    id: "netflix",
    label: "Netflix",
    color: "#E50914",
    logo: require("../../assets/icons/netflix.png"),
  },
  {
    id: "hbo",
    label: "HBO Max",
    color: "#6B2D8B",
    logo: require("../../assets/icons/hbo.png"),
  },
  {
    id: "disney",
    label: "Disney+",
    color: "#0063E5",
    logo: require("../../assets/icons/disney.png"),
  },
  {
    id: "prime",
    label: "Prime Video",
    color: "#00A8E1",
    logo: require("../../assets/icons/prime.png"),
  },
  {
    id: "appletv",
    label: "Apple+",
    color: "#555555",
    logo: require("../../assets/icons/apple.png"),
  },
  {
    id: "paramount",
    label: "Paramount+",
    color: "#0064FF",
    logo: require("../../assets/icons/paramount.png"),
  },
  {
    id: "peacock",
    label: "Peacock",
    color: "#F47521",
    logo: require("../../assets/icons/peacock.png"),
  },
  {
    id: "hulu",
    label: "Hulu",
    color: "#1A1A2E",
    logo: require("../../assets/icons/hulu.png"),
  },
];

function PlatformCard({
  platform,
  isSelected,
  onPress,
}: {
  platform: (typeof PLATFORMS)[0];
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 aspect-square rounded-3xl p-4 items-center justify-center ${
        isSelected ? "bg-orange-500" : "bg-zinc-800"
      }`}
    >
      {isSelected && (
        <Ionicons
          name="checkmark-circle"
          size={22}
          color="white"
          style={{ position: "absolute", top: 12, right: 12 }}
        />
      )}
      <Image
        source={platform.logo}
        className="w-16 h-16"
        resizeMode="contain"
      />
      <Text className="text-white font-black text-base uppercase mt-2">
        {platform.label}
      </Text>
    </TouchableOpacity>
  );
}

const ROWS = [
  [0, 1],
  [2, 3],
  [4, 5],
  [6, 7],
];

export default function Platforms() {
  const router = useRouter();
  const { user } = useAuth();
  const { createUser } = useFirestore();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const togglePlatform = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((p) => p !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleNext = async () => {
    if (!user) return;
    try {
      setLoading(true);
      await createUser(user.uid, {
        platforms: selected,
        onboarded: true,
      });
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-zinc-900 px-6 py-20">
      <Text className="text-white text-6xl font-black mb-1">
        Where do we{"\n"}
        <Text className="text-orange-500 italic">WATCH?</Text>
      </Text>
      <Text className="text-zinc-400 mb-6 text-xl">
        Select your streaming platforms so we can find the right movies for you.
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-4 pb-32">
          {ROWS.map((row, rowIndex) => (
            <View key={rowIndex} className="flex-row gap-3">
              {row.map((platformIndex) => {
                const platform = PLATFORMS[platformIndex];
                const isSelected = selected.includes(platform.id);
                return (
                  <PlatformCard
                    key={platform.id}
                    platform={platform}
                    isSelected={isSelected}
                    onPress={() => togglePlatform(platform.id)}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="absolute bottom-8 left-6 right-6">
        <TouchableOpacity
          className={`w-full py-4 rounded-2xl items-center ${
            selected.length >= 1 ? "bg-orange-500" : "bg-zinc-700"
          }`}
          disabled={selected.length < 1 || loading}
          onPress={handleNext}
        >
          <Text className="text-white font-bold text-lg">
            {selected.length >= 1
              ? `Continue (${selected.length} selected)`
              : "Select at least 1"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
