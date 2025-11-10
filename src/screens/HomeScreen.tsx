import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getPoems } from "../api/poems";
import PoemCard from "../components/PoemCard";
import { HomeStackParamList } from "../navigation/HomeStackNavigator"; // ✅ import the stack types

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [poems, setPoems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<any>(null);

  const scrollY = new Animated.Value(0);

  
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPoems();
        setPoems(data);
        const random = data[Math.floor(Math.random() * data.length)];
        setQuote(random);
      } catch (err) {
        console.error("Error fetching poems:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const featured = poems.sort(() => 0.5 - Math.random()).slice(0, 5);

  const bannerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "#C49BFF" }}>Loading whispers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Sticky Header */}
      <View style={styles.headerBar}>
        <Text style={styles.appTitle}>LOUD WHISPERS</Text>
        <TouchableOpacity>
          <Ionicons name="person-circle" size={34} color="#C49BFF" />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Banner */}
        <Animated.View style={[styles.bannerContainer, { opacity: bannerOpacity }]}>
          <Image
            source={require("../assets/images/logo.jpg")}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>The Wandering Prints of a Strange Pen.</Text>

        {/* Whisper of the Day */}
        <TouchableOpacity style={styles.whisperButton}>
          <Ionicons name="sparkles" size={16} color="#FFD700" />
          <Text style={styles.whisperText}> Whisper of the Day</Text>
        </TouchableOpacity>

        {/* Quote of the Night */}
        {quote && (
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>“{quote.content}”</Text>
            <Text style={styles.author}>— {quote.author || "Anonymous"}</Text>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>
                {quote.rating ? quote.rating.toFixed(1) : "4.5"}
              </Text>
              <Ionicons
                name="heart"
                size={16}
                color="#C49BFF"
                style={{ marginLeft: 15 }}
              />
              <Ionicons
                name="share-social"
                size={16}
                color="#C49BFF"
                style={{ marginLeft: 15 }}
              />
            </View>
          </View>
        )}

        {/* Featured Poems */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Poems</Text>
        </View>

        <FlatList
          data={featured}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate("PoemDetail", { poem: item })} // ✅ Navigation works here
            >
              <PoemCard
                title={item.title}
                author={item.author}
                image={{ uri: item.image }}
              />
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 15 }}
        />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0B0018", // Deep violet-black gradient base
  },
  headerBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(10, 0, 25, 0.9)",
    borderBottomWidth: 0.6,
    borderBottomColor: "rgba(196, 155, 255, 0.3)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 10,
  },
  appTitle: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "bold",
    textShadowColor: "#C49BFF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 110,
  },
  bannerContainer: {
    width: width,
    height: 190,
    marginLeft: -20,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  subtitle: {
    color: "#C6B2FF",
    fontStyle: "italic",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
  },
  whisperButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(196,155,255,0.15)",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(196,155,255,0.4)",
    marginBottom: 20,
  },
  whisperText: {
    color: "#FFD700",
    fontWeight: "600",
    fontSize: 15,
  },
  quoteCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "rgba(196,155,255,0.5)",
    shadowColor: "#C49BFF",
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  quoteText: {
    color: "#EDE6FF",
    fontStyle: "italic",
    fontSize: 15,
    marginBottom: 10,
    lineHeight: 22,
  },
  author: {
    color: "#C6B2FF",
    textAlign: "right",
    fontSize: 13,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  ratingText: {
    color: "#EAEAEA",
    marginLeft: 5,
    fontSize: 13,
  },
  sectionHeader: {
    marginTop: 15,
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#C49BFF",
    fontWeight: "600",
    fontSize: 17,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B0018",
  },
});
