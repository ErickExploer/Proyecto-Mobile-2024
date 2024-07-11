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
                        <View style={styles.cardHeader}>
                            <Image source={ListaMedicos} style={styles.medicoImage} />
                            <Text style={styles.medicoName}>Dr. {medico.nombre} {medico.apellido}</Text>
                        </View>
                        <Text style={styles.specialtyText}>{medico.especialidad}</Text>
                        <Text style={styles.infoText}>Email: {medico.email}</Text>
                        <Text style={styles.infoText}>Teléfono: {medico.telefono}</Text>
                        <Text style={styles.infoText}>Edad: {medico.edad} años</Text>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Ver Ruta</Text>
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
        backgroundColor: '#D9534F',
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
    noMedicoText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default PacienteMisMedicos;
