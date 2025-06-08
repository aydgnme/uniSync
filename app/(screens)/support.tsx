import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SupportScreen = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:mert@aydgn.me');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://aydgn.me');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="help-circle-outline" size={80} color="#2196F3" />
          <Text style={styles.title}>Help & Support</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.question}>How do I reset my password?</Text>
            <Text style={styles.answer}>
              You can reset your password by clicking on the "Forgot Password" link on the login screen. 
              Follow the instructions sent to your email to create a new password.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.question}>How do I update my profile information?</Text>
            <Text style={styles.answer}>
              Go to Settings {'>'} Profile to update your personal information, including your name, 
              email, and profile picture.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.question}>How do I enable notifications?</Text>
            <Text style={styles.answer}>
              Navigate to Settings {'>'} Notifications to manage your notification preferences. 
              You can enable or disable different types of notifications.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <Text style={styles.description}>
            Need additional help? Our support team is here to assist you.
          </Text>

          <TouchableOpacity style={styles.contactButton} onPress={handleEmailPress}>
            <Ionicons name="mail-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Email Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={handleWebsitePress}>
            <Ionicons name="globe-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Visit Support Website</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Response Time</Text>
          <Text style={styles.description}>
            We typically respond to support inquiries within 24-48 hours during business days.
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
    marginBottom: 15,
  },
  faqItem: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  answer: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default SupportScreen; 