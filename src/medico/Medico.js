import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, RefreshControl, Image } from 'react-native';
import { getMedicoInfo } from '../api';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Accelerometer } from 'expo-sensors';

const Medico = ({ setIsLoggedIn }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const navigation = useNavigation();

  const fetchUserInfo = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const data = await getMedicoInfo(token);
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
    navigation.navigate('MedicoEdit');
  };

  const handleHistorial = () => {
    navigation.navigate('MedicoHistorial');
  };

  const handleTratamientos = () => {
    navigation.navigate('MedicoTratamientos');
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
        <Text style={styles.headerText}>¡Bienvenido de vuelta! 👨‍⚕️</Text>
      </View>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.imageContainer}>
          <Image source={require('../../img/MedicoImagen.png')} style={styles.mainImage} />
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
              <Text style={styles.infoText}><Text style={styles.bold}>Especialidad:</Text> {userInfo?.especialidad}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.historialButton} onPress={handleHistorial}>
            <Text style={styles.historialButtonText}>Ver Historial Médico</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.historialButton} onPress={handleTratamientos}>
            <Text style={styles.historialButtonText}>Ver Tratamientos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#1E6793',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
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
    width: 150,
    height: 150,
    resizeMode: 'contain',
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
    backgroundColor: '#1E6793',
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
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  historialButton: {
    backgroundColor: '#1E6793',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  historialButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#D9534F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Medico;
