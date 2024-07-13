import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import { getMedicos, patchMedicoByPacienteId } from '../api'; // Import the function to get doctors and assign doctor to patient
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PacienteListaMedicos = () => {
    const [medicos, setMedicos] = useState([]);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const fetchMedicos = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                const medicosData = await getMedicos(token, page);
                setMedicos((prevMedicos) => [...prevMedicos, ...medicosData]);
            } catch (error) {
                console.error('The list of doctors could not be retrieved.', error);
            }
        };

        fetchMedicos();
    }, [page]);

    const loadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleAddMedico = async (medicoId) => {
        try {
            const token = await SecureStore.getItemAsync('token');
            await patchMedicoByPacienteId(medicoId, token);
            Alert.alert('Success', 'El médico ha sido asignado exitosamente al paciente.');
        } catch (error) {
            console.error('A doctor could not be assigned to the patient.', error);
            Alert.alert('Error', 'No se pudo asignar el médico al paciente.');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const token = await SecureStore.getItemAsync('token');
            const medicosData = await getMedicos(token, 1);
            setMedicos(medicosData);
            setPage(1);
        } catch (error) {
            console.error('The list of doctors could not be retrieved.', error);
        }
        setRefreshing(false);
    };

    return (
        <ScrollView 
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.header}>
                <Text style={styles.headerText}>Lista de Médicos</Text>
            </View>
            <View style={styles.content}>
                {medicos.length > 0 ? (
                    medicos.map((medico, index) => (
                        <View key={`${medico.id}-${index}`} style={styles.medicoCard}>
                            <Image source={require('../../img/ListaMedicos.png')} style={styles.medicoImage} />
                            <View style={styles.medicoInfo}>
                                <View style={styles.medicoTextContainer}>
                                    <Text style={styles.medicoName}>{medico.nombre} {medico.apellido}</Text>
                                    <Text style={styles.medicoDetail}>
                                        <Icon name="local-hospital" size={16} color="#666" /> {medico.especialidad}
                                    </Text>
                                    <Text style={styles.medicoDetail}>
                                        <Icon name="phone" size={16} color="#666" /> {medico.telefono}
                                    </Text>
                                    <Text style={styles.medicoDetail}>{medico.edad} años</Text>
                                </View>
                            </View>
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity style={styles.addButton} onPress={() => handleAddMedico(medico.id)}>
                                    <Text style={styles.buttonText}>Asignar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.routeButton}>
                                    <Text style={styles.buttonText}>Ver Ruta</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text>No hay médicos disponibles.</Text>
                )}
                <TouchableOpacity onPress={loadMore} style={styles.loadMoreButton}>
                    <Text style={styles.loadMoreText}>Cargar más...</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F7FFF7',
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
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    medicoImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 10,
        alignSelf: 'center',
    },
    medicoInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    medicoTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    medicoName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    medicoDetail: {
        color: '#666',
        marginTop: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    addButton: {
        backgroundColor: '#1D8348',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    routeButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    loadMoreButton: {
        backgroundColor: '#1D8348',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    loadMoreText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PacienteListaMedicos;
