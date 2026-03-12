import React, {useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

interface ActionButton {
  id: string;
  label: string;
  color: string;
}

const buttons: ActionButton[] = [
  {id: 'btn1', label: 'Button 1', color: '#4F46E5'},
  {id: 'btn2', label: 'Button 2', color: '#059669'},
  {id: 'btn3', label: 'Button 3', color: '#DC2626'},
];

function ActionButtonView({
  button,
  onPress,
}: {
  button: ActionButton;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: button.color}]}
      activeOpacity={0.7}
      onPress={onPress}>
      <Text style={styles.buttonText}>{button.label}</Text>
    </TouchableOpacity>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const handlePress = (button: ActionButton) => {
    Alert.alert('Agent Panel', `Нажата: ${button.label}`);
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
