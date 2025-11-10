import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.jpg')}
        style={styles.avatar}
      />
      <Text style={styles.name}>Federico</Text>
      <Text style={styles.bio}>“The wandering prints of a strange pen.”</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    color: colors.accent,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
