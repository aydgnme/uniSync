import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const mockMessages = [
  {
    id: '1',
    sender: 'Lecturer PhD Eng. Ionela Rusu',
    subject: 'CS101 - Assignment Deadline',
    message: 'Hello, the assignment deadline for CS101 course has been updated to March 20, 2024.',
    time: '10:30',
    unread: true,
  },
  {
    id: '2',
    sender: 'Student Affairs',
    subject: 'Course Registration Approval',
    message: 'Your spring semester course registrations have been approved by your advisor.',
    time: 'Yesterday',
    unread: true,
  },
  {
    id: '3',
    sender: 'Phd. Satco Bianca-Renata',
    subject: 'MATH101 - Exam Location Change',
    message: 'The midterm exam for MATH101 course will be held in classroom B-203.',
    time: '2 days ago',
    unread: false,
  },
];

interface Message {
  id: string;
  sender: string;
  subject: string;
  message: string;
  time: string;
  unread: boolean;
}

const MessageItem = ({ item }: { item: Message }) => (
  <TouchableOpacity style={styles.messageCard}>
    <View style={styles.messageHeader}>
      <View style={styles.senderInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.sender[0]}</Text>
        </View>
        <View>
          <Text style={styles.senderName}>{item.sender}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
    </View>
    <Text style={styles.subject}>{item.subject}</Text>
    <Text style={styles.messagePreview} numberOfLines={2}>
      {item.message}
    </Text>
  </TouchableOpacity>
);

export default function MessagesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.composeButton}>
          <Ionicons name="create-outline" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={mockMessages}
        renderItem={({ item }) => <MessageItem item={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  composeButton: {
    padding: 8,
  },
  messageCard: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976d2',
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  messagePreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 