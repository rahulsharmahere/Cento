import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function UpdateModal({
  visible,
  progress,
  onUpdate,
  onLater,
  onCancel,
  downloading,
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          {!downloading ? (
            <>
              <Text style={styles.title}>Update Available</Text>
              <Text style={styles.text}>
                A new version is available.
              </Text>

              <View style={styles.row}>
                <TouchableOpacity onPress={onLater}>
                  <Text style={styles.link}>Later</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onUpdate}>
                  <Text style={styles.update}>Update Now</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>
                Downloading… {progress}%
              </Text>
              <TouchableOpacity onPress={onCancel}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  title: { fontSize: 18, fontWeight: '600' },
  text: { marginVertical: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  update: { color: '#007aff', fontWeight: '600' },
  link: { color: '#666' },
  cancel: { color: 'red', marginTop: 12 },
});
