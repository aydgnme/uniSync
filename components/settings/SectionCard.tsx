import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { SETTINGS_CONSTANTS, styles } from '../../styles/settings.styles';

interface SectionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SectionCard: React.FC<SectionCardProps> = ({ icon, title, children, style }) => (
  <View style={[styles.card, style, { borderRadius: 15}]}>
    <View style={styles.cardHeader}>
      <Ionicons name={icon} size={22} color={SETTINGS_CONSTANTS.PRIMARY} style={{ marginRight: 8 }} />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    {children}
  </View>
); 