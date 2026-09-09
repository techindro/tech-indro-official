/**
 * Tech Indro App — Login & Sign Up Screen
 * Exact 1:1 replica of the website's login.html design and UX:
 * - Clean white card on #f8fafc with soft shadow
 * - "Back to Home" top link
 * - Official Tech Indro logo with brand title
 * - "Welcome Back" / "Log in to access your courses"
 * - Segmented tabs: [ Email ] | [ Mobile Number ]
 * - Email Form: Email + Password with "Forgot?" link + "Sign In"
 * - Mobile Form: [+91] prefix + 10-digit phone + "Send OTP" -> "Verify & Login" with "Resend OTP"
 * - Register Form: Full Name + Email + Password + "Create Account"
 * - "Or continue with" divider
 * - 2x2 Social Grid: Google, Microsoft, Facebook, LinkedIn
 * - Footer: "Don't have an account? Sign up here" toggle
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import {
  loginUser,
  registerUser,
  sendOtp,
  verifyOtp,
} from '@/services/api';
import Colors, { FontSize, FontWeight } from '@/constants/Colors';

type ActiveTab = 'email' | 'mobile';

export default function LoginScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { saveUser } = useAuth();

  // Mode: isLogin (true = Login, false = Create Account / Sign Up)
  const [isLogin, setIsLogin] = useState(true);

  // Tab: 'email' vs 'mobile' (matches login.html switchTab)
  const [activeTab, setActiveTab] = useState<ActiveTab>('email');

  // Email Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Mobile Form States
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // UI States
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Toggle between Login and Sign Up (matches toggleAuthMode)
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setOtpSent(false);
    setOtp('');
  };

  // Switch Tab: email vs mobile (matches switchTab)
  const switchTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setOtpSent(false);
    setOtp('');
  };

  // Email Login Submit
  const handleEmailLogin = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      Alert.alert('Required', 'Please enter a valid email address');
      return;
    }
    if (!password) {
      Alert.alert('Required', 'Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(email.trim().toLowerCase(), password);
      await saveUser(res.user);
      showToast('✅ Login Successful!');
      setTimeout(() => router.replace('/dashboard'), 600);
    } catch (err: any) {
      Alert.alert('Login Failed', err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Mobile Send OTP (matches sendOtp in login.html)
  const handleSendOtp = async () => {
    const clean = mobile.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) {
      Alert.alert('Invalid Mobile', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(clean);
      setOtpSent(true);
      setOtp(res.otp || '123456');
      showToast(`📲 OTP sent to +91 ${clean} (Code: ${res.otp || '123456'})`);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Mobile Verify OTP (matches verifyOtp in login.html)
  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      Alert.alert('Required', 'Please enter the OTP');
      return;
    }

    setLoading(true);
    const clean = mobile.replace(/\D/g, '').slice(-10);

    try {
      const res = await verifyOtp(clean, otp);
      await saveUser(res.user);
      showToast('✅ Login Successful!');
      setTimeout(() => router.replace('/dashboard'), 600);
    } catch (err: any) {
      Alert.alert('Verification Failed', err?.message || 'Invalid OTP. Use 123456 for testing.');
    } finally {
      setLoading(false);
    }
  };

  // Registration Submit (matches registerForm in login.html)
  const handleRegister = async () => {
    if (!regName.trim()) {
      Alert.alert('Required', 'Please enter your full name');
      return;
    }
    if (!regEmail.trim() || !/\S+@\S+\.\S+/.test(regEmail.trim())) {
      Alert.alert('Required', 'Please enter a valid email address');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      Alert.alert('Required', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(regName.trim(), regEmail.trim().toLowerCase(), regPassword);
      await saveUser(res.user);
      Alert.alert('Account Created! 🚀', `Welcome to Tech Indro, ${res.user.name}!`, [
        { text: 'Start Learning', onPress: () => router.replace('/dashboard') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Social OAuth Simulator (matches simulateOAuth in login.html)
  const handleSocialAuth = (provider: 'Google' | 'Microsoft' | 'Facebook' | 'LinkedIn') => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      const studentUser = {
        id: `${provider.toLowerCase()}_${Date.now()}`,
        name: 'Student',
        email: `student@${provider.toLowerCase()}.com`,
        provider: provider,
        createdAt: new Date().toISOString(),
      };
      await saveUser(studentUser);
      showToast(`✅ Successfully verified with ${provider}!`);
      setTimeout(() => router.replace('/dashboard'), 700);
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDark ? '#090d1f' : '#f8fafc' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back to Home Link (matches .back-home from login.html) */}
        <TouchableOpacity
          style={styles.backHomeBtn}
          onPress={() => router.replace('/')}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={16} color={isDark ? '#cbd5e1' : '#64748b'} />
          <Text style={[styles.backHomeText, { color: isDark ? '#cbd5e1' : '#64748b' }]}>Back to Home</Text>
        </TouchableOpacity>

        {/* Floating Toast Notification (matches #oauth-toast in login.html) */}
        {toastMessage ? (
          <View style={styles.toastBanner}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        ) : null}

        {/* Main Auth Card (matches .auth-card in login.html) */}
        <View style={[styles.authCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Logo (matches .auth-logo in login.html) */}
          <TouchableOpacity
            style={styles.authLogoRow}
            onPress={() => router.replace('/')}
            activeOpacity={0.8}
          >
            <Image
              source={require('@/assets/images/tech-indro-logo.png')}
              style={styles.authLogoImg}
              resizeMode="contain"
            />
            <Text style={[styles.authBrandTitle, { color: colors.text }]}>TECH INDRO</Text>
          </TouchableOpacity>

          {/* Title & Subtitle (matches #formTitle & #formSubtitle) */}
          <Text style={[styles.authTitle, { color: colors.text }]}>
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </Text>
          <Text style={[styles.authSubtitle, { color: colors.textMuted }]}>
            {isLogin ? 'Log in to access your courses' : 'Join Tech Indro to start learning'}
          </Text>

          {/* ============================================================ */}
          {/* LOGIN SECTION (matches #loginSection in login.html)          */}
          {/* ============================================================ */}
          {isLogin ? (
            <View>
              {/* Login Tabs: Email vs Mobile Number (matches .login-tabs in login.html) */}
              <View style={[styles.loginTabsContainer, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
                <TouchableOpacity
                  style={[
                    styles.tabBtn,
                    activeTab === 'email' && [styles.tabBtnActive, { backgroundColor: colors.card }],
                  ]}
                  onPress={() => switchTab('email')}
                >
                  <Text
                    style={[
                      styles.tabBtnText,
                      { color: activeTab === 'email' ? colors.text : colors.textMuted },
                      activeTab === 'email' && styles.tabBtnTextActive,
                    ]}
                  >
                    Email
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabBtn,
                    activeTab === 'mobile' && [styles.tabBtnActive, { backgroundColor: colors.card }],
                  ]}
                  onPress={() => switchTab('mobile')}
                >
                  <Text
                    style={[
                      styles.tabBtnText,
                      { color: activeTab === 'mobile' ? colors.text : colors.textMuted },
                      activeTab === 'mobile' && styles.tabBtnTextActive,
                    ]}
                  >
                    Mobile Number
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 1. Email Login Form (matches #emailLoginForm) */}
              {activeTab === 'email' && (
                <View>
                  <View style={styles.formGroup}>
                    <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Email Address</Text>
                    <TextInput
                      style={[styles.formInput, { backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderColor: colors.border, color: colors.text }]}
                      placeholder="you@example.com"
                      placeholderTextColor={colors.textLight}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <View style={styles.labelForgotRow}>
                      <Text style={[styles.formLabel, { color: colors.textSecondary, marginBottom: 0 }]}>Password</Text>
                      <TouchableOpacity
                        onPress={() => Alert.alert('Forgot Password', 'Please enter your registered email or use Mobile Number OTP to log in.')}
                      >
                        <Text style={styles.forgotLink}>Forgot?</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.passwordInputWrap, { backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderColor: colors.border }]}>
                      <TextInput
                        style={[styles.passwordTextInput, { color: colors.text }]}
                        placeholder="••••••••"
                        placeholderTextColor={colors.textLight}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                        <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.authBtn, loading && styles.authBtnDisabled]}
                    onPress={handleEmailLogin}
                    disabled={loading}
                    activeOpacity={0.85}
                  >
                    {loading ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Text style={styles.authBtnText}>Sign In</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* 2. Mobile Login Form (matches #mobileLoginForm) */}
              {activeTab === 'mobile' && (
                <View>
                  {!otpSent ? (
                    <View style={styles.formGroup}>
                      <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Mobile Number</Text>
                      <View style={styles.mobileRow}>
                        <View style={[styles.prefixBox, { backgroundColor: isDark ? '#334155' : '#e2e8f0', borderColor: colors.border }]}>
                          <Text style={[styles.prefixText, { color: colors.text }]}>+91</Text>
                        </View>
                        <TextInput
                          style={[styles.formInput, styles.mobileInput, { backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderColor: colors.border, color: colors.text }]}
                          placeholder="9876543210"
                          placeholderTextColor={colors.textLight}
                          keyboardType="phone-pad"
                          maxLength={10}
                          value={mobile}
                          onChangeText={setMobile}
                        />
                      </View>

                      <TouchableOpacity
                        style={[styles.authBtn, loading && styles.authBtnDisabled]}
                        onPress={handleSendOtp}
                        disabled={loading}
                        activeOpacity={0.85}
                      >
                        {loading ? (
                          <ActivityIndicator color="#ffffff" size="small" />
                        ) : (
                          <Text style={styles.authBtnText}>Send OTP</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.formGroup}>
                      <View style={styles.labelForgotRow}>
                        <Text style={[styles.formLabel, { color: colors.textSecondary, marginBottom: 0 }]}>Enter OTP</Text>
                        <TouchableOpacity onPress={handleSendOtp}>
                          <Text style={styles.forgotLink}>Resend OTP</Text>
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        style={[styles.formInput, { backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderColor: colors.border, color: colors.text, textAlign: 'center', fontSize: 20, letterSpacing: 6, fontWeight: '700' }]}
                        placeholder="123456"
                        placeholderTextColor={colors.textLight}
                        keyboardType="number-pad"
                        maxLength={6}
                        value={otp}
                        onChangeText={setOtp}
                        autoFocus
                      />

                      <TouchableOpacity
                        style={[styles.authBtn, loading && styles.authBtnDisabled]}
                        onPress={handleVerifyOtp}
                        disabled={loading}
                        activeOpacity={0.85}
                      >
                        {loading ? (
                          <ActivityIndicator color="#ffffff" size="small" />
                        ) : (
                          <Text style={styles.authBtnText}>Verify & Login</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          ) : (
            /* ============================================================ */
            /* REGISTRATION FORM (matches #registerForm in login.html)      */
            /* ============================================================ */
            <View>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Full Name</Text>
                <TextInput
                  style={[styles.formInput, { backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderColor: colors.border, color: colors.text }]}
                  placeholder="John Doe"
                  placeholderTextColor={colors.textLight}
                  value={regName}
                  onChangeText={setRegName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Email Address</Text>
                <TextInput
                  style={[styles.formInput, { backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderColor: colors.border, color: colors.text }]}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={regEmail}
                  onChangeText={setRegEmail}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Password</Text>
                <View style={[styles.passwordInputWrap, { backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderColor: colors.border }]}>
                  <TextInput
                    style={[styles.passwordTextInput, { color: colors.text }]}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textLight}
                    secureTextEntry={!showRegPassword}
                    value={regPassword}
                    onChangeText={setRegPassword}
                  />
                  <TouchableOpacity onPress={() => setShowRegPassword(!showRegPassword)} style={{ padding: 4 }}>
                    <Ionicons name={showRegPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.authBtn, loading && styles.authBtnDisabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.authBtnText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Divider (matches .auth-divider in login.html) */}
          <View style={styles.authDivider}>
            <View style={[styles.dividerLine, { borderBottomColor: colors.border }]} />
            <Text style={[styles.dividerSpan, { color: colors.textLight }]}>Or continue with</Text>
            <View style={[styles.dividerLine, { borderBottomColor: colors.border }]} />
          </View>

          {/* Social Grid (matches .social-grid in login.html) */}
          <View style={styles.socialGrid}>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleSocialAuth('Google')}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={17} color="#EA4335" />
              <Text style={[styles.socialBtnText, { color: colors.text }]}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleSocialAuth('Microsoft')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="microsoft" size={17} color="#00a4ef" />
              <Text style={[styles.socialBtnText, { color: colors.text }]}>Microsoft</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleSocialAuth('Facebook')}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-facebook" size={17} color="#1877F2" />
              <Text style={[styles.socialBtnText, { color: colors.text }]}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleSocialAuth('LinkedIn')}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-linkedin" size={17} color="#0A66C2" />
              <Text style={[styles.socialBtnText, { color: colors.text }]}>LinkedIn</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Switch Link (matches .auth-footer in login.html) */}
          <View style={styles.authFooter}>
            <Text style={[styles.authFooterText, { color: colors.textMuted }]}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Text style={styles.authFooterLink} onPress={toggleAuthMode}>
                {isLogin ? 'Sign up here' : 'Sign in here'}
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    minHeight: '100%',
  },

  // Back to Home Link (matches .back-home)
  backHomeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    alignSelf: 'center',
    maxWidth: 450,
    width: '100%',
  },
  backHomeText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Toast
  toastBanner: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 14,
    maxWidth: 450,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Auth Card (matches .auth-card from login.html)
  authCard: {
    width: '100%',
    maxWidth: 450,
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 25,
    elevation: 4,
  },

  // Auth Logo (matches .auth-logo)
  authLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  authLogoImg: {
    height: 48,
    width: 48,
    borderRadius: 12,
  },
  authBrandTitle: {
    fontSize: 22,
    letterSpacing: 1.5,
    fontWeight: '700',
  },

  // Title & Subtitle (matches .auth-title & .auth-subtitle)
  authTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  authSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },

  // Tabs (matches .login-tabs)
  loginTabsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
    padding: 4,
    borderRadius: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabBtnActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    fontWeight: '700',
  },

  // Forms (matches .form-group, .form-label, .form-input)
  formGroup: {
    marginBottom: 18,
  },
  formLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    marginBottom: 6,
  },
  labelForgotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotLink: {
    fontSize: 12,
    color: '#ff6b35',
    fontWeight: '600',
  },
  formInput: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14.5,
  },
  passwordInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  passwordTextInput: {
    flex: 1,
    fontSize: 14.5,
    height: '100%',
  },

  // Mobile Row
  mobileRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  prefixBox: {
    width: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 48,
  },
  prefixText: {
    fontSize: 14,
    fontWeight: '600',
  },
  mobileInput: {
    flex: 1,
    height: 48,
  },

  // Primary Button (matches .auth-btn)
  authBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#ff6b35',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  authBtnDisabled: {
    opacity: 0.7,
  },
  authBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },

  // Divider (matches .auth-divider)
  authDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    borderBottomWidth: 1,
  },
  dividerSpan: {
    paddingHorizontal: 12,
    fontSize: 13,
  },

  // Social Grid (matches .social-grid)
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  socialBtn: {
    width: '48%',
    paddingVertical: 11,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
  },

  // Footer (matches .auth-footer)
  authFooter: {
    marginTop: 24,
    alignItems: 'center',
  },
  authFooterText: {
    fontSize: 13.5,
  },
  authFooterLink: {
    color: '#ff6b35',
    fontWeight: '700',
  },
});
