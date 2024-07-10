import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { getTratamientos, deleteTratamiento, getPacientes, addTratamiento } from '../api';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const MedicoTratamientos = () => {
  const [tratamientos, setTratamientos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [tratamientoInfo, setTratamientoInfo] = useState({
    nombreTratamiento: '',
    descripcion: '',
  });

  const navigation = useNavigation();

  const fetchTratamientos = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token && selectedPaciente) {
        const tratamientosData = await getTratamientos(parseInt(selectedPaciente), token);
        setTratamientos(tratamientosData);
      }
    } catch (error) {
      console.error('Error fetching tratamientos:', error);
      Alert.alert('Error', 'Error fetching tratamientos');
    }
  };

  const fetchPacientes = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const data = await getPacientes(token);
        setPacientes(data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      Alert.alert('Error', 'Error fetching patients');
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  useEffect(() => {
    if (selectedPaciente) {
      fetchTratamientos();
    }
  }, [selectedPaciente]);

  const handleInputChange = (name, value) => {
    setTratamientoInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const tratamientoDTO = {
        paciente_id: parseInt(selectedPaciente),
        ...tratamientoInfo,
      };
      await addTratamiento(tratamientoDTO, token);
      Alert.alert('Éxito', 'Tratamiento añadido correctamente');
      fetchTratamientos();
    } catch (error) {
      console.error('Error añadiendo tratamiento:', error);
      Alert.alert('Error', 'Error añadiendo tratamiento');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await deleteTratamiento(id, token);
      Alert.alert('Éxito', 'Tratamiento eliminado correctamente');
      fetchTratamientos();
    } catch (error) {
      console.error('Error eliminando tratamiento:', error);
      Alert.alert('Error', 'Error eliminando tratamiento');
    }
  };

  const handleEdit = (id) => {
    navigation.navigate('MedicoTratamientosEdit', { id });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Añadir Tratamiento</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre del Tratamiento:</Text>
        <TextInput
          style={styles.textArea}
          value={tratamientoInfo.nombreTratamiento}
          onChangeText={(value) => handleInputChange('nombreTratamiento', value)}
          placeholder="Nombre del Tratamiento"
        />
        <Text style={styles.label}>Seleccionar Paciente:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPaciente}
            onValueChange={(itemValue) => setSelectedPaciente(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Seleccione un paciente" value="" />
            {pacientes.map((paciente) => (
              <Picker.Item key={paciente.id} label={`${paciente.nombre} ${paciente.apellido}`} value={paciente.id} />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          onChangeText={(value) => handleInputChange('descripcion', value)}
          value={tratamientoInfo.descripcion}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.header}>Tratamientos</Text>
      {tratamientos.length > 0 ? (
        tratamientos.map((tratamiento) => (
          <View key={tratamiento.id} style={styles.tratamientoItem}>
            <Text style={styles.tratamientoDate}>Nombre: {tratamiento.nombreTratamiento}</Text>
            <Text><Text style={styles.bold}>Descripción:</Text> {tratamiento.descripcion}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(tratamiento.id)}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(tratamiento.id)}>
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noTratamientos}>No hay tratamientos disponibles.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7FFF7',
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
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#2D6A4F',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#95D5B2',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  pickerItem: {
    height: 50,
    color: '#2D6A4F',
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
  submitButton: {
    backgroundColor: '#1E6793',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tratamientoItem: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#E5E5E5',
  },
  tratamientoDate: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#1E6793',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#E63946',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noTratamientos: {
    textAlign: 'center',
    color: '#333',
    marginTop: 10,
  },
});

export default MedicoTratamientos;
