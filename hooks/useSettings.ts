import { useState } from 'react';

interface SettingsState {
  notifications: boolean;
  darkMode: boolean;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    darkMode: false,
  });

  const toggleNotifications = () => {
    setSettings(prev => ({
      ...prev,
      notifications: !prev.notifications,
    }));
  };

  const toggleDarkMode = () => {
    setSettings(prev => ({
      ...prev,
      darkMode: !prev.darkMode,
    }));
  };

  return {
    settings,
    toggleNotifications,
    toggleDarkMode,
  };
}; 