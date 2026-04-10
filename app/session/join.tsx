import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Join() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-zinc-950 px-6 pt-14">
      <TouchableOpacity
        onPress={() => router.back()}
        className="flex-row items-center gap-2 mb-8"
      >
        <Ionicons name="arrow-back" size={24} color="#f97316" />
        <Text className="text-orange-500 text-xl">Back</Text>
      </TouchableOpacity>

      <Text className="text-white text-4xl font-black mb-2">Join Session</Text>
      <Text className="text-zinc-400 text-lg">Coming soon...</Text>
    </View>
  );
}
