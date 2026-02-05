import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { addPoem } from "../api/poems";

const CATEGORIES = [
  "Love",
  "Comfort",
  "Melancholy",
  "Night",
  "Dreams",
  "Happy",
  "Quotes",
];

const RANDOM_IMAGES = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1508830524289-0adcbe822b40",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
  "https://images.unsplash.com/photo-1469474099711-4245088ef525",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1491555103946-3c631c586b8c",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
  "https://images.unsplash.com/photo-1439853949127-fa647821eba0",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
];

export default function CreatePoemScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Missing fields", "Title and content are required.");
      return;
    }

    setLoading(true);

    try {
      await addPoem({
        title,
        content,
        category,
        image:
          image ||
          RANDOM_IMAGES[Math.floor(Math.random() * RANDOM_IMAGES.length)],
      });

      Alert.alert("✨ Published", "Your poem has been released.");
      navigation.goBack();
    } catch {
      Alert.alert("Error", "Failed to publish poem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Whisper a title..."
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={category}
          onValueChange={(v) => setCategory(v)}
          dropdownIconColor="#FFD700"
        >
          {CATEGORIES.map((cat) => (
            <Picker.Item label={cat} value={cat} key={cat} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Poem</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Let the words breathe..."
        placeholderTextColor="#888"
        multiline
        value={content}
        onChangeText={setContent}
      />

      <Text style={styles.label}>Image URL (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Leave empty for a random image"
        placeholderTextColor="#888"
        value={image}
        onChangeText={setImage}
      />

      <TouchableOpacity
        style={styles.publishButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.publishText}>
          {loading ? "Publishing..." : "Publish Poem"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0018",
    padding: 20,
  },
  label: {
    color: "#C49BFF",
    fontSize: 14,
    marginBottom: 6,
    marginTop: 18,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 14,
    color: "#EDE6FF",
    borderWidth: 1,
    borderColor: "rgba(196,155,255,0.4)",
  },
  textArea: {
    height: 160,
    textAlignVertical: "top",
  },
  pickerWrapper: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(196,155,255,0.4)",
    overflow: "hidden",
  },
  publishButton: {
    marginTop: 30,
    backgroundColor: "#FFD700",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  publishText: {
    color: "#0B0018",
    fontWeight: "700",
    fontSize: 16,
  },
});
