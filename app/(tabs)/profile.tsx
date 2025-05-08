import { Text } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

type ProfileOptionProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  onPress: () => void;
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const ProfileOption = ({ icon, title, onPress }: ProfileOptionProps) => (
    <TouchableOpacity style={styles.optionButton} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={24} color={theme.primary} />
      <Text style={styles.optionText}>{title}</Text>
      <MaterialCommunityIcons name="chevron-right" size={24} color={theme.grey} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user?.fullName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hesap</Text>
        <ProfileOption
          icon="account-edit"
          title="Profili Düzenle"
          onPress={() => {}}
        />
        <ProfileOption
          icon="lock-reset"
          title="Şifre Değiştir"
          onPress={() => {}}
        />
        <ProfileOption
          icon="bell-outline"
          title="Bildirim Ayarları"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uygulama</Text>
        <ProfileOption
          icon="translate"
          title="Dil"
          onPress={() => {}}
        />
        <ProfileOption
          icon="theme-light-dark"
          title="Tema"
          onPress={() => {}}
        />
        <ProfileOption
          icon="help-circle-outline"
          title="Yardım"
          onPress={() => {}}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <MaterialCommunityIcons name="logout" size={24} color={Colors.light.error} />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.light.primary,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.light.error,
    marginLeft: 8,
    fontWeight: '600',
  },
}); 