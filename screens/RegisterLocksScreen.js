import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStyles } from '../styles/GlobalStyles';

function UnlockStatusIndicator({ lockId }) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem('unlockedLocks');
      const list = data ? JSON.parse(data) : [];
      setUnlocked(list.includes(lockId));
    })();
  }, []);

  return (
    <Text style={{ color: unlocked ? 'green' : 'gray', fontWeight: 'bold' }}>
      {unlocked ? 'Liberado' : 'Travado'}
    </Text>
  );
}

function AdminResetPanel({ isAdmin }) {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const checkPending = async () => {
      const isPending = await AsyncStorage.getItem('pendingResetRequest');
      setPending(isPending === 'true');
    };
    checkPending();
  }, []);

  const authorizeReset = async () => {
    await AsyncStorage.setItem('adminApprovedReset', 'true');
    await AsyncStorage.removeItem('pendingResetRequest');
    setPending(false);
    Alert.alert('Liberação concedida', 'Agora o operador pode limpar a sequência.');
  };

  if (!isAdmin || !pending) return null;

  return (
    <View style={{ marginTop: 30, backgroundColor: '#F5F5F5', padding: 15, borderRadius: 8 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Solicitação de Reset</Text>
      <TouchableOpacity onPress={authorizeReset} style={GlobalStyles.button}>
        <Text style={GlobalStyles.buttonText}>Autorizar Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RegisterLocksScreen() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRoleLoaded, setUserRoleLoaded] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [locks, setLocks] = useState([]);
  const [mode, setMode] = useState('sequencial');

  useEffect(() => {
    (async () => {
      const role = await AsyncStorage.getItem('userRole');
      setIsAdmin(role === 'admin');
      setUserRoleLoaded(true);

      const stored = await AsyncStorage.getItem('registeredLocks');
      if (stored) {
        const parsed = JSON.parse(stored);
        setLocks(parsed.sequence);
        setMode(parsed.mode);
      }
    })();
  }, []);

  const requestPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    setScanning(true);
  };

  const handleBarCodeScanned = async ({ data }) => {
    if (!locks.includes(data)) {
      const newLocks = [...locks, data];
      setLocks(newLocks);
      await AsyncStorage.setItem('registeredLocks', JSON.stringify({ sequence: newLocks, mode }));
    }
    setScanning(false);
  };

  const handleClear = async () => {
    const approval = await AsyncStorage.getItem('adminApprovedReset');

    if (approval === 'true') {
      await AsyncStorage.removeItem('unlockedLocks');
      await AsyncStorage.removeItem('adminApprovedReset');
      Alert.alert('Sequência reiniciada. Todos os cadeados estão agora travados.');
    } else {
      Alert.alert(
        'Ação restrita',
        'A liberação para reiniciar os cadeados deve ser feita por um administrador. Por favor, entre em contato.'
      );
      await AsyncStorage.setItem('pendingResetRequest', 'true');
    }
  };

  const handleUnlockRequest = async () => {
    const unlocked = await AsyncStorage.getItem('unlockedLocks');
    const unlockedList = unlocked ? JSON.parse(unlocked) : [];

    if (mode === 'sequencial') {
      const nextRequired = locks.find(lock => !unlockedList.includes(lock));
      if (!nextRequired) {
        Alert.alert('Todos os cadeados já foram liberados.');
      } else {
        unlockedList.push(nextRequired);
        await AsyncStorage.setItem('unlockedLocks', JSON.stringify(unlockedList));
        Alert.alert('Desbloqueado com sucesso:', nextRequired);
      }
    } else {
      Alert.alert('Cadeado único pode ser liberado diretamente.');
    }
  };

  if (!userRoleLoaded) return null;

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Cadastro de Cadeados</Text>

      <View style={styles.modeButtons}>
        <TouchableOpacity onPress={async () => { setMode('sequencial'); await AsyncStorage.setItem('registeredLocks', JSON.stringify({ sequence: locks, mode: 'sequencial' })); }} style={[styles.mode, mode === 'sequencial' && styles.selected]}>
          <Text style={styles.modeText}>Sequência</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => { setMode('unico'); await AsyncStorage.setItem('registeredLocks', JSON.stringify({ sequence: locks, mode: 'unico' })); }} style={[styles.mode, mode === 'unico' && styles.selected]}>
          <Text style={styles.modeText}>Único</Text>
        </TouchableOpacity>
      </View>

      {scanning ? (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={{ height: 300, width: '100%' }}
        />
      ) : (
        <TouchableOpacity style={GlobalStyles.button} onPress={requestPermission}>
          <Text style={GlobalStyles.buttonText}>Escanear Cadeado</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.subtitle}>Cadeados cadastrados ({mode}):</Text>
      <FlatList
        data={locks}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.lockItem, { flex: 1 }]}>{index + 1}. {item}</Text>
            <UnlockStatusIndicator lockId={item} />
          </View>
        )}
      />

      <TouchableOpacity style={GlobalStyles.button} onPress={handleUnlockRequest}>
        <Text style={GlobalStyles.buttonText}>Liberar Cadeado</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.clearText}>Limpar sequência</Text>
      </TouchableOpacity>

      <AdminResetPanel isAdmin={isAdmin} />
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  lockItem: {
    fontSize: 16,
    paddingVertical: 5,
  },
  clearButton: {
    marginTop: 30,
    padding: 10,
    alignItems: 'center',
  },
  clearText: {
    color: '#D92B2B',
    textDecorationLine: 'underline',
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mode: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  selected: {
    backgroundColor: '#D92B2B22',
    borderColor: '#D92B2B',
  },
  modeText: {
    fontWeight: 'bold',
  },
});


