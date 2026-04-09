import { useAuth } from "@/hooks/useAuth";
import { useFirestore } from "@/hooks/useFirestore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { getUser } = useFirestore();

  useEffect(() => {
    if (loading) return;

    if (user) {
      getUser(user.uid).then((userData) => {
        if (userData?.onboarded) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/(auth)/onboarding");
        }
      });
    } else {
      router.replace("/(auth)/welcome");
    }
  }, [user, loading]);

  return (
    <View className="flex-1 items-center justify-center bg-[#121212]">
      <ActivityIndicator size="large" color="#F97316" />
    </View>
  );
}
