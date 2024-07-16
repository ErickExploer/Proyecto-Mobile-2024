import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Platform } from 'react-native';
import { createRuta } from '../api'; // Asegúrate de tener esta función en tu archivo api.js
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const MedicoMiRuta = ({ navigation }) => {
  const [inicio, setInicio] = useState({ latitud: '', longitud: '', direccion: '', descripcion: '' });
  const [final, setFinal] = useState({ latitud: '', longitud: '', direccion: '', descripcion: '' });
  const [fechaRuta, setFechaRuta] = useState(new Date());
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFin, setHoraFin] = useState(new Date());
  const [showFechaPicker, setShowFechaPicker] = useState(false);
  const [showHoraInicioPicker, setShowHoraInicioPicker] = useState(false);
  const [showHoraFinPicker, setShowHoraFinPicker] = useState(false);

  useEffect(() => {
    const fetchSelectedPosition = async () => {
      const selectedPosition = JSON.parse(await AsyncStorage.getItem('selectedPosition'));
      if (selectedPosition) {
        if (!inicio.latitud) {
          setInicio({ ...inicio, latitud: selectedPosition.lat, longitud: selectedPosition.lng });
        } else {
          setFinal({ ...final, latitud: selectedPosition.lat, longitud: selectedPosition.lng });
        }
        await AsyncStorage.removeItem('selectedPosition');
      }
    };

    fetchSelectedPosition();
  }, []);

  const handleFechaChange = (event, selectedDate) => {
    const currentDate = selectedDate || fechaRuta;
    setShowFechaPicker(Platform.OS === 'ios');
    setFechaRuta(currentDate);
  };

  const handleHoraInicioChange = (event, selectedTime) => {
    const currentTime = selectedTime || horaInicio;
    setShowHoraInicioPicker(Platform.OS === 'ios');
    setHoraInicio(currentTime);
  };

  const handleHoraFinChange = (event, selectedTime) => {
    const currentTime = selectedTime || horaFin;
    setShowHoraFinPicker(Platform.OS === 'ios');
    setHoraFin(currentTime);
  };

  const handleSubmit = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await createRuta({
        fechaRuta: fechaRuta.toISOString().split('T')[0],
        horaInicio: horaInicio.toTimeString().split(' ')[0],
        horaFin: horaFin.toTimeString().split(' ')[0],
        ubicacionInicio: inicio,
        ubicacionFinal: final
      }, token);
      Alert.alert('Éxito', 'Ruta creada exitosamente');
      navigation.navigate('MedicoMisPacientes');
    } catch (error) {
      console.error('Error creando la ruta:', error);
      Alert.alert('Error', 'Error creando la ruta');
    }
  };

  const handleMapRedirect = () => {
    navigation.navigate('Mapa');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Ruta</Text>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ubicación de Inicio:</Text>
          <TextInput
            style={styles.input}
            placeholder="Latitud"
            value={inicio.latitud}
            onChangeText={(text) => setInicio({ ...inicio, latitud: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Longitud"
            value={inicio.longitud}
            onChangeText={(text) => setInicio({ ...inicio, longitud: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={inicio.direccion}
            onChangeText={(text) => setInicio({ ...inicio, direccion: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={inicio.descripcion}
            onChangeText={(text) => setInicio({ ...inicio, descripcion: text })}
          />
          <TouchableOpacity onPress={handleMapRedirect} style={styles.mapButton}>
            <Text style={styles.mapButtonText}>Seleccionar en Mapa</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ubicación Final:</Text>
          <TextInput
            style={styles.input}
            placeholder="Latitud"
            value={final.latitud}
            onChangeText={(text) => setFinal({ ...final, latitud: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Longitud"
            value={final.longitud}
            onChangeText={(text) => setFinal({ ...final, longitud: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={final.direccion}
            onChangeText={(text) => setFinal({ ...final, direccion: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={final.descripcion}
            onChangeText={(text) => setFinal({ ...final, descripcion: text })}
          />
          <TouchableOpacity onPress={handleMapRedirect} style={styles.mapButton}>
            <Text style={styles.mapButtonText}>Seleccionar en Mapa</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha de la Ruta:</Text>
          <TouchableOpacity onPress={() => setShowFechaPicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{format(fechaRuta, 'dd/MM/yyyy')}</Text>
          </TouchableOpacity>
          {showFechaPicker && (
            <DateTimePicker
              value={fechaRuta}
              mode="date"
              display="default"
              onChange={handleFechaChange}
            />
          )}
          <Text style={styles.label}>Hora de Inicio:</Text>
          <TouchableOpacity onPress={() => setShowHoraInicioPicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{format(horaInicio, 'HH:mm')}</Text>
          </TouchableOpacity>
          {showHoraInicioPicker && (
            <DateTimePicker
              value={horaInicio}
              mode="time"
              display="default"
              onChange={handleHoraInicioChange}
            />
          )}
          <Text style={styles.label}>Hora de Fin:</Text>
          <TouchableOpacity onPress={() => setShowHoraFinPicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{format(horaFin, 'HH:mm')}</Text>
          </TouchableOpacity>
          {showHoraFinPicker && (
            <DateTimePicker
              value={horaFin}
              mode="time"
              display="default"
              onChange={handleHoraFinChange}
            />
          )}
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  mapButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#1E6793',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  dateButtonText: {
    color: '#333',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MedicoMiRuta;
