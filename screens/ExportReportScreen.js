// screens/ExportReportScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ExportReportScreen() {
  const [status, setStatus] = useState('');

  const exportToCSV = async () => {
    try {
      const alertsRaw = await AsyncStorage.getItem('cadeado_alertas');
      const incidentsRaw = await AsyncStorage.getItem('incident_logs');

      const alerts = alertsRaw ? JSON.parse(alertsRaw) : [];
      const incidents = incidentsRaw ? JSON.parse(incidentsRaw) : [];

      let csv = 'Tipo,Descrição,Data\n';
      alerts.forEach(item => {
        csv += `Alerta,${item.evento} - ${item.code},${item.timestamp}\n`;
      });
      incidents.forEach(item => {
        csv += `Ocorrência,${item.description},${item.timestamp}\n`;
      });

      const fileUri = FileSystem.documentDirectory + 'relatorio_loto.csv';
      await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });

      if (!(await Sharing.isAvailableAsync())) {
        setStatus('Compartilhamento não disponível.');
        return;
      }

      await Sharing.shareAsync(fileUri);
      setStatus('✅ Relatório exportado com sucesso!');
    } catch (err) {
      console.error(err);
      setStatus('Erro ao exportar relatório.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exportar Relatórios</Text>
      <Button title="Exportar CSV (Alertas e Ocorrências)" onPress={exportToCSV} color="#D92B2B" />
      {status && <Text style={styles.status}>{status}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#D92B2B',
    textAlign: 'center',
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
});

