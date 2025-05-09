import { StyleSheet } from 'react-native';

// Tailwind CSS color palette
const colors = {
  primary: '#3B82F6', // blue-500
  secondary: '#6B7280', // gray-500
  background: '#F9FAFB', // gray-50
  surface: '#FFFFFF',
  text: {
    primary: '#111827', // gray-900
    secondary: '#4B5563', // gray-600
    tertiary: '#9CA3AF', // gray-400
  },
  accent: '#F3F4F6', // gray-100
  error: '#EF4444', // red-500
};

// Tailwind CSS spacing scale
const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 200,
    marginBottom: spacing[5],
  },
  welcomeContainer: {
    paddingHorizontal: spacing[5],
    marginBottom: spacing[8],
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  subtitleText: {
    fontSize: 24,
    color: colors.text.secondary,
  },
  formContainer: {
    paddingHorizontal: spacing[5],
  },
  labelText: {
    color: colors.text.secondary,
    marginBottom: spacing[2],
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.text.tertiary,
    borderRadius: spacing[3],
    marginBottom: spacing[2],
    backgroundColor: colors.surface,
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    height: spacing[12] + spacing[2],
    paddingHorizontal: spacing[4],
    color: colors.text.primary,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.text.tertiary,
    borderRadius: spacing[3],
    marginBottom: spacing[2],
    backgroundColor: colors.surface,
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  passwordInput: {
    flex: 1,
    height: spacing[12] + spacing[2],
    paddingHorizontal: spacing[4],
    color: colors.text.primary,
    fontSize: 16,
  },
  eyeIcon: {
    padding: spacing[2],
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: spacing[2],
    marginTop: -spacing[1],
  },
  loginButton: {
    backgroundColor: colors.primary,
    height: spacing[12] + spacing[2],
    borderRadius: spacing[3],
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing[8],
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing[5],
    paddingHorizontal: spacing[5],
  },
  footerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default styles; 