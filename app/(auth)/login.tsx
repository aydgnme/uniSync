import { useAuth } from '@/context/AuthContext';
import { LoginData } from '@/types/auth.type';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const LoginScreen = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    console.log('Validating form data:', formData);
    
    if (!formData.email || !formData.password) {
      Alert.alert('Hata', 'E-posta ve şifre alanları zorunludur.');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi giriniz.');
      return false;
    }
    
    if (formData.password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return false;
    }
    
    return true;
  };

  const handleLogin = async () => {
    console.log('Login attempt started');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setLoading(true);
    console.log('Setting loading state:', true);

    try {
      console.log('Attempting to login with:', formData.email);
      await login(formData.email, formData.password);
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Giriş Hatası',
        'Giriş yapılırken bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyiniz.'
      );
    } finally {
      console.log('Setting loading state:', false);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        backgroundColor: '#fff'
      }}
    >
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
            UniSync'e Hoş Geldiniz
          </Text>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
            Lütfen hesabınıza giriş yapın
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ marginBottom: 8, fontSize: 16, color: '#333' }}>
            E-posta
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              marginBottom: 16
            }}
            value={formData.email}
            onChangeText={(value) => {
              setFormData(prev => ({ ...prev, email: value }));
              setErrors(prev => ({ ...prev, email: '' }));
            }}
            placeholder="ornek@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Text style={{ marginBottom: 8, fontSize: 16, color: '#333' }}>
            Şifre
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                fontSize: 16
              }}
              value={formData.password}
              onChangeText={(value) => {
                setFormData(prev => ({ ...prev, password: value }));
                setErrors(prev => ({ ...prev, password: '' }));
              }}
              placeholder="Şifrenizi giriniz"
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <Pressable 
              onPress={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 12 }}
            >
              <Ionicons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={24} 
                color="#666" 
              />
            </Pressable>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
            opacity: loading ? 0.7 : 1
          }}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 16, alignItems: 'center' }}
        >
          <Text style={{ color: '#007AFF', fontSize: 16 }}>
            Şifremi Unuttum
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen; 