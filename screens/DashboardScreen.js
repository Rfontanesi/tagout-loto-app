import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Dashboard</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Validar')}
      >
        <Ionicons name="lock-open" size={24} color="white" />
        <Text style={styles.buttonText}>Validar Liberação</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Sequência')}
      >
        <Ionicons name="list" size={24} color="white" />
        <Text style={styles.buttonText}>Cadastro de Sequência</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Cadastro')}
      >
        <Ionicons name="construct" size={24} color="white" />
        <Text style={styles.buttonText}>Cadastro de Máquina</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Máquinas')}
      >
        <Ionicons name="albums" size={24} color="white" />
        <Text style={styles.buttonText}>Máquinas Cadastradas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Bateria')}
      >
        <Ionicons name="battery-half" size={24} color="white" />
        <Text style={styles.buttonText}>Status das Baterias</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Mapa')}
      >
        <Ionicons name="map" size={24} color="white" />
        <Text style={styles.buttonText}>Histórico de Localização</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Alertas')}
      >
        <Ionicons name="notifications" size={24} color="white" />
        <Text style={styles.buttonText}>Alertas de Cadeados</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Ocorrências')}
      >
        <Ionicons name="warning" size={24} color="white" />
        <Text style={styles.buttonText}>Registrar Ocorrência</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Scanner')}
      >
        <Ionicons name="qr-code" size={24} color="white" />
        <Text style={styles.buttonText}>Escanear QR Code</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Exportar')}
      >
        <Ionicons name="share" size={24} color="white" />
        <Text style={styles.buttonText}>Exportar Relatórios</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Gerenciar Usuários')}
      >
        <Ionicons name="people" size={24} color="white" />
        <Text style={styles.buttonText}>Gerenciar Usuários</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Ficha Médica')}
      >
        <Ionicons name="medkit" size={24} color="white" />
        <Text style={styles.buttonText}>Ficha Médica</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Sair')}
      >
        <Ionicons name="exit" size={24} color="white" />
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: '#D92B2B',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
});


