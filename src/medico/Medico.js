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
      console.error('Error fetching user info', error);
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
        <Text style={styles.headerText}>
          ¡Bienvenido de vuelta{userInfo?.nombre ? `, ${userInfo.nombre}` : ''}! 👨‍⚕️
        </Text>
      </View>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.card}>
          <Image source={require('../../img/MedicoImagen.png')} style={styles.profileImage} />
          <View style={styles.cardContent}>
            <Text style={styles.name}>{userInfo?.nombre} {userInfo?.apellido}</Text>
            <Text style={styles.email}>{userInfo?.email}</Text>
            <Text style={styles.info}>Teléfono: {userInfo?.telefono}</Text>
            <Text style={styles.info}>Edad: {userInfo?.edad}</Text>
            <Text style={styles.info}>Especialidad: {userInfo?.especialidad}</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Editar</Text>
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
    backgroundColor: '#FDFEFE',
  },
  header: {
    backgroundColor: '#1E6793',
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
    backgroundColor: '#FFA500',
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

export default Medico;
