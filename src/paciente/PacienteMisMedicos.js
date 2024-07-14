// PacienteMisMedicos.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import { getPacienteInfo } from '../api'; // Importar la función para obtener la información del paciente
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListaMedicos from '../../img/ListaMedicos.png'; // Asegúrate de tener esta imagen en la carpeta correcta
import { useMedico } from './MedicoContext'; // Importar el contexto

const PacienteMisMedicos = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const { medicoSeleccionado } = useMedico(); // Usar el contexto

    const fetchUserInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const data = await getPacienteInfo(token);
            setUserInfo(data);
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleEmergencyCall = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserInfo();
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
                <Text style={styles.headerText}>Mis Médicos</Text>
            </View>
            <View style={styles.content}>
                {medicoSeleccionado ? (
                    <View key={medicoSeleccionado.id} style={styles.medicoCard}>
                        <View style={styles.cardHeader}>
                            <Image source={ListaMedicos} style={styles.medicoImage} />
                            <Text style={styles.medicoName}>Dr. {medicoSeleccionado.nombre} {medicoSeleccionado.apellido}</Text>
                        </View>
                        <Text style={styles.specialtyText}>{medicoSeleccionado.especialidad}</Text>
                        <Text style={styles.infoText}>Email: {medicoSeleccionado.email}</Text>
                        <Text style={styles.infoText}>Teléfono: {medicoSeleccionado.telefono}</Text>
                        <Text style={styles.infoText}>Edad: {medicoSeleccionado.edad} años</Text>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Ver Ruta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.emergencyButton} 
                            onPress={() => handleEmergencyCall(medicoSeleccionado.telefono)}>
                            <Text style={styles.emergencyButtonText}>Llamada de Emergencia</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={styles.noMedicoText}>No hay médicos asignados.</Text>
                )}
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
    medicoCard: {
        backgroundColor: '#1D8348',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    medicoImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    medicoName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    specialtyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#D3D3D3',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        color: 'white',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#1E6793',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emergencyButton: {
        backgroundColor: '#FF0000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    emergencyButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    noMedicoText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default PacienteMisMedicos;
