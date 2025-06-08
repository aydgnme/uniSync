import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import styles from "@/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordScreen() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ChangePasswordRequest>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return false;
    }

    if (formData.newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long.");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      await authService.changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );

      Alert.alert(
        "Success",
        "Password changed successfully.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error("Change password error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to change password. Please check your current password and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Change Password</Text>
          <Text style={styles.subtitleText}>Update your security</Text>
        </View>


        <View style={styles.formContainer}>
          <View style={{ position: "relative" }}>
            <Input
              label="Current Password"
              value={formData.currentPassword}
              onChangeText={(value: string) =>
                setFormData((prev) => ({ ...prev, currentPassword: value }))
              }
              placeholder="Enter current password"
              secureTextEntry={!showCurrentPassword}
              autoComplete="password"
              style={{ paddingRight: 50 }}
            />
            <Pressable
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: 32,
                padding: 8,
                zIndex: 10,
              }}
            >
              <Ionicons
                name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#666"
              />
            </Pressable>
          </View>

          <View style={{ position: "relative" }}>
            <Input
              label="New Password"
              value={formData.newPassword}
              onChangeText={(value: string) =>
                setFormData((prev) => ({ ...prev, newPassword: value }))
              }
              placeholder="Enter new password"
              secureTextEntry={!showNewPassword}
              autoComplete="password-new"
              style={{ paddingRight: 50 }}
            />
            <Pressable
              onPress={() => setShowNewPassword(!showNewPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: 32,
                padding: 8,
                zIndex: 10,
              }}
            >
              <Ionicons
                name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#666"
              />
            </Pressable>
          </View>

          <View style={{ position: "relative" }}>
            <Input
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChangeText={(value: string) =>
                setFormData((prev) => ({ ...prev, confirmPassword: value }))
              }
              placeholder="Confirm new password"
              secureTextEntry={!showConfirmPassword}
              autoComplete="password-new"
              style={{ paddingRight: 50 }}
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: 32,
                padding: 8,
                zIndex: 10,
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
            title="Change Password"
            onPress={handleChangePassword}
            disabled={loading}
            loading={loading}
            style={{ marginTop: 16 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
