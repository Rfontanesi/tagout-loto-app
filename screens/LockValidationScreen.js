import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registrarAlertaCadeado } from './LockAlertsScreen';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function LockValidationScreen() {
  const [equipmentName, setEquipmentName] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [resetCode, setResetCode] = useState('');

  const handleValidate = async () => {
    if (!equipmentName.trim() || !enteredCode.trim()) {
      alert('Preencha os dois campos.');
      return;
    }

    const raw = await AsyncStorage.getItem(`seq_${equipmentName}`);
    if (!raw) {
      setStatusMessage('Equipamento não encontrado.');
      return;
    }

    const data = JSON.parse(raw);
    const key = `cadeado_status_${equipmentName}`;
    const statusRaw = await AsyncStorage.getItem(key);
    const unlocked = statusRaw ? JSON.parse(statusRaw) : [];

    const index = data.sequence.indexOf(enteredCode);
    if (index === -1) {
      setStatusMessage('Cadeado não pertence à sequência.');
    } else {
      const nextExpected = data.sequence.slice(index + 1);
      const allNextUnlocked = nextExpected.every(code => unlocked.includes(code));

      if (!allNextUnlocked) {
        setStatusMessage(`Cadeados posteriores ainda estão em uso. Libere os seguintes: ${nextExpected.filter(c => !unlocked.includes(c)).join(', ')}`);
      } else {
        if (!unlocked.includes(enteredCode)) {
          unlocked.push(enteredCode);
          await AsyncStorage.setItem(key, JSON.stringify(unlocked));
          await registrarAlertaCadeado('Cadeado liberado', enteredCode);
        }
        setStatusMessage('✅ Cadeado liberado com sucesso!');
      }
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Validação de Liberação</Text>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Nome do equipamento"
        value={equipmentName}
        onChangeText={setEquipmentName}
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="Código do cadeado"
        value={enteredCode}
        onChangeText={setEnteredCode}
      />

      <Button title="Validar liberação" onPress={handleValidate} color="#D92B2B" />

      <Text style={GlobalStyles.title}>Reset Geral (Administrador)</Text>
      <TextInput
        style={GlobalStyles.input}
        placeholder="Senha do administrador"
        secureTextEntry
        onChangeText={(text) => setResetCode(text)}
      />
      <Button
        title="Resetar sequência"
        onPress={async () => {
          if (resetCode === 'admin123') {
            await AsyncStorage.removeItem(`cadeado_status_${equipmentName}`);
            setStatusMessage('🔄 Sequência resetada com sucesso.');
            await registrarAlertaCadeado('Sequência resetada', 'Todos');
          } else {
            alert('Senha inválida. Contate o administrador.');
          }
        }}
        color="#666"
      />

      {statusMessage && (
        <Text style={{ marginTop: 20, fontSize: 16 }}>{statusMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Estes estilos podem ser movidos para GlobalStyles se forem genéricos
  // ou mantidos aqui se forem específicos desta tela.
});


