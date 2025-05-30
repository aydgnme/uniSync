import { useMessages } from '@/hooks/useMessages';
import { Message } from '@/services/message.service';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MessageItem = ({ item, onMarkAsRead, onDelete }: { 
  item: Message; 
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      if (item.unread) {
        onMarkAsRead(item.id);
      }
    } else {
      setIsExpanded(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(item.id),
        },
      ],
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.messageCard, item.unread && styles.unreadMessageCard]} 
      onPress={handlePress}
    >
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
        <View style={styles.messageActions}>
          {item.unread && <View style={styles.unreadDot} />}
          {isExpanded && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Text style={styles.subject}>{item.subject}</Text>
      <Text 
        style={styles.messagePreview} 
        numberOfLines={isExpanded ? undefined : 2}
      >
        {item.message}
      </Text>
    </TouchableOpacity>
  );
};

const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#2196F3" />
  </View>
);

const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{message}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

export default function MessagesScreen() {
  const { 
    messages = [], 
    isLoading, 
    isError, 
    refetch, 
    markAsRead, 
    deleteMessage 
  } = useMessages();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return (
      <ErrorMessage 
        message="Failed to load messages. Please try again." 
        onRetry={refetch} 
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <MessageItem 
            item={item} 
            onMarkAsRead={markAsRead} 
            onDelete={deleteMessage}
          />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages found</Text>
          </View>
        }
        contentContainerStyle={{ flex: 1 }}
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
  unreadMessageCard: {
    backgroundColor: '#f0f7ff',
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
  messageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    padding: 4,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 