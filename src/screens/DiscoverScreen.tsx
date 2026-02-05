import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getPoems } from "../api/poems";
import { DiscoverStackParamList } from "../navigation/DiscoverStackNavigator";
import colors from "../theme/colors";

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
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<DiscoverStackParamList>>();

  const fetchPoems = async () => {
    try {
      const data = await getPoems();
      setPoems(data);
    } catch (error) {
      console.error("Failed to fetch poems:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoems();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (!loading) {
        fetchPoems();
      }
    }, [loading])
  );

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPoems();
    setRefreshing(false);
  };

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
    (() => {
      const rating = typeof item.rating === "number" ? item.rating : 0;
      const commentCount =
        item.comments_count ?? item.comment_count ?? item.comments?.length;

      return (
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
            <Text style={styles.ratingText}>
              {rating.toFixed(1)}
              {typeof commentCount === "number" ? ` • ${commentCount} comments` : ""}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
      );
    })()
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      />

      

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("CreatePoem")}
      >
        <Ionicons name="add" size={30} color="#0B0018" />
      </TouchableOpacity>
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
    flexGrow: 0,
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
    alignSelf: "flex-start",
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
  fab: {
    position: "absolute",
    bottom: 30,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#C49BFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#C49BFF",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
});
