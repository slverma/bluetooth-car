import React, { useState, useEffect } from 'react';
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
import { useSettings } from '../contexts/SettingsContext';

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
}: SettingsModalProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === 'dark';
  const { commands, updateCommand, resetToDefaults } = useSettings();

  const [editedCommands, setEditedCommands] = useState(commands);

  // Sync editedCommands when modal becomes visible or commands change
  useEffect(() => {
    if (visible) {
      console.log('Settings modal opened, current commands:', commands);
      setEditedCommands(commands);
    }
  }, [visible, commands]);

  const handleSave = async () => {
    // Save all commands
    const keys = Object.keys(editedCommands) as Array<keyof typeof commands>;
    for (const key of keys) {
      if (editedCommands[key] !== commands[key]) {
        await updateCommand(key, editedCommands[key]);
      }
    }
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
              paddingBottom: safeAreaInsets.bottom + 20,
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              ⚙️ Command Settings
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeButton, { color: textColor }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.description, { color: textColor }]}>
            Configure the commands sent to your Bluetooth device
          </Text>

          <ScrollView
            style={styles.commandsList}
            showsVerticalScrollIndicator={false}
          >
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
          </ScrollView>

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
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    height: '85%',
    flexDirection: 'column',
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
  commandsList: {
    flexGrow: 1,
    flexShrink: 1,
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
