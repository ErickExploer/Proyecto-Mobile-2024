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
      console.error('Error fetching user info:', error);
      Alert.alert('Error', 'Error fetching user info');
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
        <Text style={styles.headerText}>¡Bienvenido de vuelta! 😊</Text>
      </View>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.imageContainer}>
          {photo ? (
            <Image source={{ uri: photo.uri }} style={styles.mainImage} />
          ) : (
            <Image source={require('../../img/PacienteImagen.png')} style={styles.mainImage} />
          )}
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.userInfo}>
            <Image source={require('../../img/UserIcon.png')} style={styles.userIcon} />
            <View style={styles.userDetails}>
              <Text style={styles.infoText}><Text style={styles.bold}>Nombre:</Text> {userInfo?.nombre}</Text>
              <Text style={styles.infoText}><Text style={styles.bold}>Apellido:</Text> {userInfo?.apellido}</Text>
              <Text style={styles.infoText}><Text style={styles.bold}>Email:</Text> {userInfo?.email}</Text>
              <Text style={styles.infoText}><Text style={styles.bold}>Teléfono:</Text> {userInfo?.telefono}</Text>
              <Text style={styles.infoText}><Text style={styles.bold}>Edad:</Text> {userInfo?.edad}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Image source={require('../../img/Pencil.png')} style={styles.editIcon} />
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.routeButton} onPress={() => handleNavigate('PacienteConsulta')}>
            <Text style={styles.routeButtonText}>Ir a Consulta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.historialButton} onPress={() => handleNavigate('PacienteHistorial')}>
        <Text style={styles.historialButtonText}>Ver Historial Médico</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tratamientosButton} onPress={() => handleNavigate('PacienteTratamientos')}>
        <Text style={styles.tratamientosButtonText}>Ver Tratamientos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FFF7',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#2D6A4F',
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
    justifyContent: 'center',
    flexGrow: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  mainImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    borderRadius: 60,
    borderColor: '#95D5B2',
    borderWidth: 2,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userIcon: {
    width: 80,
    height: 80,
    marginRight: 20,
    borderRadius: 40,
    borderColor: '#95D5B2',
    borderWidth: 2,
  },
  userDetails: {
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontFamily: 'Helvetica',
  },
  bold: {
    fontWeight: 'bold',
    color: '#555',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D6A4F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  editIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: 'white',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  routeButton: {
    backgroundColor: '#2D6A4F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  routeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  historialButton: {
    backgroundColor: '#2D6A4F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  historialButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tratamientosButton: {
    backgroundColor: '#2D6A4F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  tratamientosButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#D9534F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Paciente;
