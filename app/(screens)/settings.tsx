import { SectionCard } from '@/components/settings/SectionCard';
import { SettingRow } from '@/components/settings/SettingRow';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { styles } from '@/styles/settings.styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, View } from 'react-native';

const SettingsScreen = () => {
  const router = useRouter();
  const { settings, toggleNotifications, toggleDarkMode } = useSettings();
  const { logout } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.bg} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Security Section */}
        <SectionCard icon="shield-checkmark-outline" title="Security">
          <SettingRow 
            icon="key-outline" 
            label="Change Password" 
            onPress={() => router.push('/security/changePassword')} 
          />
          <View style={styles.divider} />
          <SettingRow 
            icon="phone-portrait-outline" 
            label="Session Management" 
            onPress={() => router.push('/security/sessions')} 
          />
        </SectionCard>

        {/* Notifications Section */}
        <SectionCard icon="notifications-outline" title="Notifications">
          <SettingRow 
            icon="notifications-outline" 
            label="Enable Notifications" 
            value={settings.notifications} 
            onPress={toggleNotifications} 
            showSwitch 
          />
        </SectionCard>

        {/* Appearance Section */}
        <SectionCard icon="moon-outline" title="Appearance">
          <SettingRow 
            icon="moon-outline" 
            label="Dark Mode" 
            value={settings.darkMode} 
            onPress={toggleDarkMode} 
            showSwitch 
          />
          <View style={styles.divider} />
          <SettingRow 
            icon="language-outline" 
            label="Language" 
            onPress={() => router.push('/language')} 
          />
        </SectionCard>

        {/* About Section */}
        <SectionCard icon="information-circle-outline" title="About">
          <SettingRow 
            icon="information-circle-outline" 
            label="About UniSync" 
            onPress={() => router.push('/about')} 
          />
          <View style={styles.divider} />
          <SettingRow 
            icon="help-circle-outline" 
            label="Help & Support" 
            onPress={() => router.push('/support')} 
          />
          <View style={styles.divider} />
          <SettingRow 
            icon="document-text-outline" 
            label="Privacy Policy" 
            onPress={() => router.push('/privacy')} 
          />
        </SectionCard>

        {/* Sign Out Section */}
        <SettingRow 
          icon="log-out-outline" 
          label="Sign Out" 
          onPress={handleSignOut}
          style={{ color: '#FF3B30' }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

SettingsScreen.options = { headerShown: false }; 