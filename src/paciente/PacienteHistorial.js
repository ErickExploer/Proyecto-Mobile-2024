import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getPacienteInfo, getHistorial } from '../api'; // Asegúrate de que la ruta sea correcta
import * as SecureStore from 'expo-secure-store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PacienteHistorial = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [historial, setHistorial] = useState([]);

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

  const fetchHistorial = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token && userInfo) {
        const historialData = await getHistorial(userInfo.id, token);
        setHistorial(historialData);
      }
    } catch (error) {
      console.error('Error fetching historial:', error);
      Alert.alert('Error', 'Error fetching historial');
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      fetchHistorial();
    }
  }, [userInfo]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Historial Médico</Text>
      </View>
      <View style={styles.content}>
        {historial.length > 0 ? (
          historial.map((historialM) => (
            <View key={historialM.id} style={styles.historialItem}>
              <Image source={require('../../img/Clock.png')} style={styles.icon} />
              <View style={styles.historialDetails}>
                <Text style={styles.historialDate}>Fecha: {format(new Date(historialM.fecha), 'dd MMMM, yyyy h:mm a', { locale: es })}</Text>
                <Text style={styles.historialDescription}><Text style={styles.bold}>Descripción:</Text> {historialM.descripcion}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noHistorialText}>No hay Historial Médico.</Text>
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
  historialItem: {
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
  historialDetails: {
    flex: 1,
  },
  historialDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  historialDescription: {
    fontSize: 16,
    color: 'white',
  },
  bold: {
    fontWeight: 'bold',
  },
  noHistorialText: {
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
});

export default PacienteHistorial;
