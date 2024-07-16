// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SplashScreen from './src/SplashScreen'; 
import Login from './src/Login';
import Register from './src/Register';
import Paciente from './src/paciente/Paciente';
import PacienteEdit from './src/paciente/PacienteEdit';
import PacienteConsulta from './src/paciente/PacienteConsulta';
import PacienteHistorial from './src/paciente/PacienteHistorial';
import PacienteTratamientos from './src/paciente/PacienteTratamientos';
import PacienteMisMedicos from './src/paciente/PacienteMisMedicos';
import PacienteListaMedicos from './src/paciente/PacienteListaMedicos';
import PacienteUbicacion from './src/paciente/PacienteUbicacion';
import Medico from './src/medico/Medico';
import MedicoEdit from './src/medico/MedicoEdit';
import MedicoHistorial from './src/medico/MedicoHistorial';
import MedicoHistorialEdit from './src/medico/MedicoHistorialEdit';
import MedicoTratamientos from './src/medico/MedicoTratamientos';
import MedicoTratamientosEdit from './src/medico/MedicoTratamientosEdit';
import MedicoRuta from './src/medico/MedicoRuta';
import * as SecureStore from 'expo-secure-store';
import { MedicoProvider } from './src/paciente/MedicoContext'; // Importa el proveedor del contexto

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
    <Stack.Screen 
      name="Paciente" 
      options={{ headerShown: false }}
    >
      {props => <Paciente {...props} setIsLoggedIn={setIsLoggedIn} />}
    </Stack.Screen>
    <Stack.Screen 
      name="PacienteConsulta" 
      component={PacienteConsulta}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="PacienteEdit" 
      component={PacienteEdit}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="PacienteListaMedicos" 
      component={PacienteListaMedicos}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="PacienteHistorial" 
      component={PacienteHistorial}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="PacienteTratamientos" 
      component={PacienteTratamientos}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="PacienteMisMedicos" 
      component={PacienteMisMedicos}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Ubicación" 
      component={PacienteUbicacion}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const MedicoStack = ({ setIsLoggedIn }) => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Medico" 
      options={{ headerShown: false }}
    >
      {props => <Medico {...props} setIsLoggedIn={setIsLoggedIn} />}
    </Stack.Screen>
    <Stack.Screen name="MedicoEdit" component={MedicoEdit} options={{ headerShown: false }} />
    <Stack.Screen name="MedicoHistorial" component={MedicoHistorial}  options={{ headerShown: false }}/>
    <Stack.Screen name="MedicoHistorialEdit" component={MedicoHistorialEdit} options={{ headerShown: false }} />
    <Stack.Screen name="MedicoTratamientos" component={MedicoTratamientos} options={{ headerShown: false }} />
    <Stack.Screen name="MedicoTratamientosEdit" component={MedicoTratamientosEdit} options={{ headerShown: false }}/>
    <Stack.Screen name="MedicoRuta" component={MedicoRuta} options={{ headerShown: false }}/>
  </Stack.Navigator>
);

const PacienteTabNavigator = ({ setIsLoggedIn }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Inicio':
            iconName = 'home';
            break;
          case 'Historial':
            iconName = 'history';
            break;
          case 'Tratamientos':
            iconName = 'healing';
            break;
          case 'Mis Médicos':
            iconName = 'people';
            break;
          case 'Lista de Médicos':
            iconName = 'list';
            break;
          case 'Ubicación':
            iconName = 'map';
            break;
          default:
            iconName = 'circle';
            break;
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: '#D3D3D3',
      tabBarStyle: {
        backgroundColor: '#1D8348',
        paddingTop: 5,
        paddingBottom: 20,
        height: 80,
      },
      tabBarLabelStyle: {
        fontSize: 12,
      },
    })}
  >
    <Tab.Screen name="Inicio">
      {props => <PacienteStack {...props} setIsLoggedIn={setIsLoggedIn} />}
    </Tab.Screen>
    <Tab.Screen name="Historial" component={PacienteHistorial} />
    <Tab.Screen name="Tratamientos" component={PacienteTratamientos} />
    <Tab.Screen name="Mis Médicos" component={PacienteMisMedicos} />
    <Tab.Screen name="Lista de Médicos" component={PacienteListaMedicos} />
    <Tab.Screen name="Ubicación" component={PacienteUbicacion} />
  </Tab.Navigator>
);

const MedicoTabNavigator = ({ setIsLoggedIn }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Inicio':
            iconName = 'home';
            break;
          case 'Historial':
            iconName = 'history';
            break;
          case 'Tratamientos':
            iconName = 'healing';
            break;
          case 'Ruta':
            iconName = 'map';
            break;
          default:
            iconName = 'circle';
            break;
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: '#D3D3D3',
      tabBarStyle: {
        backgroundColor: '#1E6793',
        paddingTop: 5,
        paddingBottom: 20,
        height: 80,
      },
      tabBarLabelStyle: {
        fontSize: 12,
      },
    })}
  >
    <Tab.Screen name="Inicio">
      {props => <MedicoStack {...props} setIsLoggedIn={setIsLoggedIn} />}
    </Tab.Screen>
    <Tab.Screen name="Historial" component={MedicoHistorial} />
    <Tab.Screen name="Tratamientos" component={MedicoTratamientos} />
    <Tab.Screen name="Ruta" component={MedicoRuta} />
  </Tab.Navigator>
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
    <MedicoProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="App" options={{ headerShown: false }}>
            {() => (
              isLoggedIn ? (
                role === 'ROLE_PACIENTE' ? (
                  <PacienteTabNavigator setIsLoggedIn={setIsLoggedIn} />
                ) : (
                  <MedicoTabNavigator setIsLoggedIn={setIsLoggedIn} />
                )
              ) : (
                <AuthStack setIsLoggedIn={(status, userRole) => { setIsLoggedIn(status); setRole(userRole); }} />
              )
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </MedicoProvider>
  );
};

export default App;
