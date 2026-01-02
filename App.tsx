/**
 * Bluetooth Car Controller App
 *
 * @format
 */

import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === 'dark';

  const handleForward = () => {
    console.log('Forward');
    // TODO: Send bluetooth command for forward
  };

  const handleBackward = () => {
    console.log('Backward');
    // TODO: Send bluetooth command for backward
  };

  const handleLeft = () => {
    console.log('Left');
    // TODO: Send bluetooth command for left
  };

  const handleRight = () => {
    console.log('Right');
    // TODO: Send bluetooth command for right
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
        <Text style={[styles.title, { color: textColor }]}>🚙</Text>
        <Text style={[styles.title, { color: textColor }]}>
          Bluetooth Car Controller
        </Text>
      </View>

      <View style={styles.controlsContainer}>
        {/* Forward Button */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleForward}
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
            onPress={handleLeft}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>◀</Text>
            <Text style={styles.buttonLabel}>Left</Text>
          </TouchableOpacity>

          <View style={styles.spacer} />

          <TouchableOpacity
            style={styles.button}
            onPress={handleRight}
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
            onPress={handleBackward}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>▼</Text>
            <Text style={styles.buttonLabel}>Backward</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: textColor }]}>
          Connect to bluetooth to control
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
});

export default App;
