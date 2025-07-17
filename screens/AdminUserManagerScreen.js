import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function AdminUserManagerScreen() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setUsers(list);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao carregar usuários');
    }
  };

  const updateLevel = async (userId, newLevel) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { level: newLevel });
      Alert.alert('Permissão atualizada');
      fetchUsers();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro ao atualizar usuário');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Gerenciar Usuários</Text>
      <TextInput
        style={GlobalStyles.input}
        placeholder="Buscar por e-mail"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.label}>{item.email}</Text>
            <Text style={styles.level}>Nível: {item.level}</Text>
            <View style={styles.buttons}>
              <Button title="Operação" onPress={() => updateLevel(item.id, 'Operação')} />
              <Button title="Supervisão" onPress={() => updateLevel(item.id, 'Supervisão')} />
              <Button title="Admin" onPress={() => updateLevel(item.id, 'Administrativo')} />
            </View>
          </View>
        )}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f4f4f4',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  level: {
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});


