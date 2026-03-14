import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useAudioRecorder} from '../hooks/useAudioRecorder';

interface AudioRecorderButtonProps {
  onSend: (filePath: string) => Promise<void>;
  isDarkMode: boolean;
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function AudioRecorderButton({
  onSend,
  isDarkMode,
}: AudioRecorderButtonProps) {
  const {
    state,
    startRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
    stopAndSend,
  } = useAudioRecorder(onSend);

  if (state.status === 'idle') {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.micButton}
          activeOpacity={0.7}
          onPress={startRecording}>
          <Text style={styles.micIcon}>🎤</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (state.status === 'sending') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text
          style={[styles.statusText, {color: isDarkMode ? '#fff' : '#111'}]}>
          Отправка...
        </Text>
      </View>
    );
  }

  const isRecording = state.status === 'recording';

  return (
    <View style={styles.container}>
      <View style={styles.durationRow}>
        <View
          style={[styles.recordingDot, {opacity: isRecording ? 1 : 0.3}]}
        />
        <Text
          style={[
            styles.durationText,
            {color: isDarkMode ? '#fff' : '#111'},
          ]}>
          {formatDuration(state.durationMs)}
        </Text>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.controlButton, {backgroundColor: '#6B7280'}]}
          activeOpacity={0.7}
          onPress={cancelRecording}>
          <Text style={styles.controlButtonText}>Отменить</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            {backgroundColor: '#F59E0B', opacity: isRecording ? 1 : 0.4},
          ]}
          activeOpacity={0.7}
          onPress={pauseRecording}
          disabled={!isRecording}>
          <Text style={styles.controlButtonText}>Остановить</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            {backgroundColor: '#059669', opacity: !isRecording ? 1 : 0.4},
          ]}
          activeOpacity={0.7}
          onPress={resumeRecording}
          disabled={isRecording}>
          <Text style={styles.controlButtonText}>Продолжить</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, {backgroundColor: '#4F46E5'}]}
          activeOpacity={0.7}
          onPress={stopAndSend}>
          <Text style={styles.controlButtonText}>Отправить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 24,
    paddingTop: 16,
  },
  micButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  micIcon: {
    fontSize: 32,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#DC2626',
    marginRight: 8,
  },
  durationText: {
    fontSize: 24,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  statusText: {
    fontSize: 16,
    marginTop: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  controlButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
