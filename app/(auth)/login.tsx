import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import styles from "@/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role?: string;
    phone_number?: string;
    nationality?: string;
    cnp?: string;
    matriculation_number?: string;
    advisor?: string;
    gpa?: number;
    semester?: number;
    study_year?: number;
    group_name?: string;
    subgroup_index?: string;
    faculty_id?: string;
    group_is_modular?: boolean;
    is_modular?: boolean;
    specialization_short_name?: string;
    specialization_name?: string;
  };
}

// Helper function for user data transformation
const mapUserResponse = (userResponse: LoginResponse["user"]) => {
  return {
    _id: userResponse.user_id || "",
    name: `${userResponse.first_name} ${userResponse.last_name}`.trim(),
    email: userResponse.email,
    role: userResponse.role || "student",
    phone: userResponse.phone_number || "",
    natioanlity: userResponse.nationality || "",
    cnp: userResponse.cnp || "",
    matriculationNumber: userResponse.matriculation_number || "",
    
    academicInfo: {
      advisor: userResponse.advisor || "",
      gpa: userResponse.gpa || 0,
      semester: userResponse.semester || 1,
      studyYear: userResponse.study_year || 1,
      groupName: userResponse.group_name || "",
      subgroupIndex: userResponse.subgroup_index || "",
      facultyId: userResponse.faculty_id || "",
      studentId: userResponse.user_id,
      isModular: userResponse.group_is_modular ?? userResponse.is_modular ?? false,
      specializationShortName: userResponse.specialization_short_name || "",
      program: userResponse.specialization_name || ""
    }
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
      const response = await authService.login(formData.email, formData.password);

      if (response && response.token && response.user) {
        const mappedUser = mapUserResponse(response.user);
        await login(formData.email, formData.password);
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
            onChangeText={(value: string) =>
              setFormData((prev: LoginRequest) => ({ ...prev, email: value }))
            }
            placeholder="prenume.nume@student.usv.ro"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <View style={{ position: "relative" }}>
            <Input
              label="Password"
              value={formData.password}
              onChangeText={(value: string) =>
                setFormData((prev: LoginRequest) => ({ ...prev, password: value }))
              }
              placeholder="StudentXXXXXX"
              secureTextEntry={!showPassword}
              autoComplete="password"
              style={{ paddingRight: 50 }}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: 32,
                padding: 8,
                zIndex: 10,
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