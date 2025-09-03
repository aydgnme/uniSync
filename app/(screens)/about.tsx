import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="school-outline" size={80} color="#2196F3" />
          <Text style={styles.title}>UniSync</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About UniSync</Text>
          <Text style={styles.description}>
            UniSync is a comprehensive university management application designed to streamline academic life. 
            Our mission is to provide students with an all-in-one platform that makes managing their academic 
            journey easier and more efficient.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureItem}>
            <Ionicons name="calendar-outline" size={24} color="#2196F3" />
            <Text style={styles.featureText}>Academic Calendar & Schedule Management</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="document-text-outline" size={24} color="#2196F3" />
            <Text style={styles.featureText}>Grade Tracking & GPA Calculator</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="notifications-outline" size={24} color="#2196F3" />
            <Text style={styles.featureText}>Real-time Notifications</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="people-outline" size={24} color="#2196F3" />
            <Text style={styles.featureText}>Course & Faculty Management</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.contactText}>
            Email: mert@aydgn.me{'\n'}
            Website: aydgn.me
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 10,
  },
  version: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default AboutScreen; 