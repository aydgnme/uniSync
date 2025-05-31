import { useAuth } from './useAuth';

export const useProfile = () => {
  const { user, loading } = useAuth();

  return {
    user,
    loading,
  };
}; 