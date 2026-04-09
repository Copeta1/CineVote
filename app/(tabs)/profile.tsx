import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/welcome");
  };

  return (
    <View className="flex-1 bg-zinc-950 items-center justify-center">
      <Text className="text-white text-2xl font-bold mb-8">Profile</Text>

      <TouchableOpacity
        onPress={handleLogout}
        className="flex-row items-center gap-2 bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-2xl"
      >
        <Ionicons name="log-out-outline" size={22} color="#f97316" />
        <Text className="text-orange-500 font-semibold text-lg">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
