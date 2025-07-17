import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function UserMedicalProfileScreen() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  useEffect(() => {
    const load = async () => {
      const raw = await AsyncStorage.getItem('user_medical');
      if (raw) {
        const data = JSON.parse(raw);
        setName(data.name || '');
        setRole(data.role || '');
        setBloodType(data.bloodType || '');
        setAllergies(data.allergies || '');
        setConditions(data.conditions || '');
        setEmergencyPhone(data.emergencyPhone || '');
      }
    };
    load();
  }, []);

  const save = async () => {
    const data = { name, role, bloodType, allergies, conditions, emergencyPhone };
    await AsyncStorage.setItem('user_medical', JSON.stringify(data));
    alert('Ficha médica salva com sucesso.');
  };

  return (
    <ScrollView contentContainerStyle={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Ficha Médica</Text>
      <TextInput style={GlobalStyles.input} placeholder="Nome completo" value={name} onChangeText={setName} />
      <TextInput style={GlobalStyles.input} placeholder="Função / Cargo" value={role} onChangeText={setRole} />
      <TextInput style={GlobalStyles.input} placeholder="Tipo sanguíneo" value={bloodType} onChangeText={setBloodType} />
      <TextInput style={GlobalStyles.input} placeholder="Alergias (se houver)" value={allergies} onChangeText={setAllergies} />
      <TextInput style={GlobalStyles.input} placeholder="Condições de saúde" value={conditions} onChangeText={setConditions} />
      <TextInput style={GlobalStyles.input} placeholder="Telefone de emergência" value={emergencyPhone} onChangeText={setEmergencyPhone} keyboardType="phone-pad" />
      <Button title="Salvar ficha médica" onPress={save} color="#D92B2B" />
    </ScrollView>
  );
}


