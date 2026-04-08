import { useRouter } from "expo-router";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

export default function Welcome() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/welcome-bg.jpg")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/60 items-center justify-between px-6 py-12">
        {/* Logo */}
        <Text className="text-orange-500 text-3xl font-bold tracking-widest pt-6">
          CINEVOTE
        </Text>

        {/* Center content */}
        <View className="items-center gap-4 pb-40">
          <Text className="text-white text-6xl font-bold text-center leading-tight">
            Stop scrolling.{"\n"}
            <Text className="text-orange-500">Start watching.</Text>
          </Text>
          <Text className="text-gray-400 text-center text-base mt-2">
            Swipe, match and decide what to watch — together!
          </Text>
        </View>

        {/* Bottom buttons */}
        <View className="w-full gap-4">
          <TouchableOpacity
            className="bg-orange-500 w-full py-4 rounded-2xl items-center"
            onPress={() => router.push("/(auth)/register")}
          >
            <Text className="text-white font-bold text-lg">Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full py-4 rounded-2xl items-center border border-gray-800"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-white font-semibold text-lg">
              I have an account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
