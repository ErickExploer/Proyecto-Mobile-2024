import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { updateMedicoInfo, getMedicoInfo, deleteMedico } from '../api';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const MedicoEdit = () => {
  const [userInfo, setUserInfo] = useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    telefono: '',
    edad: '',
    precio: '',
  });
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          const data = await getMedicoInfo();
          setUserInfo(data);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        Alert.alert('Error', 'Error fetching user info');
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (field, value) => {
    setUserInfo({
      ...userInfo,
      [field]: value,
    });
  };

  const handleUpdate = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        await updateMedicoInfo(userInfo.id, userInfo, token);
        Alert.alert('Perfil actualizado', 'Tu perfil ha sido actualizado exitosamente');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error actualizando el perfil:', error);
      Alert.alert('Error', 'Error actualizando el perfil');
    }
  };

  const handleDelete = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        await deleteMedico(userInfo.id, token);
        Alert.alert(
          'Perfil eliminado',
          'Tu perfil ha sido eliminado exitosamente',
          [
            {
              text: 'OK',
              onPress: () => {
                setTimeout(() => {
                  BackHandler.exitApp();
                }, 5000);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error eliminando el perfil:', error);
      Alert.alert('Error', 'Error eliminando el perfil');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={require('../../img/UserIcon.png')} style={styles.profileImage} />
        <Text style={styles.nameText}>{userInfo.nombre} {userInfo.apellido}</Text>
        <Text style={styles.emailText}>{userInfo.email}</Text>
        <Text style={styles.locationText}>Lima, Peru</Text>
      </View>
      <View style={styles.infoContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={userInfo.nombre}
          onChangeText={(value) => handleInputChange('nombre', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={userInfo.apellido}
          onChangeText={(value) => handleInputChange('apellido', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Especialidad"
          value={userInfo.especialidad}
          onChangeText={(value) => handleInputChange('especialidad', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={userInfo.telefono}
          onChangeText={(value) => handleInputChange('telefono', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Edad"
          value={userInfo.edad}
          onChangeText={(value) => handleInputChange('edad', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Precio"
          value={userInfo.precio}
          onChangeText={(value) => handleInputChange('precio', value)}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Eliminar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FDFEFE',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#1D8348',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MedicoEdit;
