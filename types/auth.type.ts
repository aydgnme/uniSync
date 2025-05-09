export interface RegisterData {
    email: string;
    password: string;
    name: string;
    matriculationNumber: string;
    cnp: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface ResetPasswordData {
    cnp: string;
    matriculationNumber: string;
    resetCode: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    matriculationNumber: string;
    cnp: string;
    phone?: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    _id: string;
    email: string;
    name: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}