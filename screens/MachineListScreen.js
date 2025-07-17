import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function MachineListScreen({ navigation }) {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const fetchMachines = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const machineKeys = keys.filter(key => key.startsWith('machine_'));
      const machineData = await AsyncStorage.multiGet(machineKeys);
      const loadedMachines = machineData.map(([key, value]) => JSON.parse(value));
      setMachines(loadedMachines);
    };
    fetchMachines();
  }, []);

  const handleDelete = async (machineName) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir a máquina ${machineName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem(`machine_${machineName}`);
            setMachines(machines.filter(m => m.machine !== machineName));
            Alert.alert('Máquina excluída', `A máquina ${machineName} foi removida.`);
          },
        },
      ]
    );
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Máquinas Cadastradas</Text>
      <FlatList
        data={machines}
        keyExtractor={(item) => item.machine}
        renderItem={({ item }) => (
          <View style={styles.machineItem}>
            <Text style={styles.machineName}>{item.machine}</Text>
            <Text>Cadeados: {item.sequence.join(', ')}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.machine)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  machineItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  machineName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: '#D92B2B',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


