import Button from '@/components/Button';
import Input from '@/components/Input';
import { authService } from '@/services/auth.service';
import { ResetPasswordData } from '@/types/auth.type';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Step = 'identification' | 'verification' | 'newPassword';

const ResetPasswordScreen = () => {
  const [step, setStep] = useState<Step>('identification');
  const [formData, setFormData] = useState<ResetPasswordData>({
    cnp: '',
    matriculationNumber: '',
    resetCode: '',
    newPassword: '',
  });
  const [errors, setErrors] = useState<Partial<ResetPasswordData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateStep = () => {
    const newErrors: Partial<ResetPasswordData> = {};

    switch (step) {
      case 'identification':
        if (!formData.cnp) {
          newErrors.cnp = 'CNP gerekli';
        }
        if (!formData.matriculationNumber) {
          newErrors.matriculationNumber = 'Öğrenci numarası gerekli';
        }
        break;

      case 'verification':
        if (!formData.resetCode) {
          newErrors.resetCode = 'Doğrulama kodu gerekli';
        }
        break;

      case 'newPassword':
        if (!formData.newPassword) {
          newErrors.newPassword = 'Yeni şifre gerekli';
        } else if (formData.newPassword.length < 6) {
          newErrors.newPassword = 'Şifre en az 6 karakter olmalı';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateCode = async () => {
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    try {
      await authService.generateResetCode(formData.cnp, formData.matriculationNumber);
      setStep('verification');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kod gönderilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    try {
      await authService.resetPassword(formData);
      router.replace('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Şifre sıfırlanırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'identification':
        return (
          <>
            <Input
              label="CNP"
              value={formData.cnp}
              onChangeText={(value) => {
                setFormData(prev => ({ ...prev, cnp: value }));
                setErrors(prev => ({ ...prev, cnp: '' }));
              }}
              error={errors.cnp}
              placeholder="CNP numaranız"
            />

            <Input
              label="Öğrenci Numarası"
              value={formData.matriculationNumber}
              onChangeText={(value) => {
                setFormData(prev => ({ ...prev, matriculationNumber: value }));
                setErrors(prev => ({ ...prev, matriculationNumber: '' }));
              }}
              error={errors.matriculationNumber}
              placeholder="Öğrenci numaranız"
            />

            <Button
              title="Kod Gönder"
              onPress={handleGenerateCode}
              loading={loading}
              disabled={loading}
              style={styles.button}
            />
          </>
        );

      case 'verification':
        return (
          <>
            <Input
              label="Doğrulama Kodu"
              value={formData.resetCode}
              onChangeText={(value) => {
                setFormData(prev => ({ ...prev, resetCode: value }));
                setErrors(prev => ({ ...prev, resetCode: '' }));
              }}
              error={errors.resetCode}
              placeholder="Size gönderilen kod"
              keyboardType="number-pad"
            />

            <Button
              title="Doğrula"
              onPress={() => setStep('newPassword')}
              disabled={!formData.resetCode}
              style={styles.button}
            />
          </>
        );

      case 'newPassword':
        return (
          <>
            <Input
              label="Yeni Şifre"
              value={formData.newPassword}
              onChangeText={(value) => {
                setFormData(prev => ({ ...prev, newPassword: value }));
                setErrors(prev => ({ ...prev, newPassword: '' }));
              }}
              error={errors.newPassword}
              secureTextEntry
              placeholder="Yeni şifreniz"
            />

            <Button
              title="Şifreyi Sıfırla"
              onPress={handleResetPassword}
              loading={loading}
              disabled={loading}
              style={styles.button}
            />
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Şifre Sıfırlama</Text>
        <Text style={styles.subtitle}>
          {step === 'identification' && 'Kimlik bilgilerinizi girin'}
          {step === 'verification' && 'Size gönderilen kodu girin'}
          {step === 'newPassword' && 'Yeni şifrenizi belirleyin'}
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {renderStep()}

        <Button
          title="Giriş Sayfasına Dön"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  button: {
    marginTop: 16,
  },
  backButton: {
    marginTop: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
}); 