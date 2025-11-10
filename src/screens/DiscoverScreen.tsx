import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getPoems } from "../api/poems";
import colors from "../theme/colors";
import { RootStackParamList } from "../types/navigation";

// Category options
const categories = [
  "All",
  "Love",
  "Melancholy",
  "Night",
  "Dreams",
  "Happy",
  "Comfort",
  "Quotes",
];

export default function DiscoverScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [poems, setPoems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    async function fetchPoems() {
      const data = await getPoems();
      setPoems(data);
      setLoading(false);
    }
    fetchPoems();
  }, []);

  const filtered =
    selectedCategory === "All"
      ? poems
      : poems.filter((p) => p.category === selectedCategory);

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );

  const renderPoem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("PoemDetail", { poem: item })}

    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.image}
        imageStyle={{ borderRadius: 16 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>{item.title}</Text>
          {item.author && <Text style={styles.author}>by {item.author}</Text>}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.accent} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Category</Text>

      {/* Category Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.activeCategory,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.activeCategoryText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.subHeader}>Best {selectedCategory} Poems</Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPoem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  header: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },
  categoryScroll: {
    marginVertical: 15,
    paddingBottom: 6,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: colors.secondaryText,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 8,
    marginBottom: 3, 
    minHeight: 38,
  },
  activeCategory: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  categoryText: {
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 18,
  },
  activeCategoryText: {
    color: colors.background,
    fontWeight: "600",
  },
  subHeader: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  card: {
    width: "48%",
    height: 200,
    marginBottom: 15,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 10,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "bold",
  },
  author: {
    color: colors.secondaryText,
    fontSize: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    color: colors.text,
    marginLeft: 4,
    fontSize: 12,
  },
});
