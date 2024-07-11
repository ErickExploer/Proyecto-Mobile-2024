import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getPacienteInfo, getTratamientos } from '../api'; // Asegúrate de que la ruta sea correcta
import * as SecureStore from 'expo-secure-store';

const PacienteTratamientos = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [tratamientos, setTratamientos] = useState([]);

  const fetchUserInfo = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const data = await getPacienteInfo();
        setUserInfo(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Error fetching user info');
    }
  };

  const fetchTratamientos = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token && userInfo) {
        const tratamientosData = await getTratamientos(userInfo.id, token);
        setTratamientos(tratamientosData);
      }
    } catch (error) {
      console.error('Error fetching tratamientos:', error);
      Alert.alert('Error', 'Error fetching tratamientos');
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      fetchTratamientos();
    }
  }, [userInfo]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tratamientos</Text>
      </View>
      <View style={styles.content}>
        {tratamientos.length > 0 ? (
          tratamientos.map((tratamiento) => (
            <View key={tratamiento.id} style={styles.tratamientoItem}>
              <Image source={require('../../img/medicine.png')} style={styles.icon} />
              <View style={styles.tratamientoDetails}>
                <Text style={styles.tratamientoName}>Nombre: {tratamiento.nombreTratamiento}</Text>
                <Text style={styles.tratamientoDescription}><Text style={styles.bold}>Descripción:</Text> {tratamiento.descripcion}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noTratamientosText}>No hay tratamientos disponibles.</Text>
        )}
        <TouchableOpacity style={styles.loadMoreButton}>
          <Text style={styles.loadMoreButtonText}>Cargar más...</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  tratamientoItem: {
    flexDirection: 'row',
    backgroundColor: '#1D8348',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    marginTop: 10, // Espaciado para que no esté tan pegado a la parte superior
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  tratamientoDetails: {
    flex: 1,
  },
  tratamientoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  tratamientoDescription: {
    fontSize: 16,
    color: 'white',
  },
  bold: {
    fontWeight: 'bold',
  },
  noTratamientosText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  loadMoreButton: {
    backgroundColor: '#1D8348',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  loadMoreButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#95D5B2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
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
});

export default PacienteTratamientos;
