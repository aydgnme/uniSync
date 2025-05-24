import { useProfile } from "@/hooks/useProfile";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type RootStackParamList = {
  Chat: undefined;
  Grades: undefined;
  Calendar: undefined;
  Settings: undefined;
  Profile: undefined;
};

const abbreviateProgramName = (program?: string): string => {
  if (!program) return 'N/A';
  return program.length > 15
    ? program
        .split(' ')
        .map(word => word[0]?.toUpperCase() ?? '')
        .join('')
    : program;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, loading, error, fetchUserProfile, handleLogout } = useProfile();

  useEffect(() => {
    if (user?.academicInfo) {
      console.log('Group Info:', {
        groupName: user.academicInfo.groupName,
        subgroupIndex: user.academicInfo.subgroupIndex,
        combinedValue: `${user.academicInfo.groupName || ''}${user.academicInfo.subgroupIndex || ''}`
      });
    }
  }, [user?.academicInfo]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="rgb(40, 110, 190)" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  const InfoRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, { fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif', fontWeight: '300', fontSize: 14 }]}>{value?.toString() || 'N/A'}</Text>
    </View>
  );

  const ActionButton = ({ 
    icon, 
    label, 
    onPress,
    color = 'rgb(40, 110, 190)'
  }: { 
    icon: keyof typeof Ionicons.glyphMap; 
    label: string; 
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity style={[styles.actionButton, { backgroundColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#fff" />
      <Text style={styles.actionButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={user.profileImageUrl ? { uri: user.profileImageUrl } : require("@/assets/images/default-avatar.png")}
              style={styles.profileImage}
              defaultSource={require("@/assets/images/default-avatar.png")}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role}</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={24} color="rgb(0, 122, 255)" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          <InfoRow label="E-mail" value={user.email} />
          <InfoRow label="Phone Number" value={user.phone || ''} />
          <InfoRow label="Address" value={user.address || ''} />
          <InfoRow label="CNP" value={user.cnp} />
          <InfoRow label="Matriculation Number" value={user.matriculationNumber} />
        </View>

        {/* Academic Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school-outline" size={24} color="rgb(0, 122, 255)" />
            <Text style={styles.sectionTitle}>Academic Information</Text>
          </View>
          <InfoRow label="Program" value={abbreviateProgramName(user.academicInfo?.program)} />
          <InfoRow label="Semester" value={user.academicInfo?.semester} />
          <InfoRow label="Group" value={`${user.academicInfo?.groupName || ''}${user.academicInfo?.subgroupIndex || ''}`} />
          <InfoRow label="Matriculation Number" value={user.matriculationNumber} />
          <InfoRow label="Advisor" value={user.academicInfo?.advisor} />
          <InfoRow label="GPA" value={user.academicInfo?.gpa} />
        </View>

        {/* Quick Access */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="apps-outline" size={24} color="rgb(0, 122, 255)" />
            <Text style={styles.sectionTitle}>Quick Access</Text>
          </View>
          <View style={styles.actionButtonsContainer}>
            <ActionButton 
              icon="chatbubbles-outline" 
              label="Secretary AI" 
              onPress={() => navigation.navigate('Chat' as never)}
            />
            <ActionButton 
              icon="document-text-outline" 
              label="Transcript" 
              onPress={() => navigation.navigate('Grades' as never)}
            />
            <ActionButton 
              icon="calendar-outline" 
              label="Calendar" 
              onPress={() => navigation.navigate('Calendar' as never)}
            />
            <ActionButton 
              icon="settings-outline" 
              label="Settings" 
              onPress={() => navigation.navigate('Settings' as never)}
            />
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
