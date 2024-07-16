// PacienteUbicacion.js
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { getPacienteInfo, updateOrCreateUbicacion } from '../api'; // Importar la función para obtener la información del paciente
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const PacienteUbicacion = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [origin, setOrigin] = useState({
        latitude: -12.1353399,
        longitude: -77.0222376
    })
    const navigation = useNavigation();

    const fetchUserInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const data = await getPacienteInfo(token);
            setUserInfo(data);
            if (data && data.ubicacion) {
                setOrigin({
                    latitude: data.ubicacion.latitud,
                    longitude: data.ubicacion.longitud
                });
            }
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);


    useEffect(() => {
        getLocationPermission();
    }, []);

    const handleInputChange = (field, value) => {
        const fields = field.split('.');
        if (fields.length === 2) {
            setUserInfo((prevState) => ({
                ...prevState,
                [fields[0]]: {
                    ...prevState[fields[0]],
                    [fields[1]]: value,
                },
            }));
        }
      };

      const handleUpdate = async () => {
        try {
          const token = await SecureStore.getItemAsync('token');
          if (token) {
            const ubicacionDTO = {
                latitud: origin.latitude,
                longitud: origin.longitude,
                direccion: userInfo.ubicacion.direccion,
                descripcion: userInfo.ubicacion.descripcion,
            };
            await updateOrCreateUbicacion(ubicacionDTO, token);
            Alert.alert('Perfil actualizado', 'Tu perfil ha sido actualizado exitosamente');
            navigation.goBack(); // Vuelve a la pantalla anterior
          }
        } catch (error) {
          console.error('Error actualizando la ubicacion:', error);
          Alert.alert('Error', 'Error actualizandola ubicacion');
        }
      };

    async function getLocationPermission(){
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status != "granted"){
            alert('Permiso denegado');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        const current = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }
        setOrigin(current);
    }
    
    return (
        <View contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Mi Ubicacion</Text>
           </View>
           <Text style={styles.label}>Dirección:</Text>
            <TextInput
                label="Descripcion"
                style={styles.input}
                placeholder="Dirección"
                value={userInfo?.ubicacion?.direccion ?? "Jr. Medrano Silva 165, Barranco 15063"}
                onChangeText={(value) => handleInputChange('ubicacion.direccion', value)}
            />
            <Text style={styles.label}>Descripción:</Text>
            <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={userInfo?.ubicacion?.descripcion ?? "UTEC"}
                onChangeText={(value) => handleInputChange('ubicacion.descripcion', value)}
            />
            <MapView 
                style={styles.map} 
                provider={PROVIDER_GOOGLE} 
                initialRegion={{
                    latitude: userInfo?.ubicacion?.latitud ?? origin.latitude,
                    longitude: userInfo?.ubicacion?.longitud ?? origin.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}>
                <Marker 
                draggable
                coordinate={origin}
                onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
                />
            </MapView>
            <TouchableOpacity style={styles.loadMoreButton} onPress={handleUpdate}>
            <Text style={styles.loadMoreButtonText}>Guardar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
      },
      content: {
        padding: 20,
        alignItems: 'center',
        flexGrow: 1,
        backgroundColor: '#fff',
      },
      label: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
      },
    headerText: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        },
    map: {
        width: '100%',
        height: '55%',
    },
    input: {
        height: 40,
        borderColor: '#95D5B2',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
      },
      saveButtonText: {
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    header: {
        backgroundColor: '#1D8348',
        paddingVertical: 10,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
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

export default PacienteUbicacion;
