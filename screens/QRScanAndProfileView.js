import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function QRScanAndProfileView({ route }) {
  const [profile, setProfile] = useState(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    if (route.params?.triggerScan) {
      AsyncStorage.getItem('medicalProfile').then((data) => {
        if (data) setProfile(JSON.parse(data));
        setScanning(false);
      });
    }
  }, [route.params]);

  if (scanning) {
    return (
      <View style={GlobalStyles.container}>
        <ActivityIndicator size="large" color="#D92B2B" />
        <Text>Verificando ficha do usuário...</Text>
      </View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Informações do Operador</Text>
      {profile?.photo && <Image source={{ uri: profile.photo }} style={styles.image} />}
      <Text>Tipo Sanguíneo: {profile?.bloodType}</Text>
      <Text>Alergias: {profile?.allergies}</Text>
      <Text>Enfermidades: {profile?.diseases}</Text>
      <Text>Emergência: {profile?.emergencyContact}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    resizeMode: 'contain',
  },
});


