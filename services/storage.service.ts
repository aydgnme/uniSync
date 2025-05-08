import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  private readonly AUTH_TOKEN_KEY = 'token';
  private readonly USER_DATA_KEY = 'userData';

  async getAuthToken(): Promise<string | null> {
    return AsyncStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  async setAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem(this.AUTH_TOKEN_KEY, token);
  }

  async getUserData<T>(): Promise<T | null> {
    const data = await AsyncStorage.getItem(this.USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  async setUserData<T>(data: T): Promise<void> {
    await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(data));
  }

  async clearAuth(): Promise<void> {
    await AsyncStorage.multiRemove([this.AUTH_TOKEN_KEY, this.USER_DATA_KEY]);
  }
}

export const storageService = new StorageService(); 