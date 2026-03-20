/**
 * StorageHelper - AsyncStorage Helper
 * Tuong duong voi SharedPreferences trong Android
 *
 * Luu tru key-value don gian:
 * - isLogin: boolean
 * - username: string
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'LOGIN';

export interface LoginState {
  isLogin: boolean;
  username: string;
}

class StorageHelper {
  // Luu trang thai login (tuong duong editor.putString/putBoolean + apply)
  async saveLoginState(username: string, isLogin: boolean): Promise<void> {
    const data: LoginState = { username, isLogin };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // Doc trang thai login (tuong duong sp.getString/getBoolean)
  async getLoginState(): Promise<LoginState> {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as LoginState;
    }
    return { isLogin: false, username: '' };
  }

  // Xoa trang thai login (logout)
  async clearLoginState(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  // Kiem tra da login chua
  async isLoggedIn(): Promise<boolean> {
    const state = await this.getLoginState();
    return state.isLogin;
  }

  // Lay username hien tai
  async getUsername(): Promise<string> {
    const state = await this.getLoginState();
    return state.username;
  }
}

// Singleton instance
export const storageHelper = new StorageHelper();
