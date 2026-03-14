import {useState, useRef, useCallback, useEffect} from 'react';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import {Alert, Platform} from 'react-native';
import {requestMicrophonePermission} from '../utils/permissions';

export type RecordingStatus = 'idle' | 'recording' | 'paused' | 'sending';

export interface RecordingState {
  status: RecordingStatus;
  durationMs: number;
}

export interface UseAudioRecorderResult {
  state: RecordingState;
  startRecording: () => Promise<void>;
  pauseRecording: () => Promise<void>;
  resumeRecording: () => Promise<void>;
  cancelRecording: () => Promise<void>;
  stopAndSend: () => Promise<void>;
}

export function useAudioRecorder(
  onSend: (filePath: string) => Promise<void>,
): UseAudioRecorderResult {
  const recorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const [state, setState] = useState<RecordingState>({
    status: 'idle',
    durationMs: 0,
  });
  const filePathRef = useRef<string>('');

  useEffect(() => {
    return () => {
      recorderPlayer.removeRecordBackListener();
      recorderPlayer.stopRecorder().catch(() => {});
    };
  }, [recorderPlayer]);

  const startRecording = useCallback(async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      return;
    }

    try {
      const fileName = `recording_${Date.now()}.m4a`;
      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
        AVSampleRateKeyIOS: 22050,
        AVNumberOfChannelsKeyIOS: 1,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.medium,
        AVEncoderBitRateKeyIOS: 32000,
        ...(Platform.OS === 'android' && {
          AudioSamplingRateAndroid: 22050,
          AudioChannelsAndroid: 1,
          AudioEncodingBitRateAndroid: 32000,
        }),
      };
      const uri = await recorderPlayer.startRecorder(fileName, audioSet);
      filePathRef.current = uri;

      recorderPlayer.addRecordBackListener(e => {
        setState({status: 'recording', durationMs: e.currentPosition});
      });
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось начать запись. Проверьте доступ к микрофону.');
      setState({status: 'idle', durationMs: 0});
    }
  }, [recorderPlayer]);

  const pauseRecording = useCallback(async () => {
    try {
      await recorderPlayer.pauseRecorder();
      setState(prev => ({
        status: 'paused',
        durationMs: prev.durationMs,
      }));
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось поставить на паузу.');
    }
  }, [recorderPlayer]);

  const resumeRecording = useCallback(async () => {
    try {
      await recorderPlayer.resumeRecorder();
      setState(prev => ({
        status: 'recording',
        durationMs: prev.durationMs,
      }));
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось возобновить запись.');
    }
  }, [recorderPlayer]);

  const cancelRecording = useCallback(async () => {
    recorderPlayer.removeRecordBackListener();
    await recorderPlayer.stopRecorder().catch(() => {});
    filePathRef.current = '';
    setState({status: 'idle', durationMs: 0});
  }, [recorderPlayer]);

  const stopAndSend = useCallback(async () => {
    recorderPlayer.removeRecordBackListener();
    const resultPath = await recorderPlayer.stopRecorder();
    const filePath = resultPath || filePathRef.current;
    setState({status: 'sending', durationMs: 0});

    try {
      await onSend(filePath);
    } catch {
      // error handling is done in onSend
    } finally {
      filePathRef.current = '';
      setState({status: 'idle', durationMs: 0});
    }
  }, [recorderPlayer, onSend]);

  return {
    state,
    startRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
    stopAndSend,
  };
}
