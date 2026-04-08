import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/welcome-bg.jpg")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/70 px-6 py-12">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-2 mb-8 pt-4"
        >
          <Ionicons name="arrow-back" size={24} color="#f97316" />
          <Text className="text-orange-500 text-xl">Back</Text>
        </TouchableOpacity>

        <View className="flex-1 justify-center">
          <Text className="text-white text-4xl font-bold mb-2">
            Welcome back
          </Text>
          <Text className="text-zinc-400 mb-8">
            Sign in to continue watching
          </Text>

          {/* Form */}
          <View className="gap-4">
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              className="bg-zinc-900 text-white px-4 py-4 rounded-2xl border border-zinc-800"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              className="bg-zinc-900 text-white px-4 py-4 rounded-2xl border border-zinc-800"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Forgot password */}
          <TouchableOpacity className="mt-3 items-end">
            <Text className="text-orange-500">Forgot password?</Text>
          </TouchableOpacity>

          {/* Button */}
          <TouchableOpacity
            className="bg-orange-500 w-full py-4 rounded-2xl items-center mt-8"
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Register link */}
          <TouchableOpacity
            className="mt-4 items-center"
            onPress={() => router.push("/(auth)/register")}
          >
            <Text className="text-zinc-400">
              Don&apos;t have an account?{" "}
              <Text className="text-orange-500 font-semibold">Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
