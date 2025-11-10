import { useCachedResources } from '@/hooks/useCachedResources';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';


import RootNavigator from '@/navigation/RootNavigator';

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
        }}
      >
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Use the stack that wraps the tab navigator */}
      <RootNavigator />
    </NavigationContainer>
  );
}
