import React, { useEffect } from 'react';
import { Button, Alert, View, StyleSheet } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';

const PaymentScreen = ({ route }) => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { medicoId, amount } = route?.params || { medicoId: 1, amount: 100 }; // Datos de prueba

    const fetchPaymentSheetParams = async () => {
        const response = await axios.post('http://localhost:8080/stripe/payment-sheet', {
            email: 'paciente@example.com',
            amount: amount,
            medicoId: medicoId
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
        const {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            paymentIntentClientSecret: paymentIntent,
            customerEphemeralKeySecret: ephemeralKey,
            customerId: customer,
            merchantDisplayName: 'Demo Merchant',
            publishableKey: publishableKey,
        });
        if (!error) {
            console.log('PaymentSheet initialized');
        } else {
            Alert.alert('Error', error.message);
        }
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();
        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your payment is confirmed!');
        }
    };

    useEffect(() => {
        initializePaymentSheet();
    }, []);

    return (
        <View style={styles.container}>
            <Button
                title="Pagar"
                onPress={openPaymentSheet}
            />
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
