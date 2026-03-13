import React, {useState} from 'react';
import {
  Alert,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {API_URL, API_TOKEN} from './config.local';

interface ActionButton {
  id: string;
  label: string;
  message: string;
  color: string;
}

const buttons: ActionButton[] = [
  {id: 'btn1', label: 'Новые слова', message: 'Дай новые слова', color: '#4F46E5'},
  {id: 'btn2', label: 'Повторить слова', message: 'Давай повторим 10 слов', color: '#059669'},
  {id: 'btn3', label: 'Задачи 15 мин', message: 'Дай задачи, которые могу сейчас поделать 15 минут', color: '#DC2626'},
  {id: 'btn4', label: 'Открыть чат', message: '', color: '#6B7280'},
];

function ActionButtonView({
  button,
  onPress,
  disabled,
}: {
  button: ActionButton;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: button.color, opacity: disabled ? 0.5 : 1}]}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.buttonText}>{disabled ? '...' : button.label}</Text>
    </TouchableOpacity>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [sending, setSending] = useState<string | null>(null);

  const sendMessage = async (text: string) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({message: text}),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }
  };

  const handlePress = (button: ActionButton) => {
    if (button.message) {
      sendMessage(button.message).catch(() => {});
    }
    Linking.openURL('tg://resolve?domain=LearnerLang_bot');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#111' : '#f5f5f5'},
      ]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#111' : '#f5f5f5'}
      />
      <Text style={[styles.title, {color: isDarkMode ? '#fff' : '#111'}]}>
        Agent Panel
      </Text>
      <View style={styles.grid}>
        {buttons.map(button => (
          <ActionButtonView
            key={button.id}
            button={button}
            onPress={() => handlePress(button)}
            disabled={sending === button.id}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  button: {
    width: '46%',
    height: 120,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default App;
