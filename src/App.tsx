import { useCachedResources } from '@/hooks/useCachedResources';
import { NavigationContainer } from '@react-navigation/native';
import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext, AuthProvider } from './context/AuthContext';
import AuthScreen from './screens/AuthScreen';


import RootNavigator from '@/navigation/RootNavigator';

function AppContent() {
  const auth = useContext(AuthContext);

  if (!auth || auth.loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return auth.user ? <RootNavigator /> : <AuthScreen />;
}

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
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}
