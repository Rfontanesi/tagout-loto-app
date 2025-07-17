import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStyles } from '../styles/GlobalStyles';

export const registrarAlertaCadeado = async (evento, code) => {
  const newAlert = {
    evento,
    code,
    timestamp: new Date().toISOString(),
  };
  const rawAlerts = await AsyncStorage.getItem('cadeado_alertas');
  const alerts = rawAlerts ? JSON.parse(rawAlerts) : [];
  alerts.push(newAlert);
  await AsyncStorage.setItem('cadeado_alertas', JSON.stringify(alerts));
};

export default function LockAlertsScreen() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const rawAlerts = await AsyncStorage.getItem('cadeado_alertas');
      const loadedAlerts = rawAlerts ? JSON.parse(rawAlerts) : [];
      setAlerts(loadedAlerts.reverse()); // Show latest first
    };
    fetchAlerts();
  }, []);

  const clearAlerts = async () => {
    await AsyncStorage.removeItem('cadeado_alertas');
    setAlerts([]);
    alert('Alertas limpos com sucesso!');
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Alertas de Cadeados</Text>
      <FlatList
        data={alerts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.event}>{item.evento}</Text>
            <Text style={styles.code}>Cadeado: {item.code}</Text>
            <Text style={styles.time}>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
      />
      <Button title="Limpar Alertas" onPress={clearAlerts} color="#D92B2B" />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  event: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D92B2B',
  },
  code: {
    fontSize: 14,
    color: '#555',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
});


