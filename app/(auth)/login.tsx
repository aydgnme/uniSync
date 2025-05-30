import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import type { LoginRequest, LoginResponse } from "@/services/auth.service";
import { authService } from "@/services/auth.service";
import styles from "@/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Helper function for user data transformation
const mapUserResponse = (userResponse: LoginResponse["user"]) => {
  return {
    _id: userResponse._id,
    name: userResponse.name,
    email: userResponse.email,
    role: userResponse.role || "Student",
    academicInfo: userResponse.academicInfo ? {
      program: userResponse.academicInfo.program || "",
      semester: userResponse.academicInfo.semester || 1,
      studentId: userResponse.academicInfo.studentId || "",
      advisor: userResponse.academicInfo.advisor || "",
      groupName: userResponse.academicInfo.groupName || "",
      subgroupIndex: userResponse.academicInfo.subgroupIndex || "",
      gpa: userResponse.academicInfo.gpa || 0,
      facultyId: userResponse.academicInfo.facultyId || "",
      specializationShortName: userResponse.academicInfo.specializationShortName || "",
      _id: userResponse.academicInfo._id
    } : undefined
  };
};

export default function LoginScreen() {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Email and password fields are required.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // console.log('Login attempt with:', { email: formData.email });
      const response = await authService.login(formData);
      // console.log('Login response received:', response);

      if (response && response.token && response.user) {
        // Store token and user data securely
        await SecureStore.setItemAsync("token", response.token);
        await SecureStore.setItemAsync("userId", response.user._id);

        // Map user data to expected format and update context
        const mappedUser = mapUserResponse(response.user);
        await login(mappedUser, response.token);

        console.log("Login successful, navigating to main screen");
        router.replace("/(tabs)");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Error",
        "An error occurred during login. Please check your credentials and try again."
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
        <Image
          source={require("@/assets/images/usv-campus.jpg")}
          style={styles.headerImage}
          resizeMode="cover"
        />

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.subtitleText}>uniSync</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Email"
            value={formData.email}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, email: value }))
            }
            placeholder="prenume.nume@student.usv.ro"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <View style={{ position: 'relative' }}>
            <Input
              label="Password"
              value={formData.password}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, password: value }))
              }
              placeholder="StudentXXXXXX"
              secureTextEntry={!showPassword}
              autoComplete="password"
              style={{ paddingRight: 50 }}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 12,
                top: 32,
                padding: 8,
                zIndex: 10
              }}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#666"
              />
            </Pressable>
          </View>

          <Button
            title="Sign in"
            onPress={handleLogin}
            disabled={loading}
            loading={loading}
            style={{ marginTop: 16 }}
          />

          <TouchableOpacity
            style={{ marginTop: 16, alignItems: "flex-start" }}
            onPress={() => router.push("/(auth)/reset-password")}
            disabled={loading}
          >
            <Text style={styles.footerLink}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
