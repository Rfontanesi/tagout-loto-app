// screens/HistoricMapScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoricMapScreen() {
  const [historicList, setHistoricList] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchHistoric = async () => {
      const stored = await AsyncStorage.getItem('cadeado_historico_localizacoes');
      if (stored) {
        const data = JSON.parse(stored);
        setHistoricList(data);
      }
    };
    fetchHistoric();
  }, []);

  const filteredData = historicList.filter(item => !filterDate || item.time.startsWith(filterDate));

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Histórico de Localizações</Text>

      <TextInput
        style={styles.input}
        placeholder="Filtrar por data (YYYY-MM-DD)"
        value={filterDate}
        onChangeText={setFilterDate}
      />

      <MapView
        style={{ width: '100%', height: 300, marginBottom: 20 }}
        initialRegion={{
          latitude: -23.5505,
          longitude: -46.6333,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {filteredData.map((item, index) => {
          const [lat, lng] = item.location.split(',').map(coord => parseFloat(coord));
          return (
            <Marker
              key={index}
              coordinate={{ latitude: lat, longitude: lng }}
              title={`Registro #${index + 1}`}
              description={new Date(item.time).toLocaleString()}
            />
          );
        })}
      </MapView>

      {filteredData.map((item, index) => (
        <View key={index} style={{ marginBottom: 15 }}>
          <Text>#{index + 1}</Text>
          <Text>Localização: {item.location}</Text>
          <Text>Data/hora: {new Date(item.time).toLocaleString()}</Text>
        </View>
      ))}

      {filterDate && filteredData.length === 0 && (
        <Text style={{ color: 'gray', fontStyle: 'italic' }}>Nenhum registro encontrado para esta data.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D92B2B',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    width: '100%',
    fontSize: 16,
  },
});
