// src/screens/ProfileScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getPoemsByAuthor } from "../api/poems";
import PoemCard from "../components/PoemCard";
import { AuthContext } from "../context/AuthContext";
import { ProfileStackParamList } from "../navigation/ProfileStackNavigator";
import colors from "../theme/colors";

export default function ProfileScreen() {
  const auth = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!auth?.user) {
      Alert.alert(
        "Sign In Required",
        "You must be signed in to view your profile",
        [
          {
            text: "Sign In",
            onPress: () => navigation.navigate("ProfileMain"),
          },
          { text: "Cancel", onPress: () => navigation.goBack() },
        ]
      );
    }
  }, [auth?.user, navigation]);

  if (!auth) return null;

  const { user, signOut, refreshUser } = auth;

  const [username, setUsername] = useState(
    user?.user_metadata?.username || user?.email?.split("@")[0] || "Verse_Weaver"
  );

  const [myPoems, setMyPoems] = useState<any[]>([]);
  const [loadingPoems, setLoadingPoems] = useState(true);

  // Update username when user metadata changes
  useEffect(() => {
    setUsername(
      user?.user_metadata?.username || user?.email?.split("@")[0] || "Verse_Weaver"
    );
  }, [user]);

  // Refresh user data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshUser().catch(err => console.error("Failed to refresh user:", err));
    }, [refreshUser])
  );

  useEffect(() => {
    let mounted = true;

    async function fetchMyPoems() {
      if (!user?.id) return setLoadingPoems(false);

      try {
        const data = await getPoemsByAuthor(user.id);
        if (!mounted) return;
        setMyPoems(data || []);
      } catch (err) {
        console.error("Failed to load user's poems:", err);
      } finally {
        if (mounted) setLoadingPoems(false);
      }
    }

    fetchMyPoems();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Profile screen no longer exposes edit/delete — ManagePoems handles that.

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.header}>AUTHOR’S SANCTUARY</Text>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
            {user?.user_metadata?.avatar_url ? (
              <Image
                source={{ uri: user.user_metadata.avatar_url }}
                style={styles.avatar}
              />
            ) : (
              <Ionicons name="person-circle" size={96} color={colors.accent} />
            )}
          </TouchableOpacity>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.subtitle}>Poet • Dreamer • Storyteller</Text>
        </View>

        {/* Account Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Details</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.outlineText}>Update Profile</Text>
          </TouchableOpacity>
        </View>

        {/* My Poems */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Poems</Text>

          {loadingPoems ? (
            <Text style={styles.emptyText}>Loading your poems…</Text>
          ) : myPoems.length === 0 ? (
            <Text style={styles.emptyText}>You haven't written any poems yet.</Text>
          ) : (
            <FlatList
              data={myPoems}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: any) => String(item.id || item._id || item.title)}
              renderItem={({ item }) => (
                <PoemCard
                  title={item.title || "Untitled"}
                  author={username}
                  image={item.image || null}
                  rating={typeof item.rating === "number" ? item.rating : undefined}
                  commentCount={item.comments_count ?? item.comment_count ?? item.comments?.length}
                  onPress={() => navigation.navigate("PoemDetail", { poem: item })}
                />
              )}
              contentContainerStyle={{ paddingVertical: 6 }}
            />
          )}

          <TouchableOpacity style={styles.manageBtn} onPress={() => navigation.navigate("ManagePoems")}>
            <Ionicons name="add-circle" size={18} color="#FFD700" />
            <Text style={styles.manageText}>Manage All Poems</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0018",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    color: colors.accent,
    textAlign: "center",
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: 20,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  username: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
  },
  subtitle: {
    color: "#C6B2FF",
    fontSize: 12,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(196,155,255,0.4)",
    marginBottom: 25,
  },
  cardTitle: {
    color: "#C49BFF",
    fontWeight: "600",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    color: "#AAA",
  },
  value: {
    color: "#EDE6FF",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#FFD700",
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  outlineText: {
    color: "#FFD700",
    fontWeight: "600",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: "#C49BFF",
    fontSize: 16,
    marginBottom: 10,
  },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
  },
  manageBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },
  manageText: {
    color: "#FFD700",
    fontWeight: "600",
  },
  logoutBtn: {
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#C49BFF",
    borderRadius: 24,
  },
  logoutText: {
    color: "#FF6B6B",
  },
});
