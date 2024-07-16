import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import { getMedicoInfo, getPacientesByMedico } from '../api'; // Importar las funciones necesarias
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListaPacientes from '../../img/ListaMedicos.png'; // Asegúrate de tener esta imagen en la carpeta correcta

const MedicoMisPacientes = () => {
    const [medicoInfo, setMedicoInfo] = useState(null);
    const [pacientes, setPacientes] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMedicoInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const medicoData = await getMedicoInfo(token);
            setMedicoInfo(medicoData);
            const pacientesData = await getPacientesByMedico(medicoData.id, token);
            setPacientes(pacientesData);
        } catch (error) {
            console.error('Error al obtener la información del médico:', error);
        }
    };

    useEffect(() => {
        fetchMedicoInfo();
    }, []);

    const handleEmergencyCall = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMedicoInfo();
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
                <Text style={styles.headerText}>Mis Pacientes</Text>
            </View>
            <View style={styles.content}>
                {pacientes.length > 0 ? (
                    pacientes.map((paciente) => (
                        <View key={paciente.id} style={styles.pacienteCard}>
                            <View style={styles.cardHeader}>
                                <Image source={ListaPacientes} style={styles.pacienteImage} />
                                <Text style={styles.pacienteName}>{paciente.nombre} {paciente.apellido}</Text>
                            </View>
                            <Text style={styles.infoText}>Email: {paciente.email}</Text>
                            <Text style={styles.infoText}>Teléfono: {paciente.telefono}</Text>
                            <Text style={styles.infoText}>Edad: {paciente.edad} años</Text>
                            <TouchableOpacity 
                                style={styles.emergencyButton} 
                                onPress={() => handleEmergencyCall(paciente.telefono)}>
                                <Text style={styles.emergencyButtonText}>Llamada de Emergencia</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noPacienteText}>No hay pacientes asignados.</Text>
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
        backgroundColor: '#1E6793',
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
    pacienteCard: {
        backgroundColor: '#1E6793',
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
    pacienteImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    pacienteName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    infoText: {
        fontSize: 14,
        color: 'white',
        marginBottom: 5,
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
    noPacienteText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default MedicoMisPacientes;
