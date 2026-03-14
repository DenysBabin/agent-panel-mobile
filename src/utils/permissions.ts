import {Platform, PermissionsAndroid, Alert} from 'react-native';

export async function requestMicrophonePermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Разрешение на микрофон',
        message:
          'Приложению нужен доступ к микрофону для записи голосовых сообщений.',
        buttonPositive: 'Разрешить',
        buttonNegative: 'Отмена',
      },
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Ошибка', 'Доступ к микрофону не предоставлен.');
      return false;
    }
    return true;
  }
  // iOS: permission is requested automatically by AVAudioSession when recording starts
  return true;
}
