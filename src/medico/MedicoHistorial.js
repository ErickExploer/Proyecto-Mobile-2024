import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getPacientes, addHistorial, getHistorial } from '../api';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
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

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || historialInfo.fecha;
        setShowDatePicker(Platform.OS === 'ios');
        handleInputChange('fecha', currentDate);
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
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Añadir Historial</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.form}>
                    <Text style={styles.label}>Fecha de la consulta:</Text>
                    <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.dateButtonText}>{format(historialInfo.fecha, 'dd/MM/yyyy HH:mm', { locale: es })}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={historialInfo.fecha}
                            mode="datetime"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
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
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Historial Médico</Text>
                </View>
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
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFEFE',
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#1E6793',
        borderRadius: 10,
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    content: {
        padding: 20,
    },
    form: {
        marginBottom: 20,
        backgroundColor: '#ffffff',
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
        color: '#333',
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
    picker: {
        height: 50,
        justifyContent: 'center',
    },
    pickerItem: {
        height: 50,
        textAlign: 'center',
    },
    dateButton: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#1E6793',
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
        borderColor: '#1E6793',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        textAlignVertical: 'top',
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: '#1D8348',
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
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    historialDate: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    bold: {
        fontWeight: 'bold',
        color: '#333',
    },
    editButton: {
        marginTop: 10,
        backgroundColor: '#FFA500',
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
