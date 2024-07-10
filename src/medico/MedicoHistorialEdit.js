import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getHistorialInfo, updateHistorialInfo } from '../api'; // Asegúrate de que las rutas sean correctas
import * as SecureStore from 'expo-secure-store';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const MedicoHistorialEdit = () => {
  const [historialInfo, setHistorialInfo] = useState({
    fecha: new Date(),
    descripcion: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [token, setToken] = useState(null);
  const [pacienteID, setPacienteID] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  useEffect(() => {
    const fetchHistorialInfo = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        if (storedToken) {
          setToken(storedToken);
          const data = await getHistorialInfo(id, storedToken);
          setHistorialInfo({
            fecha: new Date(data.fecha),
            descripcion: data.descripcion,
          });
          setPacienteID(data.paciente.id);
        }
      } catch (error) {
        console.error('Error fetching historial info:', error);
        Alert.alert('Error', 'Error fetching historial info');
      }
    };

    fetchHistorialInfo();
  }, [id]);

  const handleInputChange = (name, value) => {
    setHistorialInfo(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || historialInfo.fecha;
    setShowDatePicker(false);
    handleInputChange('fecha', currentDate);
  };

  const handleUpdate = async () => {
    try {
      const utcDate = new Date(historialInfo.fecha.getTime() - historialInfo.fecha.getTimezoneOffset() * 60000).toISOString();
      const updatedHistorialInfo = {
        paciente_id: pacienteID,
        fecha: utcDate.replace('Z', ''),
        descripcion: historialInfo.descripcion
      };
      await updateHistorialInfo(id, updatedHistorialInfo, token);
      Alert.alert('Éxito', 'Historial actualizado correctamente');
      navigation.navigate('MedicoHistorial');
    } catch (error) {
      console.error('Error actualizando el historial:', error);
      Alert.alert('Error', 'Error actualizando el historial');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Editar Historial</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Fecha de la consulta</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{format(historialInfo.fecha, 'dd MMMM, yyyy h:mm a', { locale: es })}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={historialInfo.fecha}
            mode="datetime"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          onChangeText={(value) => handleInputChange('descripcion', value)}
          value={historialInfo.descripcion}
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FFF7',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2D6A4F',
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#2D6A4F',
  },
  dateText: {
    fontSize: 18,
    color: '#2D6A4F',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    textAlign: 'center',
  },
  textArea: {
    height: 100,
    borderColor: '#95D5B2',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2D6A4F',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MedicoHistorialEdit;
