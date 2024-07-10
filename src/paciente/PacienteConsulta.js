import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { symptomList, diseaseDatabase } from './Data'; // Asegúrate de tener los datos correctos

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

const CustomCheckBox = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity onPress={onValueChange} style={styles.checkboxContainer}>
      <View style={[styles.checkbox, value && styles.checkedCheckbox]}>
        {value && <Text style={styles.checkmark}>✔️</Text>}
      </View>
    </TouchableOpacity>
  );
};

const SymptomForm = ({ onPredict }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState({});

  const handleCheckboxChange = (symptom) => {
    setSelectedSymptoms({
      ...selectedSymptoms,
      [symptom]: !selectedSymptoms[symptom],
    });
  };

  const handleSubmit = () => {
    const symptoms = Object.keys(selectedSymptoms).filter(symptom => selectedSymptoms[symptom]);
    if (symptoms.length === 0) {
      Alert.alert('Error', 'Por favor, seleccione al menos un síntoma.');
      return;
    }
    onPredict(symptoms);
  };

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formLabel}>Seleccione sus síntomas:</Text>
      {Object.entries(symptomList).map(([category, symptoms]) => (
        <View key={category} style={styles.category}>
          <Text style={styles.categoryTitle}>{category}</Text>
          {symptoms.map((symptom) => (
            <View key={symptom} style={styles.checkboxContainer}>
              <CustomCheckBox
                value={!!selectedSymptoms[symptom]}
                onValueChange={() => handleCheckboxChange(symptom)}
              />
              <Text style={styles.label}>{symptom}</Text>
            </View>
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Predecir</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const PredictionResult = ({ result }) => {
  return (
    <ScrollView>
      <Text style={styles.resultTitle}>Posibles Enfermedades:</Text>
      {result.map((item, index) => (
        <View key={index} style={styles.resultItem}>
          <Text style={styles.resultItemText}>{`${item.disease} (Confianza: ${item.matchScore.toFixed(2)}%)`}</Text>
          <Text style={styles.resultItemText}>Síntomas coincidentes: {item.matchedSymptoms.join(', ')}</Text>
          <Text style={styles.resultItemText}>Descripción: {item.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const PacienteConsulta = () => {
  const [result, setResult] = useState([]);
  const [warningOpen, setWarningOpen] = useState(false);

  const symptomWeights = {
    "fiebre": 1.2,
    "tos": 1.1,
    // Agrega pesos a otros síntomas si es necesario
  };

  const handlePredict = (symptoms) => {
    const matchedDiseases = [];

    for (const [disease, diseaseData] of Object.entries(diseaseDatabase)) {
      const { symptoms: diseaseSymptoms, description } = diseaseData;
      const matchedSymptoms = diseaseSymptoms.filter(symptom => symptoms.includes(symptom));
      if (matchedSymptoms.length > 0) {
        const totalWeight = diseaseSymptoms.reduce((acc, symptom) => acc + (symptomWeights[symptom] || 1), 0);
        const matchScore = (matchedSymptoms.reduce((acc, symptom) => acc + (symptomWeights[symptom] || 1), 0) / totalWeight) * 100;
        matchedDiseases.push({ disease, matchedSymptoms, matchScore, description });
      }
    }

    matchedDiseases.sort((a, b) => b.matchScore - a.matchScore);
    setResult(matchedDiseases);
    setWarningOpen(true);
  };

  const handleCloseWarning = () => {
    setWarningOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Predicción de Enfermedades</Text>
      <SymptomForm onPredict={handlePredict} />
      {result.length > 0 && <PredictionResult result={result} />}
      <WarningDialog visible={warningOpen} onClose={handleCloseWarning} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7FFF7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2D6A4F',
  },
  formContainer: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 18,
    marginBottom: 10,
    color: '#2D6A4F',
  },
  category: {
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#2D6A4F',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#2D6A4F',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    color: '#2D6A4F',
  },
  button: {
    backgroundColor: '#2D6A4F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#1B4332',
  },
  resultItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#D8F3DC',
    borderRadius: 5,
  },
  resultItemText: {
    fontSize: 16,
    color: '#1B4332',
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
});

export default PacienteConsulta;
