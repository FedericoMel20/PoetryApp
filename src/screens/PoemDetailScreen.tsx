import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { addComment, deleteComment, getComments } from "../api/comments";
import { supabase } from "../config/supabase";
import { AuthContext } from "../context/AuthContext";
import colors from "../theme/colors";

type Comment = {
  id?: number;
  user: string;
  text: string;
  rating?: number;
  user_id?: string;
  avatar_url?: string | null;
};

export default function PoemDetailScreen({ route }: any) {
  const { poem } = route.params;
  const auth = useContext(AuthContext);

  // Determine author name - use current username if it's the user's own poem
  const authorName = 
    poem.author_id && auth?.user?.id && poem.author_id === auth.user.id
      ? (auth.user.user_metadata?.username || auth.user.email?.split("@")[0] || "Anonymous")
      : (poem.author || "Anonymous");

  const [comments, setComments] = useState<Comment[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tempRating, setTempRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [scaleAnim] = useState(new Animated.Value(1));

  const loadComments = useCallback(async () => {
    try {
      const data = await getComments(poem.id);
      setComments(data);
    } catch (e) {
      console.error("Failed to load comments", e);
    }
  }, [poem.id]);

  // Load favorite status on mount
  useEffect(() => {
    checkIfFavorite();
  }, []);

  useEffect(() => {
    loadComments();

    const channel = supabase
      .channel(`comments:${poem.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `poem_id=eq.${poem.id}`,
        },
        () => {
          loadComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [poem.id, loadComments]);

  const checkIfFavorite = async () => {
    try {
      const stored = await AsyncStorage.getItem("@favorites");
      const favorites = stored ? JSON.parse(stored) : [];
      const exists = favorites.some((p: any) => p.id === poem.id);
      setIsFavorite(exists);
    } catch (e) {
      console.error("Error checking favorites:", e);
    }
  };

  const toggleFavorite = async () => {
    try {
      const stored = await AsyncStorage.getItem("@favorites");
      const favorites = stored ? JSON.parse(stored) : [];

      const exists = favorites.some((p: any) => p.id === poem.id);
      let updated;

      if (exists) {
        updated = favorites.filter((p: any) => p.id !== poem.id);
      } else {
        updated = [...favorites, poem];
      }

      await AsyncStorage.setItem("@favorites", JSON.stringify(updated));

      setIsFavorite(!exists);

      
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (e) {
      console.error("Error toggling favorite:", e);
    }
  };

  const handleSubmitRating = async () => {
    if (!tempRating && !reviewText.trim()) return;

    try {
      await addComment(poem.id, reviewText.trim(), tempRating);
      await loadComments();

      setShowModal(false);
      setTempRating(0);
      setReviewText("");
    } catch {
      Alert.alert("Error", "Failed to submit review");
    }
  };

  const handleDeleteComment = async (commentId?: number, userId?: string) => {
    if (!commentId) return;
    if (!auth?.user?.id || auth.user.id !== userId) return;

    Alert.alert("Delete comment", "Delete your comment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteComment(commentId);
            await loadComments();
          } catch {
            Alert.alert("Error", "Failed to delete comment");
          }
        },
      },
    ]);
  };

  return (
    <ImageBackground
      source={{ uri: poem.image }}
      style={styles.background}
      imageStyle={{ opacity: 0.25 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>{poem.title}</Text>
            <Text style={styles.author}>by {authorName}</Text>

            {/* 💛 Favorite Icon */}
            <Animated.View style={[styles.favoriteIcon, { transform: [{ scale: scaleAnim }] }]}>
              <TouchableOpacity onPress={toggleFavorite}>
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={30}
                  color={isFavorite ? colors.accent : "#ccc"}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Rating Row */}
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color={colors.accent} />
            <Text style={styles.ratingText}>
              {(() => {
                const ratings = comments.filter(
                  (c) => typeof c.rating === "number" && c.rating > 0
                );
                const avgRating = ratings.length
                  ? ratings.reduce((s, c) => s + (c.rating || 0), 0) / ratings.length
                  : 0;
                return `${avgRating.toFixed(1)} / 5`;
              })()}
            </Text>
          </View>

          {/* Rate Button */}
          <TouchableOpacity style={styles.rateButton} onPress={() => setShowModal(true)}>
            <Ionicons name="star-outline" size={18} color="#FFD700" />
            <Text style={styles.rateText}>Rate this Poem</Text>
          </TouchableOpacity>

          {/* Poem Content */}
          <View style={styles.poemContainer}>
            <Text style={styles.poemContent}>{poem.content}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Comments Section */}
          <Text style={styles.commentHeader}>
            💬 Community Whispers ({comments.length})
          </Text>

          {comments.map((c: Comment, i: number) => {
            const hasRating = typeof c.rating === "number" && c.rating > 0;
            const rating = Math.max(0, Math.min(5, c.rating ?? 0));

            return (
              <TouchableOpacity
                key={c.id ?? i}
                style={styles.commentCard}
                activeOpacity={0.85}
                onLongPress={() => handleDeleteComment(c.id, c.user_id)}
              >
                {c.avatar_url ? (
                  <Image
                    source={{ uri: c.avatar_url }}
                    style={styles.commentAvatar}
                  />
                ) : (
                  <Ionicons name="person-circle" size={40} color="#aaa" />
                )}
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.commentUser}>{c.user}</Text>

                  {hasRating && (
                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Ionicons
                          key={idx}
                          name={idx < rating ? "star" : "star-outline"}
                          size={12}
                          color={colors.accent}
                        />
                      ))}
                      <Text style={{ color: colors.secondaryText, marginLeft: 8, fontSize: 12 }}>
                        {rating}/5
                      </Text>
                    </View>
                  )}

                  <Text style={styles.commentText}>{c.text}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 🌟 Rating Modal */}
      <Modal
        visible={showModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Rate this Poem</Text>

            {/* Star Selection */}
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setTempRating(star)}>
                  <Ionicons
                    name={star <= tempRating ? "star" : "star-outline"}
                    size={30}
                    color={star <= tempRating ? "#FFD700" : "#999"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Review Text */}
            <TextInput
              style={styles.modalInput}
              placeholder="Write your review..."
              placeholderTextColor="#ccc"
              multiline
              value={reviewText}
              onChangeText={setReviewText}
            />

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.cancelButton}>
                <Text style={{ color: "#ccc" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmitRating} style={styles.submitButton}>
                <Text style={{ color: "#000", fontWeight: "bold" }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: colors.background },
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 80 },
  header: { alignItems: "center", marginTop: 30, position: "relative" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    fontFamily: "serif",
  },
  author: { color: colors.text, fontSize: 16, marginTop: 6, fontStyle: "italic" },
  favoriteIcon: { position: "absolute", right: 0, top: 0, padding: 10 },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  ratingText: { color: "#EAEAEA", fontSize: 16, marginLeft: 6, fontWeight: "500" },
  rateButton: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  rateText: { color: "#FFD700", marginLeft: 6, fontSize: 14, fontWeight: "500" },
  poemContainer: { marginTop: 20, paddingHorizontal: 10 },
  poemContent: {
    color: "#DDD",
    fontSize: 18,
    fontStyle: "italic",
    lineHeight: 28,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 25,
  },
  commentHeader: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentUser: { color: "#FFD700", fontWeight: "600", fontSize: 13 },
  commentText: { color: colors.text, fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 20,
    width: "85%",
    shadowColor: "#FFD700",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  modalInput: {
    backgroundColor: "#222",
    color: "#FFF",
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
    minHeight: 70,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelButton: {
    padding: 10,
  },
  submitButton: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
});
