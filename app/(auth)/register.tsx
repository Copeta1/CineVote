import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await register(email, password);
      router.replace("/(auth)/onboarding");
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
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
              Create account
            </Text>
            <Text className="text-zinc-400 mb-8">
              Join CineVote and start watching
            </Text>

            {/* Form */}
            <View className="gap-4">
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#9CA3AF"
                className="bg-zinc-900 text-white px-4 py-4 rounded-2xl border border-zinc-800"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="#9CA3AF"
                className="bg-zinc-900 text-white px-4 py-4 rounded-2xl border border-zinc-800"
                value={lastName}
                onChangeText={setLastName}
              />
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
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                className="bg-zinc-900 text-white px-4 py-4 rounded-2xl border border-zinc-800"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {/* Button */}
            <TouchableOpacity
              className="bg-orange-500 w-full py-4 rounded-2xl items-center mt-8"
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            {/* Login link */}
            <TouchableOpacity
              className="mt-4 items-center"
              onPress={() => router.push("/(auth)/login")}
            >
              <Text className="text-zinc-400">
                Already have an account?{" "}
                <Text className="text-orange-500 font-semibold">Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
