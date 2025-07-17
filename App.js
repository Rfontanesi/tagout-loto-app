import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import TabNavigator from './navigation/TabNavigator';
import QRScanAndProfileView from './screens/QRScanAndProfileView';
import AdminUserManagerScreen from './screens/AdminUserManagerScreen';
import UserMedicalProfileScreen from './screens/UserMedicalProfileScreen';
import ExportReportScreen from './screens/ExportReportScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setInitialRoute(role ? 'Main' : 'Login');
    };
    checkLogin();
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Ficha" component={QRScanAndProfileView} />
        <Stack.Screen name="Gerenciar Usuários" component={AdminUserManagerScreen} />
        <Stack.Screen name="Ficha Médica" component={UserMedicalProfileScreen} />
        <Stack.Screen name="Exportar" component={ExportReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


