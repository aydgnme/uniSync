import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleProp, Switch, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { SETTINGS_CONSTANTS, styles } from '../../styles/settings.styles';

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: boolean;
  onPress: () => void;
  showSwitch?: boolean;
  style?: StyleProp<TextStyle>;
}

export const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  label,
  value,
  onPress,
  showSwitch = false,
  style,
}) => (
  <TouchableOpacity style={styles.row} activeOpacity={showSwitch ? 1 : 0.7} onPress={onPress} disabled={showSwitch}>
    <View style={styles.rowLeft}>
      <Ionicons name={icon} size={20} color={SETTINGS_CONSTANTS.PRIMARY} style={{ marginRight: 12 }} />
      <Text style={[styles.rowLabel, style]}>{label}</Text>
    </View>
    {showSwitch ? (
      <Switch
        value={!!value}
        onValueChange={onPress}
        trackColor={{ false: '#d1d1d6', true: SETTINGS_CONSTANTS.PRIMARY }}
        thumbColor={value ? (Platform.OS === 'android' ? SETTINGS_CONSTANTS.PRIMARY : '#fff') : (Platform.OS === 'android' ? '#bdbdbd' : '#fff')}
        ios_backgroundColor="#d1d1d6"
      />
    ) : (
      <Ionicons name="chevron-forward" size={20} color="#bbb" />
    )}
  </TouchableOpacity>
); 