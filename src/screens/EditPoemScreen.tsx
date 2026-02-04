import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { updatePoem } from "../api/poems";

export default function EditPoemScreen({ route, navigation }: any) {
  const { poem } = route.params;

  const [title, setTitle] = useState(poem?.title || "");
  const [content, setContent] = useState(poem?.content || "");
  const [category, setCategory] = useState(poem?.category || "");
  const [image, setImage] = useState(poem?.image || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Missing fields", "Title and content are required.");
      return;
    }

    setLoading(true);
    try {
      await updatePoem(poem.id, { title, content, category, image });
      Alert.alert("Saved", "Poem updated.");
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

      <Text style={styles.label}>Poem</Text>
      <TextInput style={[styles.input, styles.textArea]} multiline value={content} onChangeText={setContent} />

      <Text style={styles.label}>Category</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} />

      <Text style={styles.label}>Image URL</Text>
      <TextInput style={styles.input} value={image} onChangeText={setImage} />

      <TouchableOpacity style={styles.publishButton} onPress={handleSave} disabled={loading}>
        <Text style={styles.publishText}>{loading ? "Saving..." : "Save Changes"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0018', padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backBtn: { padding: 6, marginRight: 8 },
  editTitle: { color: '#C49BFF', fontSize: 18, fontWeight: '700' },
  label: { color: '#C49BFF', fontSize: 14, marginTop: 16 },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, color: '#EDE6FF', borderWidth: 1, borderColor: 'rgba(196,155,255,0.4)', marginTop: 8 },
  textArea: { height: 160, textAlignVertical: 'top' },
  publishButton: { marginTop: 24, backgroundColor: '#FFD700', paddingVertical: 14, borderRadius: 25, alignItems: 'center' },
  publishText: { color: '#0B0018', fontWeight: '700' },
});
