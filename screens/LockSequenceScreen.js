import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function LockSequenceScreen() {
  const [equipmentName, setEquipmentName] = useState('');
  const [lockList, setLockList] = useState([]);
  const [currentCode, setCurrentCode] = useState('');

  const handleAddLock = () => {
    if (currentCode.trim()) {
      setLockList([...lockList, currentCode.trim()]);
      setCurrentCode('');
    }
  };

  const handleSaveSequence = async () => {
    if (equipmentName.trim() && lockList.length > 0) {
      const data = {
        equipment: equipmentName,
        sequence: lockList,
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(`seq_${equipmentName}`, JSON.stringify(data));
      alert('Sequência de cadeados salva com sucesso!');
      setEquipmentName('');
      setLockList([]);
    } else {
      alert('Informe o nome do equipamento e ao menos um cadeado.');
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Cadastro de Sequência de Cadeados</Text>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Nome do equipamento"
        value={equipmentName}
        onChangeText={setEquipmentName}
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="Código do cadeado (via QRCode ou ID)"
        value={currentCode}
        onChangeText={setCurrentCode}
      />

      <Button title="Adicionar cadeado à sequência" onPress={handleAddLock} color="#D92B2B" />

      <FlatList
        data={lockList}
        keyExtractor={(item, index) => `${item}_${index}`}
        renderItem={({ item, index }) => (
          <Text style={styles.listItem}>{index + 1}. {item}</Text>
        )}
        style={{ marginVertical: 20 }}
      />

      <Button title="Salvar sequência" onPress={handleSaveSequence} color="#D92B2B" />
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
});


