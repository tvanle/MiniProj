import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from './login-styles';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const stagger1 = useRef(new Animated.Value(0)).current;
  const stagger2 = useRef(new Animated.Value(0)).current;
  const stagger3 = useRef(new Animated.Value(0)).current;
  const stagger4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start(() => {
      Animated.stagger(80, [
        Animated.timing(stagger1, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(stagger2, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(stagger3, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(stagger4, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  const makeStaggerStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
  });

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <Animated.View
            style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Welcome back!</Text>
          </Animated.View>

          {/* Username Input */}
          <Animated.View style={makeStaggerStyle(stagger1)}>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="#aaa" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Your Username / Email"
                placeholderTextColor="#bbb"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </Animated.View>

          {/* Password Input */}
          <Animated.View style={[makeStaggerStyle(stagger2), styles.mt14]}>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#aaa" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Your Password"
                placeholderTextColor="#bbb"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={18}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Forgot Password */}
          <Animated.View style={[makeStaggerStyle(stagger2), styles.forgotRow]}>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Login Button */}
          <Animated.View style={makeStaggerStyle(stagger3)}>
            <TouchableOpacity
              style={styles.loginBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Booking')}
            >
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Signup link */}
          <Animated.View style={[makeStaggerStyle(stagger3), styles.signupRow]}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.signupLink}>Signup</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <Animated.View style={[makeStaggerStyle(stagger4), styles.dividerRow]}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.dividerLine} />
          </Animated.View>

          {/* Facebook Button */}
          <Animated.View style={makeStaggerStyle(stagger4)}>
            <TouchableOpacity style={styles.facebookBtn} activeOpacity={0.85}>
              <FontAwesome name="facebook" size={20} color="#fff" style={styles.socialIcon} />
              <Text style={styles.facebookBtnText}>Login with Facebook</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Google Button */}
          <Animated.View style={[makeStaggerStyle(stagger4), styles.mt12]}>
            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
              <FontAwesome name="google" size={20} color="#DB4437" style={styles.socialIcon} />
              <Text style={styles.googleBtnText}>Login with Google</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
