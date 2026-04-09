import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [code, setCode] = useState("");

  return (
    <ScrollView className="flex-1 bg-zinc-950">
      <View className="px-6 pt-20 pb-6">
        <View className="mb-6">
          <Text className="text-zinc-400 text-sm uppercase tracking-widest">
            Welcome Back
          </Text>
          <Text className="text-white text-4xl font-black">
            Hi, {user?.displayName ?? "Movie Fan"}!
          </Text>
        </View>

        {/* Start Film Night */}
        <TouchableOpacity
          className="rounded-3xl mb-6 overflow-hidden"
          onPress={() => router.push("/session/create")}
        >
          <LinearGradient
            colors={["#f97316", "#fb923c", "#fdba74"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6 h-44"
          >
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="people" size={18} color="white" />
              <Text className="text-white text-sm font-semibold uppercase tracking-widest">
                Film Night
              </Text>
            </View>
            <Text className="text-white text-3xl font-black italic">
              Start Film Night
            </Text>
            <Text className="text-orange-100 mt-1">
              Create a film night, add your friends
            </Text>

            {/* Play icon */}
            <View className="absolute right-6 top-6 bg-white/20 rounded-full p-4">
              <Ionicons name="play" size={28} color="white" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Join Session */}
        <Text className="text-white text-lg font-semibold mb-3">
          Join a session
        </Text>
        <View className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 flex-row items-center gap-3 mb-8">
          <TextInput
            className="flex-1 text-white text-xl font-bold tracking-widest"
            placeholder="Enter code..."
            placeholderTextColor="#71717a"
            value={code}
            onChangeText={(text) => setCode(text.slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
          />
          <TouchableOpacity onPress={() => router.push("/session/scan")}>
            <Ionicons name="camera-outline" size={26} color="#f97316" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-orange-500 rounded-xl p-3"
            onPress={() => router.push("/session/join")}
          >
            <Ionicons name="arrow-forward" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Last Match */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-xl font-bold">Last Match</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
            <Text className="text-orange-500 text-sm font-semibold uppercase tracking-widest">
              View History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Last Match card — placeholder */}
        <View className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-6">
          <View className="h-48 bg-zinc-800 items-center justify-center">
            <Ionicons name="film-outline" size={48} color="#9CA3AF" />
          </View>
          <View className="p-4">
            <Text className="text-zinc-400 text-center">
              No matches yet. Start a film night!
            </Text>
          </View>
        </View>

        {/* Banner Ad */}
        <View className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 flex-row items-center gap-3">
          <View className="bg-zinc-700 rounded-full p-2">
            <Ionicons name="megaphone-outline" size={18} color="#9CA3AF" />
          </View>
          <Text className="text-zinc-400 text-sm flex-1">Sponsored</Text>
          <TouchableOpacity>
            <Ionicons name="close" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
