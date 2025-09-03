import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { authService } from "@/services/auth.service";
import { ResetPasswordData } from "@/types/auth.type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions
} from "react-native";

type Step = "identification" | "verification" | "newPassword";

// Password strength checker
const checkPasswordStrength = (password: string): {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("Password must be at least 8 characters");
  }

  // Uppercase letter check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Password must contain at least one uppercase letter");
  }

  // Lowercase letter check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Password must contain at least one lowercase letter");
  }

  // Number check
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Password must contain at least one number");
  }

  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Password must contain at least one special character (!@#$%^&*)");
  }

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 3) {
    strength = 'medium';
  }

  return { strength, score, feedback };
};

const ResetPasswordScreen = () => {
  const [step, setStep] = useState<Step>("identification");
  const [formData, setFormData] = useState<ResetPasswordData>({
    cnp: "",
    matriculationNumber: "",
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<ResetPasswordData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<{
    strength: 'weak' | 'medium' | 'strong';
    score: number;
    feedback: string[];
  }>({ strength: 'weak', score: 0, feedback: [] });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { width } = useWindowDimensions();

  // Update password strength when password changes
  useEffect(() => {
    if (formData.newPassword) {
      setPasswordStrength(checkPasswordStrength(formData.newPassword));
    } else {
      setPasswordStrength({ strength: 'weak', score: 0, feedback: [] });
    }
  }, [formData.newPassword]);

  const getStepMessage = (currentStep: Step) => {
    switch (currentStep) {
      case "identification":
        return "Please enter your CNP and matriculation number";
      case "verification":
        return "Enter the 6-digit verification code";
      case "newPassword":
        return "Set a new password";
      default:
        return "";
    }
  };

  const validateStep = () => {
    const newErrors: Partial<ResetPasswordData> = {};

    switch (step) {
      case "identification":
        if (!formData.cnp || formData.cnp.length !== 13) {
          newErrors.cnp = "CNP must be 13 digits";
        }
        if (!formData.matriculationNumber) {
          newErrors.matriculationNumber = "Matriculation number is required";
        }
        break;

      case "verification":
        if (!formData.resetCode) {
          newErrors.resetCode = "Verification code is required";
        }
        break;

      case "newPassword":
        if (!formData.newPassword) {
          newErrors.newPassword = "New password is required";
        } else if (formData.newPassword.length < 8) {
          newErrors.newPassword = "Password must be at least 8 characters";
        } else if (passwordStrength.score < 3) {
          newErrors.newPassword = "Password is not strong enough";
        }

        if (!formData.confirmPassword) {
          newErrors.confirmPassword = "Confirm your password";
        } else if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords don't match";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateCode = async () => {
    if (!validateStep()) return;

    setLoading(true);
    setError("");

    try {
      await authService.generateResetCode(
        formData.cnp,
        formData.matriculationNumber
      );
      setStep("verification");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error generating reset code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validateStep()) return;

    setLoading(true);
    setError("");

    console.log('Verifying code with data:', {
      cnp: formData.cnp,
      matriculationNumber: formData.matriculationNumber,
      code: formData.resetCode
    });

    try {
      const response = await authService.verifyResetCode(
        formData.cnp,
        formData.matriculationNumber,
        formData.resetCode
      );

      console.log('Verification response:', response);

      if (response && response.isValid) {
        console.log('Code verified successfully, moving to new password step');
        setStep("newPassword");
      } else {
        console.log('Code verification failed:', response?.message || 'Invalid code');
        setError(response?.message || 'Invalid verification code');
      }
    } catch (err: any) {
      console.log('Verification error:', {
        status: err.response?.status,
        data: err.response?.data,
        error: err
      });

      let errorMessage = "Error verifying code";
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            errorMessage = err.response.data.message || "Invalid verification code";
            break;
          case 404:
            errorMessage = "User not found";
            break;
          default:
            errorMessage = "Failed to verify code. Please try again.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError("");

    console.log('Requesting new code for:', {
      cnp: formData.cnp,
      matriculationNumber: formData.matriculationNumber
    });

    try {
      await authService.generateResetCode(formData.cnp, formData.matriculationNumber);
      console.log('New code generated successfully');
      setError("New verification code has been sent");
    } catch (err: any) {
      console.log('Generate code error:', {
        status: err.response?.status,
        data: err.response?.data,
        error: err
      });
      setError(err.response?.data?.message || "Failed to send new code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validateStep()) return;

    setLoading(true);
    setError("");

    console.log('Resetting password with data:', {
      cnp: formData.cnp,
      matriculationNumber: formData.matriculationNumber,
      code: formData.resetCode,
      newPassword: '********', // Don't log actual password
      confirmPassword: '********' // Don't log actual password
    });

    try {
      await authService.resetPassword(
        formData.cnp,
        formData.matriculationNumber,
        formData.resetCode,
        formData.newPassword,
        formData.confirmPassword
      );

      console.log('Password reset successful');
      
      // Show success alert and redirect to login
      Alert.alert(
        "Success",
        "Your password has been reset successfully. You can now log in with your new password.",
        [
          {
            text: "Log In",
            onPress: () => router.replace("/(auth)/login")
          }
        ]
      );
    } catch (err: any) {
      console.log('Password reset error:', {
        status: err.response?.status,
        data: err.response?.data,
        error: err
      });

      let errorMessage = "Failed to reset password";
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            errorMessage = err.response.data.message || "Invalid reset data";
            break;
          case 404:
            errorMessage = "User not found";
            break;
          case 500:
            errorMessage = "Failed to update password. Please try again.";
            break;
          default:
            errorMessage = "An error occurred. Please try again.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verificationInput = {
    textAlign: "center",
    letterSpacing: width * 0.07,
    fontSize: width * 0.08,
    fontWeight: "600",
    color: "#111827",
    backgroundColor: "transparent",
    borderWidth: 0,
    height: 40,
    padding: 0,
    width: "100%",
    marginBottom: 8,
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.formContainer}>
          <Text style={[styles.title, { alignItems: "flex-start" }]}>
            Password Reset
          </Text>
          <Text style={styles.graySubtitle}>{getStepMessage(step)}</Text>

          {error && <Text style={[styles.errorText, error.includes("successful") && styles.successText]}>{error}</Text>}

          {step === "identification" && (
            <>
              <Input
                label="CNP"
                value={formData.cnp}
                onChangeText={(value) => {
                  const numericValue = value.replace(/[^0-9]/g, "");
                  if (numericValue.length <= 13) {
                    setFormData((prev) => ({ ...prev, cnp: numericValue }));
                  }
                }}
                keyboardType="numeric"
                maxLength={13}
                placeholder="Enter your CNP"
                error={errors.cnp}
              />

              <Input
                label="Matriculation Number"
                value={formData.matriculationNumber}
                onChangeText={(value) => {
                  const numericValue = value.replace(/[^0-9]/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    matriculationNumber: numericValue,
                  }));
                }}
                keyboardType="numeric"
                placeholder="Enter your matriculation number"
                error={errors.matriculationNumber}
              />

              <Button
                title="Verify"
                onPress={handleGenerateCode}
                style={styles.button}
                loading={loading}
              />
            </>
          )}

          {step === "verification" && (
            <>
              <View style={styles.codeInputContainer}>
                <View style={styles.codeInputWrapper}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.verificationInput,
                      errors.resetCode ? styles.inputError : null,
                    ]}
                    value={formData.resetCode}
                    onChangeText={(value) => {
                      const numericValue = value.replace(/[^0-9]/g, "");
                      if (numericValue.length <= 6) {
                        setFormData((prev) => ({
                          ...prev,
                          resetCode: numericValue,
                        }));
                      }
                      if (numericValue.length === 6) {
                        handleVerifyCode();
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={6}
                    placeholder="123456"
                    placeholderTextColor="#666"
                    textAlign="center"
                  />
                  <View style={styles.codeUnderlines}>
                    {[...Array(6)].map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.codeUnderline,
                          index < (formData.resetCode?.length || 0) &&
                            styles.codeUnderlineFilled,
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>

              {errors.resetCode && (
                <Text style={styles.verificationErrorText}>
                  Verification code is required
                </Text>
              )}

              <Button
                title="Confirm"
                onPress={handleVerifyCode}
                style={styles.button}
                loading={loading}
              />

              <Button
                title="Get a new code"
                onPress={handleResendCode}
                style={{ backgroundColor: 'transparent' }}
                disabled={loading}
              />
            </>
          )}

          {step === "newPassword" && (
            <>
              <View style={{ position: 'relative' }}>
                <Input
                  label="New Password"
                  value={formData.newPassword}
                  onChangeText={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      newPassword: value,
                    }));
                  }}
                  secureTextEntry={!showNewPassword}
                  placeholder="Enter your new password"
                  error={errors.newPassword}
                  style={{ paddingRight: 50 }}
                />
                <Pressable
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: 30,
                    height: 48,
                    width: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#666"
                  />
                </Pressable>
              </View>
              
              {formData.newPassword.length > 0 && (
                <View style={styles.passwordStrengthContainer}>
                  <View style={styles.strengthBarContainer}>
                    <View 
                      style={[
                        styles.strengthBar, 
                        { 
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          backgroundColor: 
                            passwordStrength.strength === 'strong' 
                              ? '#4CAF50' 
                              : passwordStrength.strength === 'medium' 
                                ? '#FFA000' 
                                : '#F44336' 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[
                    styles.strengthText,
                    passwordStrength.strength === 'strong' 
                      ? styles.strongText 
                      : passwordStrength.strength === 'medium' 
                        ? styles.mediumText 
                        : styles.weakText
                  ]}>
                    {passwordStrength.strength === 'strong' 
                      ? 'Strong Password' 
                      : passwordStrength.strength === 'medium' 
                        ? 'Medium Password' 
                        : 'Weak Password'}
                  </Text>
                </View>
              )}
              
              {formData.newPassword.length > 0 && passwordStrength.feedback.length > 0 && (
                <View style={styles.feedbackContainer}>
                  <Text style={styles.feedbackTitle}>For a strong password:</Text>
                  {passwordStrength.feedback.map((item, index) => (
                    <Text key={index} style={styles.feedbackItem}>• {item}</Text>
                  ))}
                </View>
              )}

              <View style={{ position: 'relative' }}>
                <Input
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: value,
                    }));
                  }}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirm your password"
                  error={errors.confirmPassword}
                  style={{ paddingRight: 50 }}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: 30,
                    height: 48,
                    width: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#666"
                  />
                </Pressable>
              </View>

              <Button
                title="Reset Password"
                onPress={handleResetPassword}
                style={styles.button}
                loading={loading}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  formContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 100,
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 8,
    color: "#111827",
  },
  graySubtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 40,
  },
  verificationTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#111827",
  },
  verificationSubtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
    color: "#111827",
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    textAlign: "left",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 4,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    textAlign: "left",
  },
  codeInputContainer: {
    marginVertical: 32,
    alignItems: "center",
    width: "100%",
  },
  codeInputWrapper: {
    width: "80%",
    alignItems: "center",
  },
  verificationInput: {
    textAlign: "center",
    letterSpacing: 32,
    fontSize: 32,
    fontWeight: "600",
    color: "#111827",
    backgroundColor: "transparent",
    borderWidth: 0,
    height: 40,
    padding: 0,
    width: "100%",
    marginBottom: 0,
  },
  codeUnderlines: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  codeUnderline: {
    width: 32,
    height: 2,
    backgroundColor: "#111827",
    opacity: 0.3,
  },
  codeUnderlineFilled: {
    backgroundColor: "#111827",
    opacity: 1,
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  verificationErrorText: {
    color: "#FF3B30",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  confirmButton: {
    marginTop: 16,
    backgroundColor: "#14213D",
    borderRadius: 12,
    padding: 16,
  },
  newCodeButton: {
    marginTop: 24,
    alignItems: "center",
  },
  newCodeText: {
    color: "#007AFF",
    fontSize: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "left",
  },
  button: {
    marginTop: 16,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
  },
  successText: {
    color: "#4CAF50",
  },
  passwordStrengthContainer: {
    marginBottom: 16,
  },
  strengthBarContainer: {
    height: 8,
    backgroundColor: '#E1E1E1',
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 4,
  },
  strengthText: {
    fontSize: 14,
    textAlign: 'right',
  },
  weakText: {
    color: '#F44336',
  },
  mediumText: {
    color: '#FFA000',
  },
  strongText: {
    color: '#4CAF50',
  },
  feedbackContainer: {
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  feedbackItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
  passwordContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  eyeIcon: {
    padding: 10,
  },
});
