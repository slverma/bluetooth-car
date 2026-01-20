import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CommandSettings {
  forward: string;
  backward: string;
  left: string;
  right: string;
  stop: string;
  hornOn: string;
  hornOff: string;
  lightOn: string;
  lightOff: string;
}

const DEFAULT_COMMANDS: CommandSettings = {
  forward: 'F',
  backward: 'B',
  left: 'L',
  right: 'R',
  stop: 'S',
  hornOn: 'O',
  hornOff: 'o',
  lightOn: 'T',
  lightOff: 't',
};

const STORAGE_KEY = '@bluetooth_car_commands';

interface SettingsContextType {
  commands: CommandSettings;
  updateCommand: (key: keyof CommandSettings, value: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [commands, setCommands] = useState<CommandSettings>(DEFAULT_COMMANDS);
  const [isLoading, setIsLoading] = useState(true);

  // Load commands from storage on mount
  useEffect(() => {
    loadCommands();
  }, []);

  const loadCommands = async () => {
    try {
      console.log('Loading commands from AsyncStorage...');
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('Stored value:', stored);
      if (stored) {
        const parsedCommands = JSON.parse(stored);
        console.log('Parsed commands:', parsedCommands);
        setCommands({ ...DEFAULT_COMMANDS, ...parsedCommands });
      } else {
        console.log('No stored commands found, using defaults');
      }
    } catch (error) {
      console.error('Error loading commands:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCommands = async (newCommands: CommandSettings) => {
    try {
      console.log('Saving commands to AsyncStorage:', newCommands);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCommands));
      console.log('Commands saved successfully');
    } catch (error) {
      console.error('Error saving commands:', error);
    }
  };

  const updateCommand = useCallback(
    async (key: keyof CommandSettings, value: string) => {
      const newCommands = { ...commands, [key]: value };
      setCommands(newCommands);
      await saveCommands(newCommands);
    },
    [commands],
  );

  const resetToDefaults = useCallback(async () => {
    setCommands(DEFAULT_COMMANDS);
    await saveCommands(DEFAULT_COMMANDS);
  }, []);

  const value: SettingsContextType = {
    commands,
    updateCommand,
    resetToDefaults,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
