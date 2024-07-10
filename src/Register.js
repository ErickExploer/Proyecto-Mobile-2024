import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import CheckBox from 'expo-checkbox';
import { register } from './api'; // Asegúrate de que la ruta de importación sea correcta
import * as SecureStore from 'expo-secure-store';

const Register = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [isMedico, setIsMedico] = useState(false);

  const handleRegister = async () => {
    try {
      const userData = { nombre, apellido, email, password, telefono, isMedico };
      console.log('Sending registration data:', userData);

      const response = await register(userData);
      Alert.alert(
        'Registro exitoso',
        'Te has registrado correctamente. Diríjase al login para iniciar sesión',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
      
      const token = response.token;
      const role = isMedico ? 'MEDICO' : 'PACIENTE';
      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('role', role);
      
    } catch (error) {
      console.error('Error al registrarse:', error.response || error.message || error);
      Alert.alert('Error en el registro', error.response?.data?.message || 'Hubo un problema al registrarte. Intenta nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a SalPÉ</Text>
      <Image source={require('../img/Logo_ODAD.png')} style={styles.logo} />
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ingrese su nombre"
        placeholderTextColor="#aaa"
      />
      <Text style={styles.label}>Apellidos:</Text>
      <TextInput
        style={styles.input}
        value={apellido}
        onChangeText={setApellido}
        placeholder="Ingrese sus apellidos"
        placeholderTextColor="#aaa"
      />
      <Text style={styles.label}>Correo:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Ingrese su correo"
        placeholderTextColor="#aaa"
      />
      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Ingrese su contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry
      />
      <Text style={styles.label}>Teléfono:</Text>
      <TextInput
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
        placeholder="Ingrese su teléfono"
        placeholderTextColor="#aaa"
      />
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={isMedico}
          onValueChange={setIsMedico}
          color={isMedico ? 'white' : undefined}
        />
        <Text style={styles.checkboxLabel}>¿Eres Médico?</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E6793',
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: 'white',
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
});

export default Register;
