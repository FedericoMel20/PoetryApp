// src/screens/ProfileScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
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

  if (!auth) return null;

  const { user, signOut } = auth;

  const username =
    user?.user_metadata?.username || user?.email?.split("@")[0] || "Verse_Weaver";

  const [myPoems, setMyPoems] = useState<any[]>([]);
  const [loadingPoems, setLoadingPoems] = useState(true);

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
      {/* Header */}
      <Text style={styles.header}>AUTHOR’S SANCTUARY</Text>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Ionicons name="person-circle" size={96} color={colors.accent} />
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

        <TouchableOpacity style={styles.outlineButton}>
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

      {/* Premium */}
      <TouchableOpacity style={styles.premiumBtn}>
        <Text style={styles.premiumText}>GO PREMIUM</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0018",
    padding: 20,
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
  },
  logoutText: {
    color: "#FF6B6B",
  },
  premiumBtn: {
    backgroundColor: "#FFD700",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOpacity: 0.6,
    shadowRadius: 14,
  },
  premiumText: {
    color: "#0B0018",
    fontWeight: "800",
    fontSize: 16,
  },
});
