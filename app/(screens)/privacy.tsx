import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="shield-checkmark-outline" size={80} color="#2196F3" />
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: March 2024</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.text}>
            We collect information that you provide directly to us, including:
          </Text>
          <View style={styles.listItem}>
            <Ionicons name="ellipse" size={8} color="#2196F3" style={styles.bullet} />
            <Text style={styles.text}>Personal information (name, email, student ID)</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="ellipse" size={8} color="#2196F3" style={styles.bullet} />
            <Text style={styles.text}>Academic information (courses, grades)</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="ellipse" size={8} color="#2196F3" style={styles.bullet} />
            <Text style={styles.text}>Device information and usage data</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.text}>
            We use the collected information to:
          </Text>
          <View style={styles.listItem}>
            <Ionicons name="ellipse" size={8} color="#2196F3" style={styles.bullet} />
            <Text style={styles.text}>Provide and maintain our services</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="ellipse" size={8} color="#2196F3" style={styles.bullet} />
            <Text style={styles.text}>Send you important updates and notifications</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="ellipse" size={8} color="#2196F3" style={styles.bullet} />
            <Text style={styles.text}>Improve and personalize your experience</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.text}>
            We implement appropriate security measures to protect your personal information. 
            Your data is encrypted and stored securely. We regularly review and update our 
            security practices to ensure the safety of your information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <Text style={styles.text}>
            You have the right to:
          </Text>
          <View style={styles.listItem}>
            <Ionicons name="ellipse" size={8} color="#2196F3" style={styles.bullet} />
            <Text style={styles.text}>Access your personal information</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="ellipse" size={8} color="#2196F3" style={styles.bullet} />
            <Text style={styles.text}>Request corrections to your data</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="ellipse" size={8} color="#2196F3" style={styles.bullet} />
            <Text style={styles.text}>Delete your account and associated data</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.text}>
            If you have any questions about this Privacy Policy, please contact us at:
            {'\n\n'}
            Email: mert@aydgn.me{'\n'}
            Address: Istanbul, Turkey
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
  lastUpdated: {
    fontSize: 14,
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
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bullet: {
    marginRight: 10,
  },
});

export default PrivacyScreen; 