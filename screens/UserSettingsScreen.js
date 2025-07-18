// screens/UserSettingsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Modal, TouchableOpacity, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

function UserSettingsWrapper() {
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');
  const [emergency, setEmergency] = useState('');
  const [allergy, setAllergy] = useState('');
  const [blood, setBlood] = useState('');
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [historicList, setHistoricList] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const loadInfo = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      const storedBlood = await AsyncStorage.getItem('userBlood');
      const storedEmergency = await AsyncStorage.getItem('userEmergency');
      const storedAllergy = await AsyncStorage.getItem('userAllergy');
      if (storedName) setName(storedName);
      if (storedBlood) setBlood(storedBlood);
      if (storedEmergency) setEmergency(storedEmergency);
      if (storedAllergy) setAllergy(storedAllergy);

      const lastLockLocation = await AsyncStorage.getItem('lastLockLocation');
      if (lastLockLocation) setLocation(lastLockLocation);
    };

    const loadRole = async () => {
      const saved = await AsyncStorage.getItem('userRole');
      setRole(saved);
    };

    loadInfo();
    loadRole();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permissão negada');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      const currentLoc = `${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`;
      setLocation(currentLoc);
      await AsyncStorage.setItem('lastLockLocation', currentLoc);
    })();
  }, []);

  const getRoleName = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'supervisor': return 'Supervisão';
      case 'operador': return 'Operação';
      default: return 'Desconhecido';
    }
  };

  const handleRoleChange = async (newRole) => {
    await AsyncStorage.setItem('userRole', newRole);
    setRole(newRole);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}><Ionicons name="person-circle" size={28} color="#D92B2B" /> Perfil do Usuário</Text>

      <Text style={styles.label}>Filtrar por data (YYYY-MM-DD):</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-07-17"
        value={filterDate}
        onChangeText={(text) => setFilterDate(text)}
      />

      <Text style={styles.label}>Acesso atual:</Text>
      <Text style={styles.value}>{getRoleName(role)}</Text>

      <Text style={styles.label}>Nome:</Text>
      <Text style={styles.value}>{name || 'Não definido'}</Text>

      <Text style={styles.label}>Tipo Sanguíneo:</Text>
      <Text style={styles.value}>{blood || 'Não definido'}</Text>

      <Text style={styles.label}>Editar Nome:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(text) => {
          setName(text);
          AsyncStorage.setItem('userName', text);
        }}
        placeholder="Digite seu nome"
      />

      <Text style={styles.label}>Editar Tipo Sanguíneo:</Text>
      <TextInput
        style={styles.input}
        value={blood}
        onChangeText={(text) => {
          setBlood(text);
          AsyncStorage.setItem('userBlood', text);
        }}
        placeholder="Ex: O+, A-, etc."
      />

      <Text style={styles.label}>Telefone de Emergência:</Text>
      <Text style={styles.value}>{emergency || 'Não definido'}</Text>

      <Text style={styles.label}>Alergias:</Text>
      <Text style={styles.value}>{allergy || 'Não definido'}</Text>

      <Text style={styles.label}>Editar Telefone de Emergência:</Text>
      <TextInput
        style={styles.input}
        value={emergency}
        onChangeText={(text) => {
          setEmergency(text);
          AsyncStorage.setItem('userEmergency', text);
        }}
        placeholder="Digite o telefone de emergência"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Editar Alergias:</Text>
      <TextInput
        style={styles.input}
        value={allergy}
        onChangeText={(text) => {
          setAllergy(text);
          AsyncStorage.setItem('userAllergy', text);
        }}
        placeholder="Informe medicamentos, alimentos, etc."
      />

      <Text style={styles.label}>Localização Atual:</Text>
      <Text style={styles.value}>{location || 'Carregando localização...'}</Text>

      <Button
        title="Ver histórico de localização de cadeado"
        color="#D92B2B"
        onPress={async () => {
          const stored = await AsyncStorage.getItem('cadeado_historico_localizacoes');
          if (stored) {
            const data = JSON.parse(stored);
            setHistoricList(data);
            setShowMap(true);

            const mensagens = data.map((item, index) =>
              `#${index + 1} - ${item.location}\n${new Date(item.time).toLocaleString()}`
            ).join('\n');

            alert(`Histórico de localizações:\n\n${mensagens}`);
          } else {
            alert('Nenhuma localização de cadeado registrada ainda.');
          }
        }}
      />

      <Button
        title="Salvar localização do cadeado"
        color="#D92B2B"
        onPress={async () => {
          const time = new Date().toISOString();
          const lockHistory = await AsyncStorage.getItem('cadeado_historico_localizacoes');
          const historico = lockHistory ? JSON.parse(lockHistory) : [];
          historico.push({ location, time });
          await AsyncStorage.setItem('cadeado_historico_localizacoes', JSON.stringify(historico));
          alert('Localização associada ao uso do cadeado com sucesso!');
        }}
      />

      <Text style={styles.label}>Alterar tipo de acesso:</Text>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Ionicons.Button name="settings" backgroundColor="#D92B2B" onPress={() => handleRoleChange('admin')}>Admin</Ionicons.Button>
        <Ionicons.Button name="construct" backgroundColor="#D92B2B" onPress={() => handleRoleChange('supervisor')}>Supervisor</Ionicons.Button>
        <Ionicons.Button name="person" backgroundColor="#D92B2B" onPress={() => handleRoleChange('operador')}>Operador</Ionicons.Button>
      </View>

      <Button
        title="Limpar histórico de localização"
        color="#999"
        onPress={async () => {
          await AsyncStorage.removeItem('cadeado_historico_localizacoes');
          alert('Histórico de localizações apagado com sucesso.');
        }}
      />

      <Modal visible={showMap} animationType="slide">
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Histórico de Localizações</Text>
          <MapView
            style={{ width: '100%', height: 300, marginBottom: 20 }}
            initialRegion={{
              latitude: -23.5505,
              longitude: -46.6333,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            {historicList
              .filter(item => !filterDate || item.time.startsWith(filterDate))
              .map((item, index) => {
                const [lat, lng] = item.location.split(',').map(coord => parseFloat(coord));
                return <Marker key={index} coordinate={{ latitude: lat, longitude: lng }} title={`Registro #${index + 1}`} />;
              })}
          </MapView>

          {historicList
            .filter(item => !filterDate || item.time.startsWith(filterDate))
            .map((item, index) => (
              <View key={index} style={{ marginBottom: 15 }}>
                <Text>#{index + 1}</Text>
                <Text>Localização: {item.location}</Text>
                <Text>Data/hora: {new Date(item.time).toLocaleString()}</Text>
              </View>
            ))}

          {filterDate && historicList.filter(item => item.time.startsWith(filterDate)).length === 0 && (
            <Text style={{ color: 'gray', fontStyle: 'italic' }}>Nenhum registro encontrado para esta data.</Text>
          )}

          <TouchableOpacity onPress={() => setShowMap(false)} style={{ backgroundColor: '#D92B2B', padding: 10, borderRadius: 5 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Fechar</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

export default UserSettingsWrapper;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    width: '80%',
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#D92B2B',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
  },
});
