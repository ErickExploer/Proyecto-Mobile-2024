import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { getPacienteInfo, getTratamientos } from '../api'; // Asegúrate de que la ruta sea correcta
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

const PacienteTratamientos = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [tratamientos, setTratamientos] = useState([]);
  const [numeros, setNumeros] = useState([]);
  const [sound, setSound] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRefs = useRef([]);

  const fetchUserInfo = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const data = await getPacienteInfo(token);
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

        // Extraer los números de tratamiento
        const numerosExtraidos = tratamientosData.map(tratamiento => extraerNumero(tratamiento.descripcion)).filter(num => num !== null);
        setNumeros(numerosExtraidos);

        // Configurar alarmas para cada número extraído
        numerosExtraidos.forEach(numero => {
          const intervalId = configurarAlarma(numero);
          intervalRefs.current.push(intervalId);
        });
      }
    } catch (error) {
      console.error('Error fetching tratamientos:', error);
      Alert.alert('Error', 'Error fetching tratamientos');
    }
  };

  const extraerNumero = (descripcion) => {
    const numero = descripcion.match(/\d+/);
    return numero ? parseInt(numero[0]) : null;
  };

  const configurarAlarma = (intervaloEnMinutos) => {
    const intervaloEnMilisegundos = intervaloEnMinutos * 60 * 1000; // Convertir minutos a milisegundos
    const intervalId = setInterval(async () => {
      for (let i = 0; i < 5; i++) { // Vibrar 5 veces
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        await new Promise(resolve => setTimeout(resolve, 500)); // Esperar 500ms entre vibraciones
      }
      playSound();
    }, intervaloEnMilisegundos);
    return intervalId;
  };

  const playSound = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      console.log("Loading sound...");
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../../assets/alarma.mp3'), 
        {
          shouldPlay: true,
          staysActiveInBackground: true,
          isLooping: false,
        }
      );
      console.log("Sound loaded");
      setSound(newSound);
      await newSound.playAsync();
      console.log("Sound is playing");
    } catch (error) {
      console.error('Error playing sound:', error);
      Alert.alert('Error', 'Error playing sound');
    }
  };

  const stopAlarms = () => {
    intervalRefs.current.forEach(intervalId => clearInterval(intervalId));
    intervalRefs.current = [];
    if (sound) {
      sound.stopAsync().then(() => {
        sound.unloadAsync();
      });
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

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserInfo();
    await fetchTratamientos();
    setRefreshing(false);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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
        <TouchableOpacity style={styles.stopButton} onPress={stopAlarms}>
          <Text style={styles.stopButtonText}>Detener Alarma</Text>
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
  stopButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PacienteTratamientos;
