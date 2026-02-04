import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { updatePoem } from "../api/poems";


const CATEGORIES = [
  "Love",
  "Melancholy",
  "Night",
  "Dreams",
  "Happy",
  "Comfort",
  "Quotes",
];

export default function EditPoemScreen({ route, navigation }: any) {
  const { poem } = route.params;

  const [title, setTitle] = useState(poem.title || "");
  const [content, setContent] = useState(poem.content || "");
  const [category, setCategory] = useState(poem.category || CATEGORIES[0]);
  const [image, setImage] = useState(poem.image || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Missing fields", "Title and content are required.");
      return;
    }

    setLoading(true);
    try {
      await updatePoem(poem.id, { title, content, category, image });
      Alert.alert("Updated ✨", "Your poem has been revised.");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to update poem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#C49BFF" />
        </TouchableOpacity>
        <Text style={styles.editTitle}>Edit Poem</Text>
      </View>

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={category} onValueChange={setCategory}>
          {CATEGORIES.map((c) => (
            <Picker.Item key={c} label={c} value={c} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Poem</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        value={content}
        onChangeText={setContent}
      />

      <Text style={styles.label}>Image URL</Text>
      <TextInput style={styles.input} value={image} onChangeText={setImage} />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveText}>{loading ? "Saving..." : "Save Changes"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0018", padding: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  backBtn: { padding: 6, marginRight: 8 },
  editTitle: { color: "#C49BFF", fontSize: 18, fontWeight: "700" },
  label: { color: "#C49BFF", fontSize: 14, marginTop: 16 },
  input: { backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 12, color: "#EDE6FF", borderWidth: 1, borderColor: "rgba(196,155,255,0.4)", marginTop: 8 },
  textArea: { height: 160, textAlignVertical: "top" },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "rgba(196,155,255,0.4)",
    borderRadius: 12,
    marginTop: 8,
  },
  saveBtn: {
    marginTop: 30,
    backgroundColor: "#FFD700",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  saveText: {
    color: "#0B0018",
    fontWeight: "800",
    fontSize: 16,
  },
});
