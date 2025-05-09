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
        if (!formData.cnp || formData.cnp.length !== 13) {
          newErrors.cnp = 'CNP must be 13 digits';
        }
        if (!formData.matriculationNumber) {
          newErrors.matriculationNumber = 'Matriculation number is required';
        }
        break;

      case 'verification':
        if (!formData.resetCode) {
          newErrors.resetCode = 'Verification code is required';
        }
        break;

      case 'newPassword':
        if (!formData.newPassword) {
          newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 6) {
          newErrors.newPassword = 'Password must be at least 6 characters';
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
      setError(err instanceof Error ? err.message : 'Error generating reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    try {
      // Placeholder for code verification, typically a backend call
      setStep('newPassword');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verifying code');
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
      router.replace('/(auth)/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error resetting password');
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
              placeholder="Enter your CNP (13 digits)"
              keyboardType="numeric"
              maxLength={13}
            />

            <Input
              label="Matriculation Number"
              value={formData.matriculationNumber}
              onChangeText={(value) => {
                setFormData(prev => ({ ...prev, matriculationNumber: value }));
                setErrors(prev => ({ ...prev, matriculationNumber: '' }));
              }}
              error={errors.matriculationNumber}
              placeholder="Enter your matriculation number"
            />

            <Button
              title="Send Code"
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
              label="Verification Code"
              value={formData.resetCode}
              onChangeText={(value) => {
                setFormData(prev => ({ ...prev, resetCode: value }));
                setErrors(prev => ({ ...prev, resetCode: '' }));
              }}
              error={errors.resetCode}
              placeholder="Enter the code sent to you"
              keyboardType="number-pad"
            />

            <Button
              title="Verify"
              onPress={handleVerifyCode}
              disabled={!formData.resetCode}
              style={styles.button}
            />
          </>
        );

      case 'newPassword':
        return (
          <>
            <Input
              label="New Password"
              value={formData.newPassword}
              onChangeText={(value) => {
                setFormData(prev => ({ ...prev, newPassword: value }));
                setErrors(prev => ({ ...prev, newPassword: '' }));
              }}
              error={errors.newPassword}
              secureTextEntry
              placeholder="Enter your new password"
            />

            <Button
              title="Reset Password"
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
        <Text style={styles.title}>Password Reset</Text>
        <Text style={styles.subtitle}>
          {step === 'identification' && 'Enter your identification details'}
          {step === 'verification' && 'Enter the verification code'}
          {step === 'newPassword' && 'Set a new password'}
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {renderStep()}

        <Button
          title="Back to Login"
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
    backgroundColor: '#f9f9f9',
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