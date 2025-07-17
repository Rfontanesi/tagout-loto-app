import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registrarAlertaCadeado } from './LockAlertsScreen';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function BatteryStatusScreen() {
  const [batteries, setBatteries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const batteryKeys = keys.filter(k => k.startsWith('battery_'));
      const data = await AsyncStorage.multiGet(batteryKeys);
      const formatted = data.map(([key, val]) => ({
        code: key.replace('battery_', ''),
        level: parseInt(val)
      })).sort((a, b) => a.code.localeCompare(b.code));
      setBatteries(formatted);
    };
    fetchData();
  }, []);

  const handleCheckStatus = async () => {
    const low = batteries.filter(b => b.level < 25);
    if (low.length > 0) {
      for (const item of low) {
        await registrarAlertaCadeado('⚠️ Bateria fraca', item.code);
      }
      alert(`Bateria baixa nos cadeados: ${low.map(l => l.code).join(', ')}`);
    } else {
      alert('✅ Todos os cadeados estão com bateria suficiente.');
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Status das Baterias</Text>
      <FlatList
        data={batteries}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <Text style={[styles.item, item.level < 25 && styles.lowBattery]}>
            Cadeado {item.code}: {item.level}%
          </Text>
        )}
        style={{ marginBottom: 20 }}
      />
      <Button title="Verificar nível crítico" onPress={handleCheckStatus} color="#D92B2B" />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    fontSize: 16,
    paddingVertical: 6,
    color: '#333',
  },
  lowBattery: {
    color: '#b00000',
    fontWeight: 'bold',
  },
});


