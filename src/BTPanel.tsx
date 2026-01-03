import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bleManager } from './ble/bleManager';
import BTDevices from './BTDevices';
import BluetoothIcon from './icons/BluetoothIcon';
import RefreshIcon from './icons/RefreshIcon';
import { useBluetooth } from './contexts/BluetoothContext';

export default function BTPanel() {
  const safeAreaInsets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === 'dark';
  const { connectedDevice, spinAnim, sendData } = useBluetooth();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    return () => {
      bleManager.destroy();
    };
  }, []);

  const handleStop = async () => {
    console.log('Stop');
    if (connectedDevice) {
      await sendData('S');
    }
  };

  const handleForwardPress = async () => {
    console.log('Forward');
    if (connectedDevice) {
      await sendData('F');
    }
  };

  const handleBackwardPress = async () => {
    console.log('Backward');
    if (connectedDevice) {
      await sendData('B');
    }
  };

  const handleLeftPress = async () => {
    console.log('Left');
    if (connectedDevice) {
      await sendData('L');
    }
  };

  const handleRightPress = async () => {
    console.log('Right');
    if (connectedDevice) {
      await sendData('R');
    }
  };

  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, paddingTop: safeAreaInsets.top },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: textColor }]}>🚙</Text>
          <Text style={[styles.title, { color: textColor }]}>
            Bluetooth Car Controller
          </Text>
          {connectedDevice && (
            <Text style={[styles.connectedDeviceText, { color: '#34C759' }]}>
              Connected to: {connectedDevice.name}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.connectionButton,
            connectedDevice && styles.connectionButtonConnected,
          ]}
          onPress={() => {
            setShowModal(true);
          }}
        >
          <View style={styles.iconContainer}>
            <View style={styles.refreshIconBorder}>
              <RefreshIcon color="#fff" spinAnim={spinAnim} />
            </View>
            <View style={styles.bluetoothIconCenter}>
              <BluetoothIcon color="#fff" size={20} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <BTDevices showModal={showModal} setShowModal={setShowModal} />

      <View style={styles.controlsContainer}>
        {/* Forward Button */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPressIn={handleForwardPress}
            onPressOut={handleStop}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>▲</Text>
            <Text style={styles.buttonLabel}>Forward</Text>
          </TouchableOpacity>
        </View>

        {/* Left and Right Buttons */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPressIn={handleLeftPress}
            onPressOut={handleStop}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>◀</Text>
            <Text style={styles.buttonLabel}>Left</Text>
          </TouchableOpacity>

          <View style={styles.spacer} />

          <TouchableOpacity
            style={styles.button}
            onPressIn={handleRightPress}
            onPressOut={handleStop}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>▶</Text>
            <Text style={styles.buttonLabel}>Right</Text>
          </TouchableOpacity>
        </View>

        {/* Backward Button */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPressIn={handleBackwardPress}
            onPressOut={handleStop}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>▼</Text>
            <Text style={styles.buttonLabel}>Backward</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: textColor }]}>
          {connectedDevice
            ? 'Connected - Ready to control'
            : 'Connect to bluetooth to control'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingRight: 90,
    alignItems: 'center',
    position: 'relative',
  },
  titleContainer: {
    alignItems: 'center',
    maxWidth: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  connectedDeviceText: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
  connectionButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  connectionButtonConnected: {
    backgroundColor: '#34C759',
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
  },
  refreshIconBorder: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bluetoothIconCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  deviceItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: '#888',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeModalButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  controlsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
    fontWeight: '600',
  },
  spacer: {
    width: 40,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    opacity: 0.6,
  },
  device: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});
