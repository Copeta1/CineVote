import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Scan() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return (
      <View className="flex-1 bg-zinc-950 items-center justify-center">
        <Text className="text-white">Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-zinc-950 items-center justify-center px-6">
        <Ionicons name="camera-outline" size={64} color="#f97316" />
        <Text className="text-white text-2xl font-black mt-4 mb-2 text-center">
          Camera Access
        </Text>
        <Text className="text-zinc-400 text-center mb-8">
          We need camera access to scan QR codes
        </Text>
        <TouchableOpacity
          className="bg-orange-500 w-full py-4 rounded-2xl items-center"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold text-lg">Allow Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-4" onPress={() => router.back()}>
          <Text className="text-zinc-400">Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    router.replace(`/session/waiting?sessionId=${data}`);
  };

  return (
    <View className="flex-1">
      {/* Camera */}
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      {/* Overlay — apsolutno pozicioniran */}
      <View className="absolute inset-0 bg-black/50">
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-2 pt-14 px-6 mb-8"
        >
          <Ionicons name="arrow-back" size={24} color="#f97316" />
          <Text className="text-orange-500 text-xl">Back</Text>
        </TouchableOpacity>

        {/* Scanner frame */}
        <View className="flex-1 items-center justify-center">
          <View className="w-64 h-64 border-2 border-orange-500 rounded-3xl" />
          <Text className="text-white text-center mt-6 text-lg font-semibold">
            Point camera at QR code
          </Text>
        </View>

        {/* Rescan button */}
        {scanned && (
          <TouchableOpacity
            className="mx-6 mb-12 bg-orange-500 py-4 rounded-2xl items-center"
            onPress={() => setScanned(false)}
          >
            <Text className="text-white font-bold text-lg">Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
