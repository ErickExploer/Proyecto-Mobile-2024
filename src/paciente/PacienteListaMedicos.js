import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import { getMedicos, patchMedicoByPacienteId } from '../api';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useMedico } from './MedicoContext'; // Importar el contexto

const ITEMS_PER_PAGE = 10; // Definimos cuántos médicos mostrar por página

const PacienteListaMedicos = () => {
    const [allMedicos, setAllMedicos] = useState([]);
    const [displayedMedicos, setDisplayedMedicos] = useState([]);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const { setMedicoSeleccionado } = useMedico(); // Usar el contexto

    useEffect(() => {
        fetchMedicos();
    }, []);

    useEffect(() => {
        if (allMedicos.length > 0) {
            // Cargar la primera página al cargar los médicos
            const initialMedicos = allMedicos.slice(0, ITEMS_PER_PAGE);
            setDisplayedMedicos(initialMedicos);
            setPage(2); // Configurar la siguiente página
        }
    }, [allMedicos]);

    const fetchMedicos = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const medicosData = await getMedicos();
            setAllMedicos(medicosData);
        } catch (error) {
            console.error('No se pudo recuperar la lista de médicos.', error);
        }
    };

    const loadMore = () => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = page * ITEMS_PER_PAGE;
        const newMedicos = allMedicos.slice(startIndex, endIndex);
        if (newMedicos.length > 0) {
            setDisplayedMedicos((prevDisplayedMedicos) => [
                ...prevDisplayedMedicos,
                ...newMedicos,
            ]);
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handleAddMedico = async (medicoId, medico) => {
        try {
            const token = await SecureStore.getItemAsync('token');
            await patchMedicoByPacienteId(medicoId, token);
            setMedicoSeleccionado(medico); // Actualizar el médico seleccionado
            Alert.alert('Éxito', 'El médico ha sido asignado exitosamente al paciente.');
        } catch (error) {
            console.error('No se pudo asignar el médico al paciente.', error);
            Alert.alert('Error', 'No se pudo asignar el médico al paciente.');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMedicos();
        const initialMedicos = allMedicos.slice(0, ITEMS_PER_PAGE);
        setDisplayedMedicos(initialMedicos);
        setPage(2); // Configurar la siguiente página
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
                {displayedMedicos.length > 0 ? (
                    displayedMedicos.map((medico, index) => (
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
                                <TouchableOpacity style={styles.addButton} onPress={() => handleAddMedico(medico.id, medico)}>
                                    <Text style={styles.buttonText}>Escoger</Text>
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
