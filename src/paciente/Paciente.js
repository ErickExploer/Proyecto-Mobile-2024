import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import { getPacienteInfo } from '../api'; // Asegúrate de que la ruta sea correcta
import * as SecureStore from 'expo-secure-store';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Accelerometer } from 'expo-sensors';

const Paciente = ({ setIsLoggedIn }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [photo, setPhoto] = useState(null); // Nuevo estado para la foto
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (route.params?.photo) {
      setPhoto(route.params.photo);
    }
  }, [route.params?.photo]);

  const fetchUserInfo = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const data = await getPacienteInfo(token);
        setUserInfo(data);
      }
    } catch (error) {
      
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserInfo();
    setRefreshing(false);
  };

  const handleEdit = () => {
    navigation.navigate('PacienteEdit'); // Asegúrate de tener esta ruta configurada en tu navegación
  };

  const handleNavigate = (route) => {
    navigation.navigate(route);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    setIsLoggedIn(false, null);
  };

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        const currentTime = Date.now();
        if (
          (Math.abs(accelerometerData.x) > 1.5 || 
          Math.abs(accelerometerData.y) > 1.5 || 
          Math.abs(accelerometerData.z) > 1.5) &&
          currentTime - lastUpdateTime > 5000
        ) {
          setLastUpdateTime(currentTime);
          onRefresh();
        }
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome, {userInfo?.nombre} 😊</Text>
      </View>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.card}>
          <Image source={photo ? { uri: photo.uri } : require('../../img/PacienteImagen.png')} style={styles.profileImage} />
          <View style={styles.cardContent}>
            <Text style={styles.name}>{userInfo?.nombre} {userInfo?.apellido}</Text>
            <Text style={styles.email}>{userInfo?.email}</Text>
            <Text style={styles.info}>Teléfono: {userInfo?.telefono}</Text>
            <Text style={styles.info}>Edad: {userInfo?.edad}</Text>
            <Text style={styles.info}>Dirección: Lima, Peru</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.joinButton} onPress={() => handleNavigate('PacienteConsulta')}>
              <Text style={styles.joinButtonText}>Ir a Consulta</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FFF7',
  },
  header: {
    backgroundColor: '#1D8348',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#777',
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: '#1D8348',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  joinButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#D9534F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Paciente;
