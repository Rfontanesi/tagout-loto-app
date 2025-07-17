import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function IncidentLogScreen({ navigation }) {
  const [description, setDescription] = useState('');
  const [incidentList, setIncidentList] = useState([]);

  const loadIncidents = async () => {
    const raw = await AsyncStorage.getItem('incident_logs');
    const list = raw ? JSON.parse(raw) : [];
    setIncidentList(list);
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleAddIncident = async () => {
    if (!description.trim()) return;
    const newIncident = {
      description,
      timestamp: new Date().toISOString(),
    };
    const updated = [...incidentList, newIncident];
    await AsyncStorage.setItem('incident_logs', JSON.stringify(updated));
    setIncidentList(updated);
    setDescription('');
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Registrar Ocorrência</Text>
      <TextInput
        style={GlobalStyles.input}
        placeholder="Descreva o ocorrido..."
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Salvar ocorrência" onPress={handleAddIncident} color="#D92B2B" />

      <FlatList
        data={incidentList.reverse()}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.time}>{new Date(item.timestamp).toLocaleString()}</Text>
            <Text style={styles.desc}>{item.description}</Text>
          </View>
        )}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#eee',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  desc: {
    fontSize: 15,
    color: '#333',
  },
});


