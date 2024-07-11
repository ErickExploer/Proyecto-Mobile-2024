import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { login } from './api'; // Asegúrate de que la ruta sea correcta
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Login = ({ navigation, setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const base64UrlDecode = (str) => {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    return decodeURIComponent(escape(atob(str)));
  };

  const decodeToken = (token) => {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT inválido');
    }
    const payload = parts[1];
    const decodedPayload = base64UrlDecode(payload);
    return JSON.parse(decodedPayload);
  };

  const handleLogin = async () => {
    try {
      console.log('Logging in with:', { email, password });
      const response = await login(email, password);
      const token = response.token;
      await SecureStore.setItemAsync('token', token);

      const decodedToken = decodeToken(token); // Usar la función de decodificación
      const role = decodedToken.role;
      await SecureStore.setItemAsync('role', role);
      
      Alert.alert('Login exitoso', 'Te has logueado correctamente');
      setIsLoggedIn(true, role);
      if (role === 'ROLE_PACIENTE') {
        navigation.navigate('Paciente'); // Navegar a Paciente si el rol es paciente
      } else {
        navigation.navigate('Medico'); // Navegar a Medico si el rol es medico
      }
    } catch (error) {
      Alert.alert('Error en el login', 'Hubo un problema al iniciar sesión. Intenta nuevamente.');
      console.error('Login failed', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Bienvenido a SalPÉ</Text>
        <Image source={require('../img/Logo_ODAD.png')} style={styles.logo} />
        <Text style={styles.label}>Correo:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Ingrese su correo"
          placeholderTextColor="#aaa"
        />
        <Text style={styles.label}>Contraseña:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            value={password}
            onChangeText={setPassword}
            placeholder="Ingrese su contraseña"
            placeholderTextColor="#aaa"
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Icon
              name={isPasswordVisible ? 'visibility' : 'visibility-off'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <Text style={styles.or}>O</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Registro</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E6793',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'white',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  label: {
    color: 'white',
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingRight: 40, // Añadir espacio para el icono de visibilidad
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  button: {
    width: '80%',
    backgroundColor: 'white',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#1E6793',
    fontWeight: 'bold',
  },
  or: {
    color: 'white',
    marginVertical: 10,
  },
});

export default Login;
