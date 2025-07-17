import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import BatteryStatusScreen from '../screens/BatteryStatusScreen';
import IncidentLogScreen from '../screens/IncidentLogScreen';
import QRScannerTrigger from '../screens/QRScannerTrigger';
import RegisterLocksScreen from '../screens/RegisterLocksScreen';
import LogoutScreen from '../screens/LogoutScreen';
import UserSettingsScreen from '../screens/UserSettingsScreen';
import HistoricMapScreen from '../screens/HistoricMapScreen';
import LockAlertsScreen from '../screens/LockAlertsScreen';
import LockSequenceScreen from '../screens/LockSequenceScreen';
import LockValidationScreen from '../screens/LockValidationScreen';
import MachineRegisterScreen from '../screens/MachineRegisterScreen';
import MachineListScreen from '../screens/MachineListScreen';
import ExportReportScreen from '../screens/ExportReportScreen';
import AdminUserManagerScreen from '../screens/AdminUserManagerScreen';
import UserMedicalProfileScreen from '../screens/UserMedicalProfileScreen';
import QRCodeUserViewerScreen from '../screens/QRCodeUserViewerScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Dashboard': iconName = 'home'; break;
          case 'Bateria': iconName = 'battery-half'; break;
          case 'Ocorrências': iconName = 'alert-circle'; break;
          case 'QR': iconName = 'qr-code'; break;
          case 'Travar': iconName = 'lock-closed'; break;
          case 'Sair': iconName = 'exit'; break;
          case 'Perfil': iconName = 'person-circle'; break;
          case 'Histórico': iconName = 'map'; break;
          case 'Alertas': iconName = 'notifications'; break;
          case 'Sequência': iconName = 'list'; break;
          case 'Validar': iconName = 'lock-open'; break;
          case 'Cadastro': iconName = 'construct'; break;
          case 'Máquinas': iconName = 'albums'; break;
          case 'Exportar': iconName = 'share'; break;
          case 'Gerenciar Usuários': iconName = 'people'; break;
          case 'Ficha Médica': iconName = 'document-text'; break;
          case 'Visualizar QR': iconName = 'qr-code'; break;
          default: iconName = 'ellipse';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#D92B2B',
      tabBarInactiveTintColor: 'gray',
    })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Bateria" component={BatteryStatusScreen} />
      <Tab.Screen name="Ocorrências" component={IncidentLogScreen} />
      <Tab.Screen name="QR" component={QRScannerTrigger} />
      <Tab.Screen name="Travar" component={RegisterLocksScreen} />
      <Tab.Screen name="Perfil" component={UserSettingsScreen} />
      <Tab.Screen name="Histórico" component={HistoricMapScreen} />
      <Tab.Screen name="Alertas" component={LockAlertsScreen} />
      <Tab.Screen name="Sequência" component={LockSequenceScreen} />
      <Tab.Screen name="Validar" component={LockValidationScreen} />
      <Tab.Screen name="Cadastro" component={MachineRegisterScreen} />
      <Tab.Screen name="Máquinas" component={MachineListScreen} />
      <Tab.Screen name="Exportar" component={ExportReportScreen} />
      <Tab.Screen name="Gerenciar Usuários" component={AdminUserManagerScreen} />
      <Tab.Screen name="Ficha Médica" component={UserMedicalProfileScreen} />
      <Tab.Screen name="Visualizar QR" component={QRCodeUserViewerScreen} />
      <Tab.Screen name="Sair" component={LogoutScreen} />
    </Tab.Navigator>
  );
}


