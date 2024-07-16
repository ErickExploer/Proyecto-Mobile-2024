// PaymentScreen.js
import React, { useEffect, useState } from 'react';
import { Button, Alert, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getPacienteInfo, patchMedicoByPacienteId } from './api';  // Asegúrate de tener la ruta correcta

const PaymentScreen = ({ route, navigation }) => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { medicoId, amount } = route.params; // Obtén los parámetros de la navegación
    const [isPaymentSheetInitialized, setIsPaymentSheetInitialized] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchPaymentSheetParams = async (email, token) => {
        const response = await axios.post('http://52.0.117.206:8080/stripe/payment-sheet', {
            email: email,
            medicoId: medicoId,
            amount: amount
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const { paymentIntent, ephemeralKey, customer, publishableKey } = response.data;
        return {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey
        };
    };

    const initializePaymentSheet = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (!token) throw new Error('Token not found');

            const pacienteInfo = await getPacienteInfo(token);
            const email = pacienteInfo.email;

            const {
                paymentIntent,
                ephemeralKey,
                customer,
                publishableKey
            } = await fetchPaymentSheetParams(email, token);

            const { error } = await initPaymentSheet({
                paymentIntentClientSecret: paymentIntent,
                customerEphemeralKeySecret: ephemeralKey,
                customerId: customer,
                merchantDisplayName: 'Demo Merchant',
                publishableKey: publishableKey,
            });

            if (!error) {
                setIsPaymentSheetInitialized(true);
                console.log('PaymentSheet initialized');
            } else {
                Alert.alert('Error', error.message);
            }
        } catch (error) {
            console.error('Error initializing PaymentSheet:', error);
            Alert.alert('Error', 'Error initializing PaymentSheet');
        } finally {
            setLoading(false);
        }
    };

    const openPaymentSheet = async () => {
        if (!isPaymentSheetInitialized) {
            Alert.alert('Error', 'La hoja de pago aún no se ha inicializado.');
            return;
        }

        const { error } = await presentPaymentSheet();
        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your payment is confirmed!');
            await handleAddMedico(medicoId);
            navigation.goBack();
        }
    };

    const handleAddMedico = async (medicoId) => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (!token) throw new Error('Token not found');

            await patchMedicoByPacienteId(medicoId, token);
            Alert.alert('Éxito', 'El médico ha sido asignado exitosamente al paciente.');
        } catch (error) {
            console.error('No se pudo asignar el médico al paciente.', error);
            Alert.alert('Error', 'No se pudo asignar el médico al paciente.');
        }
    };

    useEffect(() => {
        initializePaymentSheet();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button
                    title="Pagar"
                    onPress={openPaymentSheet}
                    disabled={!isPaymentSheetInitialized}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PaymentScreen;
