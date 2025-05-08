export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  surname: string;
  cnp: string;
  matriculationNumber: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    surname: string;
  };
}

export interface ResetPasswordData {
  cnp: string;
  matriculationNumber: string;
  resetCode: string;
  newPassword: string;
}

export interface ResetPasswordRequest extends ResetPasswordData {
  token: string;
} 