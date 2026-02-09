import React from "react";
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useUpdate } from "../context/UpdateContext";
import { Bar as ProgressBar } from "react-native-progress";

export default function UpdateModal() {
  const {
    visible,
    isChecking,
    latestVersion,
    onUpdateNow,
    onLater,
    onCancel,
    progress,
  } = useUpdate();

  if (!visible) return null;

  const isDownloading = progress > 0 && progress < 100;

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Update Available 🎉</Text>

          {isChecking ? (
            <>
              <ActivityIndicator size="large" />
              <Text style={styles.text}>Checking for updates…</Text>
            </>
          ) : (
            <>
              <Text style={styles.text}>
                New version available: {latestVersion}
              </Text>

              {isDownloading ? (
                <>
                  <Text style={styles.text}>
                    Downloading: {Math.round(progress)}%
                  </Text>
                  <ProgressBar progress={progress / 100} width={200} />
                  <TouchableOpacity
                    style={[styles.button, styles.cancelBtn]}
                    onPress={onCancel}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.row}>
                  <TouchableOpacity
                    style={[styles.button, styles.updateBtn]}
                    onPress={onUpdateNow}
                  >
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.laterBtn]}
                    onPress={onLater}
                  >
                    <Text style={styles.buttonText}>Later</Text>
                  </TouchableOpacity>
                </View>
              )}
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
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "85%",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 6,
  },
  row: {
    flexDirection: "row",
    marginTop: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  updateBtn: { backgroundColor: "#007AFF" },
  laterBtn: { backgroundColor: "#999" },
  cancelBtn: { backgroundColor: "#d00", marginTop: 12 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
