/**
 * Bluetooth Car Controller App
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BTPanel from './BTPanel';
import { BluetoothProvider } from './contexts/BluetoothContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <BluetoothProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={isDarkMode ? '#000' : '#fff'}
        />
        <BTPanel />
      </BluetoothProvider>
    </SafeAreaProvider>
  );
}

export default App;
