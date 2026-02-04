import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { deletePoem, getPoemsByAuthor } from "../api/poems";
import PoemCard from "../components/PoemCard";
import { AuthContext } from "../context/AuthContext";
import { ProfileStackParamList } from "../navigation/ProfileStackNavigator";
import colors from "../theme/colors";

export default function ManagePoemsScreen() {
  const auth = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const [poems, setPoems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!auth?.user?.id) return setLoading(false);
      try {
        const data = await getPoemsByAuthor(auth.user.id);
        if (!mounted) return;
        setPoems(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [auth]);

  const confirmDelete = (id: number) => {
    Alert.alert("Delete Poem", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePoem(id);
            setPoems((p) => p.filter((x) => x.id !== id));
          } catch (err) {
            Alert.alert("Error", "Failed to delete poem");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <PoemCard
        title={item.title}
        author={item.author || "Anonymous"}
        image={item.image}
        onPress={() => navigation.navigate("PoemDetail", { poem: item })}
      />

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => navigation.navigate("EditPoem", { poem: item })} style={styles.actionBtn}>
          <Ionicons name="pencil" size={18} color={colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.actionBtn}>
          <Ionicons name="trash" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return (
    <View style={styles.loader}><ActivityIndicator /></View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Your Poems</Text>

      {poems.length === 0 ? (
        <Text style={styles.empty}>You haven't published any poems yet.</Text>
      ) : (
        <FlatList
          data={poems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("CreatePoem")}> 
        <Ionicons name="add" size={28} color="#0B0018" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { color: colors.accent, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  empty: { color: '#AAA', fontStyle: 'italic' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'space-between' },
  actions: { flexDirection: 'row', marginLeft: 12 },
  actionBtn: { padding: 8, marginLeft: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)' },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#C49BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#C49BFF",
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 10,
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
