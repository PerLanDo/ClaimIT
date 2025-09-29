import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  RadioButton,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const LoginScreen: React.FC = () => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'staff' | 'teacher' | 'admin'>('student');
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { value: 'student', label: 'Student' },
    { value: 'staff', label: 'Staff' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'admin', label: 'Admin' },
  ] as const;

  const validateEmail = (email: string): boolean => {
    const universityDomains = ['.edu', '.ac.', 'university.', 'college.'];
    return universityDomains.some(domain => 
      email.toLowerCase().includes(domain)
    );
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter your university email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Only valid university email addresses are allowed');
      return;
    }

    if (isRegistering && !fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        await register(email, role, fullName, studentId || undefined, department || undefined);
      } else {
        await login(email, role);
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setFullName('');
    setStudentId('');
    setDepartment('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>CLAIMIT</Text>
            <Text style={styles.subtitle}>Campus Lost & Found</Text>
          </View>

          {/* Role Selection */}
          <Card style={styles.roleCard}>
            <Card.Content>
              <Text style={styles.roleTitle}>Select Your Role</Text>
              <View style={styles.roleContainer}>
                {roles.map((roleOption) => (
                  <View key={roleOption.value} style={styles.roleItem}>
                    <RadioButton
                      value={roleOption.value}
                      status={role === roleOption.value ? 'checked' : 'unchecked'}
                      onPress={() => setRole(roleOption.value)}
                      color="#8B1538"
                    />
                    <Text style={styles.roleLabel}>{roleOption.label}</Text>
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Login Form */}
          <Card style={styles.formCard}>
            <Card.Content>
              <Text style={styles.loginTitle}>
                {isRegistering ? 'Create Account' : 'Login with your University Email'}
              </Text>

              {isRegistering && (
                <TextInput
                  label="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  style={styles.input}
                  mode="outlined"
                  theme={{ colors: { primary: '#8B1538' } }}
                />
              )}

              <TextInput
                label="University Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="university.email@your.edu"
                theme={{ colors: { primary: '#8B1538' } }}
              />

              {isRegistering && (
                <>
                  <TextInput
                    label="Student/Staff ID (Optional)"
                    value={studentId}
                    onChangeText={setStudentId}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { primary: '#8B1538' } }}
                  />

                  <TextInput
                    label="Department (Optional)"
                    value={department}
                    onChangeText={setDepartment}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { primary: '#8B1538' } }}
                  />
                </>
              )}

              <Text style={styles.emailNote}>
                Only valid university emails allowed
              </Text>

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
                disabled={loading}
                buttonColor="#8B1538"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  isRegistering ? 'REGISTER' : 'LOGIN'
                )}
              </Button>

              <Button
                mode="text"
                onPress={toggleMode}
                style={styles.toggleButton}
                textColor="#8B1538"
              >
                {isRegistering 
                  ? 'Already have an account? Login' 
                  : 'First time? Create Account'
                }
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>

        <Snackbar
          visible={!!error}
          onDismiss={() => setError('')}
          duration={4000}
          style={styles.snackbar}
        >
          {error}
        </Snackbar>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B1538',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#424242',
  },
  roleCard: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    minWidth: '45%',
  },
  roleLabel: {
    fontSize: 16,
    color: '#424242',
    marginLeft: 8,
  },
  formCard: {
    backgroundColor: 'white',
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  emailNote: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    marginBottom: 16,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  toggleButton: {
    marginTop: 8,
  },
  snackbar: {
    backgroundColor: '#F44336',
  },
});

export default LoginScreen;
