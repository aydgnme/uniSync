import { authService } from '@/services/auth.service';
import { styles } from '@/styles/settings.styles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    SafeAreaView,
    Text,
    View,
} from 'react-native';

interface Session {
  id: string;
  user_id: string;
  login_time: string;
  logout_time: string | null;
  ip_address: string;
  device_info: string;
}

export default function SessionsScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSessions = async () => {
    try {
      const data = await authService.getSessions();
      // Only show active sessions
      const activeSessions = data.filter(session => !session.logout_time);
      setSessions(activeSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      Alert.alert('Error', 'Failed to load sessions. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleLogoutSession = async (sessionId: string) => {
    Alert.alert(
      'Logout Session',
      'Are you sure you want to logout this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logoutSession(sessionId);
              // Remove the logged out session from the list
              setSessions(prevSessions => 
                prevSessions.filter(session => session.id !== sessionId)
              );
            } catch (error) {
              console.error('Error logging out session:', error);
              Alert.alert('Error', 'Failed to logout session. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleLogoutAllSessions = () => {
    Alert.alert(
      'Logout All Sessions',
      'Are you sure you want to logout all other sessions?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout All',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logoutAllSessions();
              // Remove all sessions from the list
              setSessions([]);
            } catch (error) {
              console.error('Error logging out all sessions:', error);
              Alert.alert('Error', 'Failed to logout all sessions. Please try again.');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderSession = ({ item }: { item: Session }) => {
    const isCurrentSession = !item.logout_time;
    const deviceName = item.device_info.includes('Expo') ? 'Mobile App' : 
                      item.device_info.includes('Postman') ? 'Postman' :
                      item.device_info.includes('insomnia') ? 'Insomnia' :
                      'Unknown Device';

    return (
      <View style={styles.sessionItem}>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionDevice}>{deviceName}</Text>
          <Text style={styles.sessionDetails}>
            {formatDate(item.login_time)}
          </Text>
          <Text style={styles.sessionDetails}>
            IP: {item.ip_address}
          </Text>
        </View>
        {isCurrentSession ? (
          <View style={styles.currentSessionBadge}>
            <Text style={styles.currentSessionText}>Current</Text>
          </View>
        ) : (
          <Pressable
            onPress={() => handleLogoutSession(item.id)}
            style={styles.logoutButton}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          </Pressable>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>
          <Text style={styles.headerTitle}>Active Sessions</Text>
          {sessions.length > 1 && (
            <Pressable
              onPress={handleLogoutAllSessions}
              style={styles.logoutAllButton}
            >
              <Text style={styles.logoutAllText}>Logout All</Text>
            </Pressable>
          )}
        </View>

        {sessions.length === 0 ? (
          <View style={[styles.container, styles.centerContent]}>
            <Text style={styles.noSessionsText}>No active sessions</Text>
          </View>
        ) : (
          <FlatList
            data={sessions}
            renderItem={renderSession}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.sessionsList}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchSessions();
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
