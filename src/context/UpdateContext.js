import React, { createContext, useContext, useEffect, useState } from "react";
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

  // 🔥 AUTO CHECK ON APP START
  useEffect(() => {
    checkForUpdate();
  }, []);

  // Show modal when update is found
  useEffect(() => {
    if (updateAvailable) {
      setVisible(true);
    }
  }, [updateAvailable]);

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
        checkForUpdate,
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
