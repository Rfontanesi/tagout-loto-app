import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function QRCodeUserViewerScreen({ route, navigation }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const raw = await AsyncStorage.getItem('user_medical');
      if (raw) setData(JSON.parse(raw));
    };
    loadProfile();
  }, []);

  if (!data) {
    return (
      <View style={GlobalStyles.container}><Text>Carregando dados...</Text></View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Ficha Médica do Operador</Text>
      <Text style={GlobalStyles.item}><Text style={GlobalStyles.label}>Nome:</Text> {data.name}</Text>
      <Text style={GlobalStyles.item}><Text style={GlobalStyles.label}>Função:</Text> {data.role}</Text>
      <Text style={GlobalStyles.item}><Text style={GlobalStyles.label}>Tipo Sanguíneo:</Text> {data.bloodType}</Text>
      <Text style={GlobalStyles.item}><Text style={GlobalStyles.label}>Alergias:</Text> {data.allergies || 'Nenhuma informada'}</Text>
      <Text style={GlobalStyles.item}><Text style={GlobalStyles.label}>Condições:</Text> {data.conditions || 'Nenhuma informada'}</Text>
      <Text style={GlobalStyles.item}><Text style={GlobalStyles.label}>Emergência:</Text> {data.emergencyPhone}</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} color="#D92B2B" />
    </View>
  );
}

const styles = StyleSheet.create({
  // Estes estilos podem ser movidos para GlobalStyles se forem genéricos
  item: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
});


