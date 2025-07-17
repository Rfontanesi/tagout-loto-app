import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, FlatList, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function MachineRegisterScreen() {
  const [machineName, setMachineName] = useState('');
  const [sequence, setSequence] = useState([]);
  const [lockCode, setLockCode] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const addLockToSequence = () => {
    if (lockCode.trim()) {
      setSequence([...sequence, lockCode.trim()]);
      setLockCode('');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!machineName || sequence.length === 0) {
      alert('Preencha o nome e adicione pelo menos um cadeado.');
      return;
    }

    const data = {
      machine: machineName,
      image: imageUri,
      sequence,
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(`machine_${machineName}`, JSON.stringify(data));
    alert('Máquina cadastrada com sucesso!');
    setMachineName('');
    setSequence([]);
    setImageUri(null);
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Cadastro de Máquina</Text>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Nome da máquina"
        value={machineName}
        onChangeText={setMachineName}
      />

      <Button title="Selecionar imagem" onPress={pickImage} color="#D92B2B" />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <TextInput
        style={GlobalStyles.input}
        placeholder="Código do cadeado"
        value={lockCode}
        onChangeText={setLockCode}
      />

      <Button title="Adicionar à sequência" onPress={addLockToSequence} color="#D92B2B" />

      <FlatList
        data={sequence}
        keyExtractor={(item, index) => `${item}_${index}`}
        renderItem={({ item, index }) => <Text style={styles.list}>{index + 1}. {item}</Text>}
        style={{ marginVertical: 10 }}
      />

      <Button title="Salvar máquina" onPress={handleSave} color="#D92B2B" />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 6,
  },
  list: {
    fontSize: 16,
    paddingVertical: 2,
  },
});


