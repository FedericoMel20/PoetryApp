import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../config/supabase";
import { AuthContext } from "../context/AuthContext";
import colors from "../theme/colors";

export default function EditProfileScreen({ navigation }: any) {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { user, refreshUser } = auth;

  const initialUsername =
    user?.user_metadata?.username ||
    user?.email?.split("@")[0] ||
    "";

  const [username, setUsername] = useState(initialUsername);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert("Invalid username", "Username cannot be empty.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.updateUser({
        data: { username },
      });

      if (error) {
        throw error;
      }

      // Optional but recommended: refresh user in context
      await refreshUser();

      Alert.alert("Profile updated ✨");
      navigation.goBack();
    } catch (err: any) {
      console.error("Update profile error:", err);
      Alert.alert("Error", err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.accent} />
        </TouchableOpacity>
        <Text style={styles.header}>Edit Profile</Text>
      </View>

      {/* Avatar (placeholder) */}
      <View style={styles.avatarWrapper}>
        <Ionicons name="person-circle" size={100} color={colors.accent} />
        <Text style={styles.avatarHint}>
          Avatar upload coming soon
        </Text>
      </View>

      {/* Username */}
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Your pen name"
        placeholderTextColor="#777"
        autoCapitalize="none"
      />

      {/* Save */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveText}>
          {loading ? "Saving..." : "Save Changes"}
        </Text>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarHint: {
    color: "#888",
    fontSize: 12,
    marginTop: 6,
    fontStyle: "italic",
  },
  label: {
    color: "#C49BFF",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 14,
    color: "#EDE6FF",
    borderWidth: 1,
    borderColor: "rgba(196,155,255,0.4)",
    marginBottom: 30,
  },
  saveBtn: {
    backgroundColor: "#FFD700",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  saveText: {
    color: "#0B0018",
    fontWeight: "800",
    fontSize: 16,
  },
});
