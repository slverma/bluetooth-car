import React, { useState, useEffect, JSX } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings, ThemeType } from '../contexts/SettingsContext';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const commandLabels = {
  forward: '⬆️ Forward',
  backward: '⬇️ Backward',
  left: '⬅️ Left',
  right: '➡️ Right',
  stop: '⏹️ Stop',
  hornOn: '📯 Horn On',
  hornOff: '🔇 Horn Off',
  lightOn: '💡 Light On',
  lightOff: '🌑 Light Off',
};

export default function SettingsModal({
  visible,
  onClose,
}: SettingsModalProps): JSX.Element {
  const safeAreaInsets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === 'dark';
  const { commands, theme, updateCommand, updateTheme, resetToDefaults } =
    useSettings();

  const [editedCommands, setEditedCommands] = useState(commands);
  const [editedTheme, setEditedTheme] = useState<ThemeType>(theme);

  // Sync editedCommands when modal becomes visible or commands change
  useEffect(() => {
    if (visible) {
      console.log('Settings modal opened, current commands:', commands);
      setEditedCommands(commands);
      setEditedTheme(theme);
    }
  }, [visible, commands, theme]);

  const handleSave = async () => {
    console.log('Saving settings...');
    console.log('Current theme:', theme);
    console.log('Edited theme:', editedTheme);

    // Save theme if changed (do this first)
    if (editedTheme !== theme) {
      console.log('Updating theme to:', editedTheme);
      await updateTheme(editedTheme);
    }

    // Save all commands
    const keys = Object.keys(editedCommands) as Array<keyof typeof commands>;
    for (const key of keys) {
      if (editedCommands[key] !== commands[key]) {
        await updateCommand(key, editedCommands[key]);
      }
    }

    console.log('Settings saved, closing modal');
    onClose();
  };

  const handleReset = async () => {
    await resetToDefaults();
    setEditedCommands({
      forward: 'F',
      backward: 'B',
      left: 'L',
      right: 'R',
      stop: 'S',
      hornOn: 'O',
      hornOff: 'o',
      lightOn: 'T',
      lightOff: 't',
    });
    setEditedTheme('vertical');
  };

  const backgroundColor = isDarkMode ? '#1C1C1E' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const inputBackgroundColor = isDarkMode ? '#2C2C2E' : '#F2F2F7';
  const borderColor = isDarkMode ? '#3A3A3C' : '#E5E5EA';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor,
              paddingBottom: safeAreaInsets.bottom,
            },
          ]}
        >
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>
                ⚙️ Command Settings
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={[styles.closeButton, { color: textColor }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.description, { color: textColor }]}>
              Configure the commands sent to your Bluetooth device
            </Text>

            {/* Theme Selection */}
            <View style={styles.themeSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                🎨 Theme
              </Text>
              <View style={styles.themeButtons}>
                <TouchableOpacity
                  style={[
                    styles.themeButton,
                    { borderColor: borderColor },
                    editedTheme === 'vertical' && styles.themeButtonActive,
                  ]}
                  onPress={() => setEditedTheme('vertical')}
                >
                  <Text
                    style={[
                      styles.themeButtonText,
                      { color: textColor },
                      editedTheme === 'vertical' &&
                        styles.themeButtonTextActive,
                    ]}
                  >
                    📱 Vertical
                  </Text>
                  <Text
                    style={[
                      styles.themeButtonDescription,
                      { color: textColor },
                    ]}
                  >
                    D-Pad controls
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.themeButton,
                    { borderColor: borderColor },
                    editedTheme === 'horizontal' && styles.themeButtonActive,
                  ]}
                  onPress={() => setEditedTheme('horizontal')}
                >
                  <Text
                    style={[
                      styles.themeButtonText,
                      { color: textColor },
                      editedTheme === 'horizontal' &&
                        styles.themeButtonTextActive,
                    ]}
                  >
                    📲 Horizontal
                  </Text>
                  <Text
                    style={[
                      styles.themeButtonDescription,
                      { color: textColor },
                    ]}
                  >
                    Car-style controls
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: textColor }]}>
              📝 Commands
            </Text>

            <View style={styles.commandsList}>
              {(
                Object.keys(commandLabels) as Array<keyof typeof commandLabels>
              ).map(key => (
                <View key={key} style={styles.commandItem}>
                  <Text style={[styles.commandLabel, { color: textColor }]}>
                    {commandLabels[key]}
                  </Text>
                  <TextInput
                    style={[
                      styles.commandInput,
                      {
                        backgroundColor: inputBackgroundColor,
                        color: textColor,
                        borderColor: borderColor,
                      },
                    ]}
                    value={editedCommands[key]}
                    onChangeText={text =>
                      setEditedCommands({ ...editedCommands, [key]: text })
                    }
                    placeholder={`Enter ${key} command`}
                    placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                    maxLength={20}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={handleReset}
              >
                <Text style={styles.resetButtonText}>Reset to Defaults</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    width: '100%',
    maxWidth: 600,
    maxHeight: '100%',
    overflow: 'hidden',
  },
  scrollContainer: {
    maxHeight: '100%',
  },
  scrollContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 28,
    fontWeight: '300',
    paddingHorizontal: 8,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 20,
  },
  themeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  themeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  themeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeButtonTextActive: {
    color: '#fff',
  },
  themeButtonDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  commandsList: {
    marginBottom: 20,
  },
  commandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  commandLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    minWidth: 100,
  },
  commandInput: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1.5,
    minWidth: 80,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
