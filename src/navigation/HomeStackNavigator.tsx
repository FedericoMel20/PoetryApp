// src/navigation/HomeStackNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeScreen from "../screens/HomeScreen";
import PoemDetailScreen from "../screens/PoemDetailScreen";

export type HomeStackParamList = {
  HomeMain: undefined;
  PoemDetail: { poem: any };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PoemDetail"
        component={PoemDetailScreen}
        options={({ route }) => ({
          title: route.params?.poem?.title || "Poem Detail",
          headerStyle: { backgroundColor: "#0B0018" },
          headerTintColor: "#FFD700",
          headerTitleStyle: { fontWeight: "bold" },
          animation: "fade_from_bottom",
        })}
      />
    </Stack.Navigator>
  );
}
