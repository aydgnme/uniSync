import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Grades } from './components/Grades';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Grades />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 