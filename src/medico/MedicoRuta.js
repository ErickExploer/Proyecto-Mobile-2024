import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from 'expo-location';
import { getMedicoInfo, getPacienteInfo, getPacientesByMedico, getPacienteUbicacion } from '../api';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';


const carImage = require('../../img/car.png')
const MedicoRuta  = ({ setIsLoggedIn }) => {

    const [destination, setDestination] = useState({
        direccion: '',
        descripcion: '',
        latitude: -12.120722, 
        longitude: -77.0295377
    });
    const GOOGLE_MAPS_APIKEY = 'AIzaSyAA2R28_1hTrks8JY7wAoytXmrzGnltgRQ';
    const [origin, setOrigin] = useState({
        latitude: -12.1353399,
        longitude: -77.0222376
    });
    const [pacientes, setPacientes] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');
    const [userInfo, setUserInfo] = useState(null);

    const fetchUserInfo = async () => {
        try {
          const token = await SecureStore.getItemAsync('token');
          if (token) {
            const data = await getMedicoInfo(token);
            setUserInfo(data);
          }
        } catch (error) {
          console.error('Error fetching user info', error);
        }
      };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    useEffect(() => {
        getLocationPermission();
    }, []);

    const fetchPacientes = async () => {
        try {
          const token = await SecureStore.getItemAsync('token');
          if (token) {
            const data = await getPacientesByMedico(userInfo.id, token);
            setPacientes(data);
          }
        } catch (error) {
          console.error('Error fetching patients:', error);
          Alert.alert('Error', 'Error fetching patients');
        }
      };

    useEffect(() => {
        if(userInfo){
            fetchPacientes();
        }
      }, [userInfo]);

    useEffect(() => {
    if (selectedPaciente) {
        fetchPacienteInfo();
    }
    }, [selectedPaciente]);

    const fetchPacienteInfo = async () => {
        try {
          const token = await SecureStore.getItemAsync('token');
          if (token && selectedPaciente) {
            const data = await getPacienteUbicacion(parseInt(selectedPaciente), token);
            if (data) {
                setDestination({
                    direccion: data.direccion,
                    descripcion: data.descripcion,
                    latitude: data.latitud,
                    longitude: data.longitud
                });
            }
            else {
                alert('El paciente no ha actualizado su ubicación');
                setDestination({
                    latitude: origin.latitude,
                    longitude: origin.longitude
                });
            }
          }
        } catch (error) {
          
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

    return(
        <View contentContainerStyle={styles.content}>
        <View style={styles.form}>    
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
          <Text style={styles.label}>Dirección: {destination.direccion}</Text>
          <Text style={styles.label}>Descripcion: {destination.descripcion}</Text>
          </View>
            <MapView 
            style={styles.map} 
            provider={PROVIDER_GOOGLE} 
            initialRegion={{
                latitude: origin.latitude,
                longitude: origin.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}>
            <MapViewDirections
                origin={origin}
                destination={destination}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeColor='black'
                strokeWidth={4}
            />
            <Marker 
                    draggable
                    coordinate={origin}
                    onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
                    image={carImage}
                />
            <Marker 
                    draggable
                    coordinate={destination}
                    onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
                    pinColor='red'
                />
            </MapView>
    </View>

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
      },
      form: {
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
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
        height: '60%',
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
      pickerContainer: {
        borderWidth: 1,
        borderColor: '#1E6793',
        borderRadius: 5,
        marginBottom: 20,
        overflow: 'hidden',
        justifyContent: 'center',
        backgroundColor: '#fff',
      },
});

export default MedicoRuta;