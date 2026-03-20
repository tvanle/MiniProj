/**
 * LoginScreen - Man hinh dang nhap
 * Tuong duong voi LoginActivity trong Android
 *
 * Chuc nang:
 * - Nhap username/password
 * - Kiem tra trong SQLite (Accounts table)
 * - Luu trang thai vao AsyncStorage (SharedPreferences)
 * - Chuyen sang ScoreScreen neu thanh cong
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { dbHelper } from '../dal/DBHelper';
import { storageHelper } from '../dal/StorageHelper';
import { showAlert } from '../utils/alert';
import type { RootStackParamList } from '../navigation/AppNavigator';

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showAlert('Loi', 'Vui long nhap day du thong tin');
      return;
    }

    setLoading(true);

    try {
      // Kiem tra login trong SQLite
      const isValid = await dbHelper.checkLogin(username, password);

      if (isValid) {
        // Luu trang thai vao AsyncStorage (SharedPreferences)
        await storageHelper.saveLoginState(username, true);

        // Chuyen sang ScoreScreen
        navigation.replace('Score');
      } else {
        showAlert('Loi', 'Sai ten dang nhap hoac mat khau');
      }
    } catch (error) {
      showAlert('Loi', 'Khong the dang nhap');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Student Manager</Text>
        <Text style={styles.subtitle}>Dang nhap</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Dang nhap...' : 'Dang nhap'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Tai khoan mac dinh: admin / 123
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  form: {
    padding: 20,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  hint: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 12,
  },
});
