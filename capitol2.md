# CAPITOLUL 2 – Specificații de implementare Frontend

## 2.1 Arhitectura Frontend

### 2.1.1 Structura Proiectului

Proiectul UniSync folosește o arhitectură modernă bazată pe React Native și Expo, organizată în următoarele directoare principale:

```
root/
├── app/                    # Conține componentele principale ale aplicației și navigarea
│   ├── (auth)/            # Ecrane de autentificare
│   ├── (tabs)/            # Tab-uri principale
│   └── _layout.tsx        # Configurare navigare
├── components/            # Componente reutilizabile
│   ├── ui/               # Componente UI de bază
│   ├── forms/            # Componente pentru formulare
│   └── layouts/          # Layout-uri reutilizabile
├── services/             # Servicii pentru comunicarea cu backend-ul
│   ├── api/             # Configurare Axios și endpoint-uri
│   └── storage/         # Servicii pentru AsyncStorage
├── context/             # State management folosind React Context
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── NotificationContext.tsx
├── hooks/               # Custom hooks pentru logica reutilizabilă
│   ├── useAuth.ts
│   ├── useTheme.ts
│   └── useNotifications.ts
├── utils/              # Funcții utilitare
│   ├── validation.ts
│   ├── formatting.ts
│   └── helpers.ts
├── types/              # Definiții TypeScript
│   ├── api.ts
│   ├── navigation.ts
│   └── models.ts
├── styles/             # Stiluri și teme
│   ├── theme.ts
│   ├── typography.ts
│   └── spacing.ts
└── assets/             # Resurse statice
    ├── images/
    ├── fonts/
    └── icons/
```

### 2.1.2 Tehnologii Utilizate

* **React Native (v0.72.0)**
  * Performanță nativă
  * Cross-platform development
  * Hot reloading

* **Expo SDK 49**
  * Development tools
  * Native modules
  * OTA updates

* **TypeScript**
  * Type safety
  * Better IDE support
  * Enhanced maintainability

* **React Navigation**
  * Stack Navigator
  * Tab Navigator
  * Drawer Navigator

* **State Management**
  * React Context
  * Custom Hooks
  * AsyncStorage

* **UI Libraries**
  * React Native Paper
  * React Native Vector Icons
  * React Native Reanimated

## 2.2 Implementarea Interfeței Utilizator

### 2.2.1 Sistem de Navigare

```typescript
// app/_layout.tsx
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

#### Structura de Navigare
* **Auth Stack**
  * Login
  * Register
  * Forgot Password
  * Reset Password

* **Main Tabs**
  * Home
  * Calendar
  * Grades
  * Profile

* **Drawer Menu**
  * Settings
  * Notifications
  * Help & Support

### 2.2.2 Componente Principale

#### UI Components
```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  onPress: () => void;
  children: React.ReactNode;
}

export const Button = ({ variant, size, onPress, children }: ButtonProps) => {
  // Implementation
};
```

#### Form Components
```typescript
// components/forms/Input.tsx
interface InputProps {
  label: string;
  error?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const Input = ({ label, error, value, onChangeText }: InputProps) => {
  // Implementation
};
```

### 2.2.3 Design System

#### Theme Configuration
```typescript
// styles/theme.ts
export const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    text: '#000000',
    error: '#FF3B30',
    success: '#34C759',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
  },
};
```

## 2.3 State Management

### 2.3.1 Context API Implementation

```typescript
// context/AuthContext.tsx
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthState>({
  user: null,
  isLoading: false,
  error: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Implementation
};
```

### 2.3.2 Custom Hooks

```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const { user, login, logout } = useContext(AuthContext);
  
  return {
    isAuthenticated: !!user,
    user,
    login,
    logout,
  };
};
```

## 2.4 Integrare cu Backend

### 2.4.1 API Services

```typescript
// services/api/client.ts
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 2.4.2 Real-time Communication

```typescript
// services/realtime/chat.ts
export const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `rooms/${roomId}/messages`),
      (snapshot) => {
        // Handle real-time updates
      }
    );
    
    return () => unsubscribe();
  }, [roomId]);
  
  return messages;
};
```

## 2.5 Optimizări

### 2.5.1 Performance

* **Code Splitting**
  * Lazy loading pentru componente
  * Dynamic imports

* **Image Optimization**
  * Caching
  * Progressive loading
  * Format optimization

* **Memory Management**
  * Cleanup effects
  * Proper unmounting
  * Memory leak prevention

### 2.5.2 Security

* **Secure Storage**
  * Encrypted storage
  * Token management
  * Biometric authentication

* **Input Validation**
  * Form validation
  * Data sanitization
  * XSS prevention

## 2.6 Testing

### 2.6.1 Unit Tests

```typescript
// __tests__/components/Button.test.tsx
describe('Button Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Test</Button>);
    expect(getByText('Test')).toBeTruthy();
  });
  
  it('handles press events', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress}>Test</Button>
    );
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### 2.6.2 Integration Tests

```typescript
// e2e/auth.test.ts
describe('Authentication Flow', () => {
  it('should login successfully', async () => {
    await element(by.id('email')).typeText('test@example.com');
    await element(by.id('password')).typeText('password123');
    await element(by.id('login-button')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
```

## 2.7 Deployment

### 2.7.1 Build Process

* **Development**
  * Expo development client
  * Hot reloading
  * Debug tools

* **Production**
  * EAS Build
  * Code signing
  * Asset optimization

### 2.7.2 App Store Deployment

* **iOS**
  * App Store Connect setup
  * Certificates and provisioning
  * Screenshots and metadata

* **Android**
  * Play Store setup
  * Signing configuration
  * Release management

## 2.8 Concluzii Frontend

Arhitectura frontend a UniSync a fost proiectată pentru a oferi:

* **Performanță și Responsivitate**
  * Optimizări de rendering
  * Gestionare eficientă a memoriei
  * Animații fluide

* **Experiență Utilizator**
  * UI/UX consistent
  * Accesibilitate
  * Feedback vizual

* **Mentenabilitate**
  * Cod modular
  * Documentație clară
  * Testare comprehensivă

* **Scalabilitate**
  * Arhitectură extensibilă
  * Componente reutilizabile
  * State management eficient

Această implementare frontend asigură o bază solidă pentru dezvoltarea viitoare și adaptarea la noile cerințe ale sistemului. 