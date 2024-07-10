import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getPacientes, addHistorial, getHistorial } from '../api';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const MedicoHistorial = () => {
    const [historiales, setHistoriales] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');
    const [historialInfo, setHistorialInfo] = useState({
        fecha: new Date(),
        descripcion: ''
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                if (token) {
                    const data = await getPacientes(token);
                    setPacientes(data);
                }
            } catch (error) {
                console.error('Error fetching patients:', error);
                Alert.alert('Error', 'Error fetching patients');
            }
        };

        fetchPacientes();
    }, []);

    useEffect(() => {
        if (selectedPaciente) {
            const fetchHistoriales = async () => {
                try {
                    const token = await SecureStore.getItemAsync('token');
                    const historialesData = await getHistorial(parseInt(selectedPaciente), token);
                    setHistoriales(historialesData);
                } catch (error) {
                    console.error('Error fetching historiales:', error);
                    Alert.alert('Error', 'Error fetching historiales');
                }
            };

            fetchHistoriales();
        }
    }, [selectedPaciente]);

    const handleInputChange = (name, value) => {
        setHistorialInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDateChange = (selectedDate) => {
        setShowDatePicker(false);
        handleInputChange('fecha', selectedDate);
    };

    const handleSubmit = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const utcDate = new Date(historialInfo.fecha.getTime() - historialInfo.fecha.getTimezoneOffset() * 60000).toISOString();
            const historialDTO = {
                paciente_id: parseInt(selectedPaciente),
                fecha: utcDate.replace('Z', ''),
                descripcion: historialInfo.descripcion
            };
            await addHistorial(historialDTO, token);
            Alert.alert('Éxito', 'Historial añadido correctamente');
            const historialesData = await getHistorial(parseInt(selectedPaciente), token);
            setHistoriales(historialesData);
        } catch (error) {
            console.error('Error adding historial:', error);
            Alert.alert('Error', 'Error añadiendo historial');
        }
    };

    const handleEdit = (id) => {
        navigation.navigate('MedicoHistorialEdit', { id });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Añadir Historial</Text>
            <View style={styles.form}>
                <Text style={styles.label}>Fecha de la consulta:</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dateButtonText}>{format(historialInfo.fecha, 'dd/MM/yyyy HH:mm', { locale: es })}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="datetime"
                    onConfirm={handleDateChange}
                    onCancel={() => setShowDatePicker(false)}
                />
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
                <Text style={styles.label}>Descripción:</Text>
                <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={4}
                    onChangeText={(value) => handleInputChange('descripcion', value)}
                    value={historialInfo.descripcion}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Confirmar</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.header}>Historial Médico</Text>
            {historiales.length > 0 ? (
                historiales.map((historial) => (
                    <View key={historial.id} style={styles.historialItem}>
                        <Text style={styles.historialDate}>Fecha: {format(new Date(historial.fecha), 'dd MMMM, yyyy h:mm a', { locale: es })}</Text>
                        <Text><Text style={styles.bold}>Descripción:</Text> {historial.descripcion}</Text>
                        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(historial.id)}>
                            <Text style={styles.editButtonText}>Editar</Text>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <Text style={styles.noHistorial}>No hay historiales disponibles.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F7FFF7',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2D6A4F',
        textAlign: 'center',
    },
    form: {
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: '#2D6A4F',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#95D5B2',
        borderRadius: 5,
        marginBottom: 20,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    picker: {
        height: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    pickerItem: {
        height: 50,
        color: '#2D6A4F',
        textAlign: 'center',
    },
    dateButton: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#95D5B2',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
    dateButtonText: {
        color: '#333',
        fontSize: 16,
    },
    textArea: {
        height: 100,
        borderColor: '#95D5B2',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        textAlignVertical: 'top',
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: '#1E6793',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    historialItem: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#E5E5E5',
    },
    historialDate: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    bold: {
        fontWeight: 'bold',
    },
    editButton: {
        marginTop: 10,
        backgroundColor: '#1E6793',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noHistorial: {
        textAlign: 'center',
        color: '#333',
        marginTop: 10,
    },
});

export default MedicoHistorial;
