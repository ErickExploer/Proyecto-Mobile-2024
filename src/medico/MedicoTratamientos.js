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
      Alert.alert('Success', 'Tratamiento añadido correctamente');
      fetchTratamientos();
    } catch (error) {
      console.error('Error adding tratamiento:', error);
      Alert.alert('Error', 'Error añadiendo tratamiento');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await deleteTratamiento(id, token);
      Alert.alert('Success', 'Tratamiento eliminado correctamente');
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
      <View style={styles.header}>
        <Text style={styles.headerText}>Tratamientos</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre del Tratamiento:</Text>
        <TextInput
          style={styles.input}
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
          >
            <Picker.Item label="Seleccione un paciente" value="" />
            {pacientes.map((paciente) => (
              <Picker.Item key={paciente.id} label={`${paciente.nombre} ${paciente.apellido}`} value={paciente.id} />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={tratamientoInfo.descripcion}
          onChangeText={(value) => handleInputChange('descripcion', value)}
          placeholder="Descripción"
          multiline
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tratamientosContainer}>
        <Text style={styles.sectionTitle}>Tratamientos</Text>
        {tratamientos.length > 0 ? (
          tratamientos.map((tratamiento) => (
            <View key={tratamiento.id} style={styles.tratamientoItem}>
              <View style={styles.tratamientoDetails}>
                <Text style={styles.tratamientoName}>Nombre: {tratamiento.nombreTratamiento}</Text>
                <Text style={styles.tratamientoDescription}><Text style={styles.bold}>Descripción:</Text> {tratamiento.descripcion}</Text>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(tratamiento.id)}>
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(tratamiento.id)}>
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noTratamientosText}>No hay tratamientos disponibles.</Text>
        )}
      </View>
      <TouchableOpacity style={styles.loadMoreButton}>
        <Text style={styles.loadMoreButtonText}>Cargar más...</Text>
      </TouchableOpacity>
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
    backgroundColor: '#2D6A4F',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#DADADA',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#2D6A4F',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#2D6A4F',
    borderWidth: 1,
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    backgroundColor: '#2D6A4F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tratamientosContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#2D6A4F',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  tratamientoItem: {
    flexDirection: 'row',
    backgroundColor: '#2D6A4F',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
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
    backgroundColor: '#2D6A4F',
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
    backgroundColor: '#95D5B2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#E63946',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MedicoTratamientos;
