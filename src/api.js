import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const API_BASE_URL = 'http://52.0.117.206:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const setAuthToken = async () => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};


// Auth
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  await SecureStore.setItemAsync('token', response.data.token);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getUserRole = async () => {
  await setAuthToken();
  try {
    const response = await api.get('/auth');
    return response.data;
  } catch (error) {
  
  }
};



// Obtener información del paciente
export const getPacienteInfo = async (token) => {
    await setAuthToken();
    try {
      const response = await api.get('/paciente/me');
      return response.data;
    } catch (error) {
     
    }
  };
  
  // Obtener información del médico
  export const getMedicoInfo = async (token) => {
    await setAuthToken();
    try {
      const response = await api.get('/medico/me');
      return response.data;
    } catch (error) {
      
    }
  };    

// Eliminar un médico
export const deleteMedico = async (id) => {
  await setAuthToken();
  try {
    const response = await api.delete(`/medico/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete medico:', error);
    throw error;
  }
};

// Actualizar información de un médico
export const updateMedicoInfo = async (id, medicoInfoDTO) => {
  await setAuthToken();
  try {
    const response = await api.patch(`/medico/${id}`, medicoInfoDTO);
    return response.data;
  } catch (error) {
    console.error('Failed to update medico info:', error);
    throw error;
  }
};

// Eliminar un paciente
export const deletePaciente = async (id) => {
  await setAuthToken();
  try {
    const response = await api.delete(`/paciente/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete paciente:', error);
    throw error;
  }
};

// Actualizar información de un paciente
export const updatePacienteInfo = async (id, pacienteInfoDTO) => {
  await setAuthToken();
  try {
    const response = await api.patch(`/paciente/${id}`, pacienteInfoDTO);
    return response.data;
  } catch (error) {
    console.error('Failed to update paciente info:', error);
    throw error;
  }
};

// Obtener la lista de todos los médicos
export const getMedicos = async () => {
  await setAuthToken();
  try {
    const response = await api.get('/medico/getMedicos');
    return response.data;
  } catch (error) {
    console.error('The list of doctors could not be retrieved.', error);
    throw error;
  }
};

// Obtener los médicos asignados a paciente
export const getMedicoByPacienteId = async (pacienteId) => {
  await setAuthToken();
  try {
    const response = await api.get(`/paciente/medico/${pacienteId}`);
    return response.data;
  } catch (error) {
    console.error('The patient does not have an assigned doctor.', error);
    throw error;
  }
};

// Asignar un médico al paciente
export const patchMedicoByPacienteId = async (medicoId) => {
  await setAuthToken();
  try {
    const response = await api.patch(`/paciente/addMedico/${medicoId}`);
    return response.data;
  } catch (error) {
    console.error('A doctor could not be assigned to the patient.', error);
    throw error;
  }
};

// Crear ruta
export const createRuta = async (rutaData) => {
  await setAuthToken();
  try {
    const response = await api.post('/ruta', rutaData);
    return response.data;
  } catch (error) {
    console.error('Error creating route:', error);
    throw error;
  }
};

// Obtener tratamientos del paciente
export const getTratamientos = async (pacienteId) => {
  await setAuthToken();
  try {
    const response = await api.get(`/tratamiento/getTratamientos/${pacienteId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch tratamientos:', error);
    throw error;
  }
};

export const getTratamientoInfo = async (pacienteId) => {
  await setAuthToken();
  try {
    const response = await api.get(`/tratamiento/getTratamientos/${pacienteId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch tratamientos:', error);
    throw error;
  }
};

// Actualizar tratamiento
export const updateTratamientoInfo = async (id, tratamientoInfo) => {
  await setAuthToken();
  try {
    const response = await api.put(`/tratamiento/${id}`, tratamientoInfo);
    return response.data;
  } catch (error) {
    console.error('Failed to update tratamiento info:', error);
    throw error;
  }
};

// Crear tratamiento
export const addTratamiento = async (tratamientoInfo) => {
  await setAuthToken();
  try {
    const response = await api.post(`/tratamiento/addTratamiento`, tratamientoInfo);
    return response.data;
  } catch (error) {
    console.error('Failed to create tratamiento info:', error);
    throw error;
  }
};

// Eliminar tratamiento
export const deleteTratamiento = async (id) => {
  await setAuthToken();
  try {
    const response = await api.delete(`/tratamiento/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete tratamiento info:', error);
    throw error;
  }
};

// Obtener Historial
// Obtener Historial Medico del paciente
export const getHistorial = async (pacienteId) => {
  await setAuthToken();
  try {
    const response = await api.get(`/historial/paciente/${pacienteId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch historiales:', error);
    throw error;
  }
};

// Obtener Historial Medico del paciente
export const getHistorialInfo = async (pacienteId) => {
  await setAuthToken();
  try {
    const response = await api.get(`/historial/${pacienteId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch historial médico:', error);
    throw error;
  }
};

// Crear Historial
export const addHistorial = async (historialInfo) => {
  await setAuthToken();
  try {
    const response = await api.post(`/historial`, historialInfo);
    return response.data;
  } catch (error) {
    console.error('Failed to create historial info:', error);
    throw error;
  }
};

// Actualizar historial
export const updateHistorialInfo = async (id, historialInfo) => {
  await setAuthToken();
  try {
    const response = await api.put(`/historial/${id}`, historialInfo);
    return response.data;
  } catch (error) {
    console.error('Failed to update historial info:', error);
    throw error;
  }
};

// Obtener pacientes
export const getPacientes = async () => {
  await setAuthToken();
  try {
    const response = await api.get(`/paciente/getPacientes`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pacientes:', error);
    throw error;
  }
};

// Obtener pacientes por medico
export const getPacientesByMedico = async (id) => {
  await setAuthToken();
  try {
    const response = await api.get(`/paciente/pacientes_medico/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pacientes by medico:', error);
    throw error;
  }
};
