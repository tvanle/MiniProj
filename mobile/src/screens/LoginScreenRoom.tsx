/**
 * LoginScreenRoom - Man hinh dang nhap (Room Database pattern)
 * Tuong duong voi LoginActivity trong Android dung Room
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppDB } from '../dal/AppDB';
import { storageHelper } from '../dal/StorageHelper';
import { showAlert } from '../utils/alert';
import type { RootStackParamList } from '../navigation/AppNavigator';

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreenRoom() {
  const navigation = useNavigation<LoginNavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [dbReady, setDbReady] = useState(false);

  // Khoi tao database khi component mount
  useEffect(() => {
    const initDB = async () => {
      await AppDB.getInstance();
      setDbReady(true);
    };
    initDB();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showAlert('Loi', 'Vui long nhap day du thong tin');
      return;
    }

    setLoading(true);

    try {
      const db = await AppDB.getInstance();
      // Goi dao().login() - tuong duong db.dao().login(u, p) trong Android
      const account = await db.dao().login(username, password);

      if (account !== null) {
        // Luu vao SharedPreferences (AsyncStorage)
        await storageHelper.saveLoginState(username, true);
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

  if (!dbReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Dang khoi tao database...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Student Manager</Text>
        <Text style={styles.subtitle}>Room Database Pattern</Text>

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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
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
    fontSize: 14,
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 30,
    fontWeight: '500',
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
