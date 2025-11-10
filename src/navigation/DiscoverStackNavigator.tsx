import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DiscoverScreen from "../screens/DiscoverScreen";
import PoemDetailScreen from "../screens/PoemDetailScreen";

export type DiscoverStackParamList = {
  DiscoverMain: undefined;
  PoemDetail: { poem: any };
};

const Stack = createNativeStackNavigator<DiscoverStackParamList>();

export default function DiscoverStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DiscoverMain"
        component={DiscoverScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PoemDetail"
        component={PoemDetailScreen}
        options={({ route, navigation }) => ({
          title: route.params?.poem?.title || "Poem",
          headerStyle: { backgroundColor: "#000" },
          headerTitleStyle: { color: "#FFD700" },
          headerTintColor: "#FFD700",
          headerBackTitleVisible: false,
          animation: "fade_from_bottom",
        })}
      />
    </Stack.Navigator>
  );
}
