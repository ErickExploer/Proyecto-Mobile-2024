import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getPacienteInfo, getMedicoByPacienteId } from '../api'; // Import the function to get assigned doctors
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListaMedicos from '../../img/ListaMedicos.png'; // Ensure you have this image in the correct folder

const PacienteMisMedicos = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [medico, setMedico] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const data = await getPacienteInfo(token);
                setUserInfo(data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        if (userInfo) {
            console.log(userInfo)
            const fetchMedicos = async () => {
                try {
                    const token = await AsyncStorage.getItem('token');
                    const medicoData = await getMedicoByPacienteId(userInfo.id, token);
                    setMedico(medicoData);
                } catch (error) {
                    console.error('The list of assigned doctors could not be retrieved.', error);
                }
            };

            fetchMedicos();
        }
    }, [userInfo]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Mis Médicos</Text>
            </View>
            <View style={styles.content}>
                {medico ? (
                    <View key={medico.id} style={styles.medicoCard}>
                        <Image source={ListaMedicos} style={styles.medicoImage} />
                        <View style={styles.medicoInfo}>
                            <View>
                                <Text style={styles.medicoName}>Medico: {medico.nombre} {medico.apellido}</Text>
                                <Text>{medico.email}</Text>
                                <Text>{medico.telefono}</Text>
                                <Text>{medico.edad} años</Text>
                            </View>
                            <View>
                                <Text>Sexo: {medico.sexo}</Text>
                                <Text>Especialidad: {medico.especialidad}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Ver Ruta</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text>No hay médicos asignados.</Text>
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
        backgroundColor: '#4CAF50',
        padding: 20,
    },
    headerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    medicoCard: {
        backgroundColor: '#333',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    medicoImage: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    medicoInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    medicoName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
    },
});

export default PacienteMisMedicos;
