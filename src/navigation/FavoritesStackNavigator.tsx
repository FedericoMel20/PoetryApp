import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import FavoritesScreen from "../screens/FavoritesScreen";
import PoemDetailScreen from "../screens/PoemDetailScreen";

export type FavoritesStackParamList = {
  FavoritesMain: undefined;
  PoemDetail: { poem: any };
};

const Stack = createNativeStackNavigator<FavoritesStackParamList>();

export default function FavoritesStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FavoritesMain"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PoemDetail"
        component={PoemDetailScreen}
        options={({ route }) => ({
          title: route.params?.poem?.title || "Poem",
          headerStyle: { backgroundColor: "#000" },
          headerTitleStyle: { color: "#FFD700" },
          headerTintColor: "#FFD700",
          animation: "fade_from_bottom",
        })}
      />
    </Stack.Navigator>
  );
}
