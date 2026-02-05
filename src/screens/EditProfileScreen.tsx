import { Ionicons } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useEffect, useRef, useState } from "react";
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
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (!auth) return null;

  const { user, refreshUser } = auth;

  const initialUsername =
    user?.user_metadata?.username ||
    user?.email?.split("@")[0] ||
    "";

  const [username, setUsername] = useState(initialUsername);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingUsername, setLoadingUsername] = useState(false);

  const goBackSafely = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("ProfileMain");
    }
  };

  const pickAvatar = async () => {
    if (!user || loadingAvatar) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (result.canceled || !result.assets?.length) return;

    const file = result.assets[0];

    if (!file.base64) {
      Alert.alert("Error", "Image data unavailable");
      return;
    }

    try {
      if (isMounted.current) setLoadingAvatar(true);

      const ext = file.uri?.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `${user.id}.${ext}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, decode(file.base64), {
          contentType: `image/${ext}`,
          upsert: true,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl },
      });

      if (updateError) throw updateError;

      await refreshUser();
      Alert.alert("Avatar updated ✨");
    } catch (e: any) {
      console.error("Avatar upload error:", e);
      Alert.alert(
        "Upload failed",
        typeof e === "string" ? e : e?.message || "Please try again"
      );
    } finally {
      if (isMounted.current) {
        setLoadingAvatar(false);
      }
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert("Missing field", "Username cannot be empty");
      return;
    }

    try {
      if (isMounted.current) setLoadingUsername(true);

      const { error } = await supabase.auth.updateUser({
        data: { username },
      });

      if (error) throw error;

      await refreshUser();
      Alert.alert("Profile updated ✨");
      goBackSafely();
    } catch (e: any) {
      console.error("Update profile error:", e);
      Alert.alert(
        "Error",
        typeof e === "string" ? e : e?.message || "Failed to update profile"
      );
    } finally {
      if (isMounted.current) {
        setLoadingUsername(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={goBackSafely}>
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
        disabled={loadingUsername}
      >
        <Text style={styles.saveText}>
          {loadingUsername ? "Saving..." : "Save Changes"}
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
