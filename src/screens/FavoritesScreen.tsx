import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FavoritesStackParamList } from "../navigation/FavoritesStackNavigator";
import colors from "../theme/colors";

interface Poem {
  id: number;
  title: string;
  author?: string;
  category?: string;
  rating?: number;
  image: string;
  content: string;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Poem[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  const navigation =
    useNavigation<NativeStackNavigationProp<FavoritesStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem("@favorites");
          const saved = jsonValue ? JSON.parse(jsonValue) : [];
          setFavorites(saved);

          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }).start();
        } catch (e) {
          console.error("Error loading favorites:", e);
        }
      };

      loadFavorites();
    }, [])
  );

  const removeFavorite = async (id: number) => {
    Alert.alert("Remove Poem", "Are you sure you want to remove this poem?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const updated = favorites.filter((p) => p.id !== id);
          setFavorites(updated);
          await AsyncStorage.setItem("@favorites", JSON.stringify(updated));
        },
      },
    ]);
  };

  const openPoemDetail = (poem: Poem) => {
    navigation.navigate("PoemDetail", { poem });
  };

  const renderItem = ({ item }: { item: Poem }) => (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <TouchableOpacity
        onPress={() => openPoemDetail(item)}
        activeOpacity={0.9}
        style={{ flex: 1 }}
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
              <Text style={styles.rating}>{item.rating ?? "—"}</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => removeFavorite(item.id)}
      >
        <Ionicons name="heart-dislike" size={20} color={colors.accent} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ImageBackground
      source={require("../assets/images/logo.jpg")}
      style={styles.background}
      imageStyle={{ opacity: 0.12 }} // faint background for aesthetic
    >
      {/* Overlay to ensure contrast */}
      <View style={styles.overlayScreen}>
        <Text style={styles.header}>Your Constellation</Text>
        <Text style={styles.subHeader}>Saved poems twinkle here...</Text>

        {favorites.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="heart-outline" size={80} color={colors.accent} />
            <Text style={styles.emptyText}>No favorites yet...</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  overlayScreen: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // dim layer over logo image
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.accent,
    textAlign: "center",
  },
  subHeader: {
    color: colors.secondaryText,
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
  card: {
    width: "48%",
    height: 210,
    borderRadius: 16,
    marginBottom: 15,
    backgroundColor: "#111",
    overflow: "hidden",
    elevation: 4,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  author: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  rating: {
    color: colors.text,
    marginLeft: 4,
    fontSize: 12,
  },
  removeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    padding: 6,
  },
  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: colors.secondaryText,
    marginTop: 10,
    fontSize: 15,
  },
});
