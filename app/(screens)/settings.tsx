import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { SectionCard } from '../../components/settings/SectionCard';
import { SettingRow } from '../../components/settings/SettingRow';
import { useSettings } from '../../hooks/useSettings';
import { styles } from '../../styles/settings.styles';

const SettingsScreen = () => {
  const router = useRouter();
  const { settings, toggleNotifications, toggleDarkMode } = useSettings();

  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView style={styles.bg} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
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
          <SettingRow icon="language-outline" label="Language" onPress={() => {}} />
        </SectionCard>
        {/* About Section */}
        <SectionCard icon="information-circle-outline" title="About" style={{ borderRadius: 20 }}>
          <SettingRow icon="information-circle-outline" label="About UniSync" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

SettingsScreen.options = { headerShown: false }; 