import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/Login';
import Register from './src/Register';
import Paciente from './src/paciente/Paciente';
import PacienteEdit from './src/paciente/PacienteEdit';
import PacienteConsulta from './src/paciente/PacienteConsulta';
import PacienteHistorial from './src/paciente/PacienteHistorial';
import PacienteTratamientos from './src/paciente/PacienteTratamientos';
import PacienteMisMedicos from './src/paciente/PacienteMisMedicos'
import PacienteListaMedicos from './src/paciente/PacienteListaMedicos'
import Medico from './src/medico/Medico'; // Asegúrate de que la ruta sea correcta
import MedicoEdit from './src/medico/MedicoEdit'
import MedicoHistorial from './src/medico/MedicoHistorial'
import MedicoHistorialEdit from './src/medico/MedicoHistorialEdit'
import MedicoTratamientos from './src/medico/MedicoTratamientos'
import MedicoTratamientosEdit from './src/medico/MedicoTratamientosEdit'

import * as SecureStore from 'expo-secure-store';

const Stack = createStackNavigator();

const AuthStack = ({ setIsLoggedIn }) => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login">
      {props => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
    </Stack.Screen>
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
);

const PacienteStack = ({ setIsLoggedIn }) => (
  <Stack.Navigator>
    <Stack.Screen name="Paciente">
      {props => <Paciente {...props} setIsLoggedIn={setIsLoggedIn} />}
    </Stack.Screen>
    <Stack.Screen name="PacienteEdit" component={PacienteEdit} />
    <Stack.Screen name="PacienteConsulta" component={PacienteConsulta} />
    <Stack.Screen name="PacienteHistorial" component={PacienteHistorial} />
    <Stack.Screen name="PacienteTratamientos" component={PacienteTratamientos} />
    <Stack.Screen name="PacienteMisMedicos" component={PacienteMisMedicos} />
    <Stack.Screen name="PacienteListaMedicos" component={PacienteListaMedicos} />


  </Stack.Navigator>
);

const MedicoStack = ({ setIsLoggedIn }) => (
  <Stack.Navigator>
    <Stack.Screen name="Medico">
      {props => <Medico {...props} setIsLoggedIn={setIsLoggedIn} />}
    </Stack.Screen>
    <Stack.Screen name="MedicoEdit" component={MedicoEdit} />
    <Stack.Screen name="MedicoHistorial" component={MedicoHistorial} />
    <Stack.Screen name="MedicoHistorialEdit" component={MedicoHistorialEdit} />
    <Stack.Screen name="MedicoTratamientos" component={MedicoTratamientos} />
    <Stack.Screen name="MedicoTratamientosEdit" component={MedicoTratamientosEdit} />

  </Stack.Navigator>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const decodedToken = decodeToken(token);
        setRole(decodedToken.role);
        setIsLoggedIn(true);
      }
    };

    checkLoginStatus();
  }, []);

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

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        role === 'ROLE_PACIENTE' ? (
          <PacienteStack setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <MedicoStack setIsLoggedIn={setIsLoggedIn} />
        )
      ) : (
        <AuthStack setIsLoggedIn={(status, userRole) => { setIsLoggedIn(status); setRole(userRole); }} />
      )}
    </NavigationContainer>
  );
};

export default App;
