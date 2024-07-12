import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import prompts from './prompts_clean.json'; // Ajusta la ruta a tu archivo JSON
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as Speech from 'expo-speech';

const WarningDialog = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.dialogOverlay}>
        <View style={styles.dialog}>
          <Text style={styles.dialogTitle}>Advertencia</Text>
          <Text style={styles.dialogContent}>
            Los resultados mostrados no son seguros y solo deben ser utilizados como una guía. Por favor, consulte a un profesional de salud para un diagnóstico preciso.
          </Text>
          <TouchableOpacity style={styles.dialogButton} onPress={onClose}>
            <Text style={styles.dialogButtonText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const PacienteConsulta = () => {
  const [inputText, setInputText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [warningOpen, setWarningOpen] = useState(false);
  const [chat, setChat] = useState(null);
  const navigation = useNavigation();

  // Reemplaza 'YOUR_API_KEY' con tu clave de API real
  const API_KEY = 'AIzaSyB_V2VwT5LSOUScE7g0lBHUh8bxZXkayX0';
  const genAI = new GoogleGenerativeAI(API_KEY);

  useEffect(() => {
    const initializeChat = async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
      const initialChat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: 'Hola, tengo 2 perros en mi casa.' }],
          },
          {
            role: 'model',
            parts: [{ text: 'Encantado de conocerte. ¿Qué te gustaría saber?' }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 100,
        },
      });
      setChat(initialChat);
    };
    initializeChat();
  }, []);

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Por favor, ingrese sus síntomas.');
      return;
    }

    setWarningOpen(true);

    if (chat) {
      try {
        const result = await chat.sendMessage(inputText);
        const response = await result.response;
        const aiResponse = await response.text();
        // Match inputText with prompts from JSON
        const inputSymptoms = inputText.toLowerCase().split(',').map(s => s.trim());
        console.log('Input Symptoms:', inputSymptoms);

        const matchedPrompt = prompts.find(prompt =>
          prompt.input && prompt.input.every(symptom => inputSymptoms.includes(symptom))
        );
        console.log('Matched Prompt:', matchedPrompt);

        if (matchedPrompt) {
          const output = matchedPrompt.output;
          setResponseText(output);
          Speech.speak(output);
        } else {
          const output = aiResponse + ' - Saipe';
          setResponseText(output);
          Speech.speak(output);
        }
      } catch (error) {
        console.error('Error al generar contenido:', error);
        const errorMessage = 'Hubo un error al procesar su solicitud. Inténtelo nuevamente más tarde. - Saipe';
        setResponseText(errorMessage);
        Speech.speak(errorMessage);
      }
    }
  };

  const handleCloseWarning = () => {
    setWarningOpen(false);
  };

  const handleBack = () => {
    navigation.navigate('Paciente');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consulta de Síntomas</Text>
      <ScrollView>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Ingrese sus síntomas aquí..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
        <WarningDialog visible={warningOpen} onClose={handleCloseWarning} />
        {responseText ? <Text style={styles.responseText}>{responseText}</Text> : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FDFEFE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2D6A4F',
  },
  input: {
    height: 150,
    borderColor: '#2D6A4F',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2D6A4F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#7D3C98',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dialogOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dialog: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1B4332',
  },
  dialogContent: {
    fontSize: 16,
    marginBottom: 20,
    color: '#1B4332',
  },
  dialogButton: {
    backgroundColor: '#2D6A4F',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  dialogButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  responseText: {
    marginTop: 20,
    fontSize: 16,
    color: '#1B4332',
  },
});

export default PacienteConsulta;
