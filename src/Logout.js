import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { logout } from './api'; // Asegúrate de que la ruta sea correcta

const Logout = ({ setIsLoggedIn }) => {
  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Bienvenido a SalPÉ</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default Logout;
