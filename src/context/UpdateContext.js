import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import useAppUpdater from "../hooks/useAppUpdater";
import { version as appVersion } from "../../package.json";
import { cancelDownload } from "../utils/downloadAndInstallApk";

const UpdateContext = createContext(null);

export const UpdateProvider = ({ children }) => {
  const {
    isChecking,
    updateAvailable,
    latestVersion,
    checkForUpdate,
    onUpdateNow,
    progress,
  } = useAppUpdater(appVersion);

  const [visible, setVisible] = useState(false);

  // 🔥 AUTO CHECK ON APP START (silent)
  useEffect(() => {
    checkForUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show modal when update is found
  useEffect(() => {
    if (updateAvailable) {
      setVisible(true);
    }
  }, [updateAvailable]);

  // 👇 MANUAL CHECK (Settings button uses this)
  const manualCheckForUpdate = async () => {
  const result = await checkForUpdate();

  if (result === true) {
    // 🔥 Force-open modal on manual check
    setVisible(true);
    return;
  }

  if (result === false) {
    Alert.alert(
      "You’re up to date ✅",
      `You are already using the latest version (${appVersion})`
    );
  }

  if (result === null) {
    Alert.alert(
      "Update check failed",
      "Please try again later."
    );
  }
};

  const onLater = () => setVisible(false);

  const onCancel = () => {
    cancelDownload();
    setVisible(false);
  };

  return (
    <UpdateContext.Provider
      value={{
        isChecking,
        latestVersion,
        visible,
        onUpdateNow,
        progress,

        // expose BOTH
        checkForUpdate,        // internal / auto
        manualCheckForUpdate, // Settings button

        onLater,
        onCancel,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
};

export const useUpdate = () => {
  const ctx = useContext(UpdateContext);
  if (!ctx) {
    throw new Error("useUpdate must be used inside UpdateProvider");
  }
  return ctx;
};
