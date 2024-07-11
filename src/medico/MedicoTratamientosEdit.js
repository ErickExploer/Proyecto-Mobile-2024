import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateTratamientoInfo, getTratamientoInfo } from '../api'; // Adjust the path as needed
import * as SecureStore from 'expo-secure-store';

const MedicoTratamientosEdit = () => {
  const [tratamientoInfo, setTratamientoInfo] = useState({
    nombreTratamiento: '',
    descripcion: '',
  });
  const [token, setToken] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await SecureStore.getItemAsync('token');
      setToken(storedToken);
    };

    const fetchTratamientoInfo = async () => {
      try {
        const data = await getTratamientoInfo(id, token);
        if (data && data.length > 0) {
          setTratamientoInfo({
            nombreTratamiento: data[0].nombreTratamiento,
            descripcion: data[0].descripcion,
          });
        } else {
          Alert.alert('Error', 'No se encontró la información del tratamiento');
        }
      } catch (error) {
        console.error('Error fetching tratamiento info:', error);
        Alert.alert('Error', 'Error fetching tratamiento info');
      }
    };

    if (token) {
      fetchTratamientoInfo();
    } else {
      fetchToken().then(fetchTratamientoInfo);
    }
  }, [id, token]);

  const handleInputChange = (name, value) => {
    setTratamientoInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await updateTratamientoInfo(id, tratamientoInfo, token);
      Alert.alert('Éxito', 'Tratamiento actualizado correctamente');
      navigation.navigate('MedicoTratamientos');
    } catch (error) {
      console.error('Error actualizando el tratamiento:', error);
      Alert.alert('Error', 'Error actualizando el tratamiento');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Editar Tratamiento</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nombre del Tratamiento</Text>
          <TextInput
            style={styles.input}
            value={tratamientoInfo.nombreTratamiento}
            onChangeText={(value) => handleInputChange('nombreTratamiento', value)}
          />
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={tratamientoInfo.descripcion}
            onChangeText={(value) => handleInputChange('descripcion', value)}
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
            <Text style={styles.submitButtonText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFEFE',
  },
  header: {
    backgroundColor: '#1E6793',
    paddingVertical: 15,
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
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#1E6793',
    borderWidth: 1,
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    backgroundColor: '#1D8348',
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
});

export default MedicoTratamientosEdit;
