import { useAuth } from "@/hooks/useAuth";
import { useFirestore } from "@/hooks/useFirestore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const GENRES = [
  {
    id: "action",
    label: "Action",
    subtitle: "Adrenaline & Thrills",
    icon: "rocket-outline",
    large: true,
  },
  {
    id: "comedy",
    label: "Comedy",
    subtitle: "Laugh Out Loud",
    icon: "happy-outline",
    large: false,
  },
  {
    id: "scifi",
    label: "Sci-Fi",
    subtitle: "Beyond Imagination",
    icon: "sparkles-outline",
    large: false,
  },
  {
    id: "horror",
    label: "Horror",
    subtitle: "Face Your Fears",
    icon: "skull-outline",
    large: false,
  },
  {
    id: "drama",
    label: "Drama",
    subtitle: "Real Emotions",
    icon: "happy-outline",
    large: false,
  },
  {
    id: "thriller",
    label: "Thriller",
    subtitle: "Edge of Your Seat",
    icon: "eye-outline",
    large: true,
  },
  {
    id: "romance",
    label: "Romance",
    subtitle: "Love Stories",
    icon: "heart-outline",
    large: false,
  },
  {
    id: "animation",
    label: "Animation",
    subtitle: "Animated Worlds",
    icon: "color-palette-outline",
    large: false,
  },
  {
    id: "documentary",
    label: "Documentary",
    subtitle: "Real Stories",
    icon: "film-outline",
    large: false,
  },
  {
    id: "fantasy",
    label: "Fantasy",
    subtitle: "Magical Worlds",
    icon: "planet-outline",
    large: false,
  },
  {
    id: "crime",
    label: "Crime",
    subtitle: "Dark Mysteries",
    icon: "search-outline",
    large: true,
  },
  {
    id: "mystery",
    label: "Mystery",
    subtitle: "Unsolved Secrets",
    icon: "help-outline",
    large: false,
  },
];

const ROWS = [[0], [1, 2], [3, 4], [5], [6, 7], [8, 9], [10], [11]];

function GenreCard({
  genre,
  isSelected,
  onPress,
}: {
  genre: (typeof GENRES)[0];
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 rounded-3xl p-4 h-36 ${
        isSelected ? "bg-orange-500" : "bg-zinc-800"
      }`}
    >
      {isSelected && (
        <Ionicons
          name="checkmark-circle"
          size={24}
          color="white"
          style={{ position: "absolute", top: 12, right: 12 }}
        />
      )}
      <Ionicons
        name={genre.icon as any}
        size={28}
        color={isSelected ? "white" : "#f97316"}
      />
      <View className="absolute bottom-4 left-4">
        <Text className="text-white font-black text-xl uppercase">
          {genre.label}
        </Text>
        <Text
          className={`text-xs uppercase tracking-widest ${
            isSelected ? "text-orange-100" : "text-zinc-500"
          }`}
        >
          {genre.subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Onboarding() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { createUser } = useFirestore();
  const router = useRouter();

  const toggleGenre = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((g) => g !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleNext = async () => {
    if (!user) return;
    try {
      setLoading(true);
      await createUser(user.uid, {
        email: user.email,
        genres: selected,
        onboarded: true,
        createdAt: new Date(),
      });
      router.replace("/(auth)/platforms");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-zinc-900 px-6 py-20">
      <Text className="text-white text-6xl font-black italic mb-1">
        WHAT&apos;S THE{"\n"}
        <Text className="text-orange-500 italic">VIBE</Text>
        <Text className="text-white text-6xl">?</Text>
      </Text>
      <Text className="text-zinc-400 mb-6 text-xl">
        Pick at least 3 genres to help us curate your perfect movie marathon.
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-4 pb-32">
          {ROWS.map((row, rowIndex) => (
            <View key={rowIndex} className="flex-row gap-3">
              {row.map((genreIndex) => {
                const genre = GENRES[genreIndex];
                const isSelected = selected.includes(genre.id);
                return (
                  <GenreCard
                    key={genre.id}
                    genre={genre}
                    isSelected={isSelected}
                    onPress={() => toggleGenre(genre.id)}
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
            selected.length >= 3 ? "bg-orange-500" : "bg-zinc-700"
          }`}
          disabled={selected.length < 3 || loading}
          onPress={handleNext}
        >
          <Text className="text-white font-bold text-lg">
            {selected.length >= 3
              ? `Continue (${selected.length} selected)`
              : "Select at least 3"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
