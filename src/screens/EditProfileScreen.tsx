import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useState } from "react";
import {
  Alert,
  Image,
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

  const pickAvatar = async () => {
    if (!user) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    try {
      setLoading(true);

      const asset = result.assets[0];
      const response = await fetch(asset.uri);
      const blob = await response.blob();

      const ext = asset.uri.split(".").pop() || "jpg";
      const filePath = `${user.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, blob, {
          contentType: blob.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatar_url = data.publicUrl;

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url },
      });

      if (updateError) throw updateError;

      await refreshUser();

      Alert.alert("Avatar updated ✨");
      navigation.goBack();
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      Alert.alert("Error", err.message || "Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

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

      {/* Avatar */}
      <TouchableOpacity onPress={pickAvatar} style={styles.avatarEdit}>
        {user?.user_metadata?.avatar_url ? (
          <Image
            source={{ uri: user.user_metadata.avatar_url }}
            style={styles.avatar}
          />
        ) : (
          <Ionicons name="camera" size={48} color="#FFD700" />
        )}
        <Text style={styles.avatarHint}>Tap to change avatar</Text>
      </TouchableOpacity>

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
  avatarEdit: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  avatarHint: {
    color: "#C6B2FF",
    fontSize: 12,
    marginTop: 6,
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
