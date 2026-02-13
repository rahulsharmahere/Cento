import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export async function authenticateBiometric() {
  try {
    const { available, biometryType } =
      await rnBiometrics.isSensorAvailable();

    console.log('🔐 Biometrics Available:', available, biometryType);

    // ✅ If device has NO security at all
    if (!available) {
      console.log('❌ No biometric sensor / credentials');

      // Still try device credentials (IMPORTANT)
      const result = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate',
        cancelButtonText: 'Cancel',

        // 🔥 CRITICAL FIX → Enables PIN / Pattern / Password fallback
        allowDeviceCredentials: true,
      });

      return result.success;
    }

    // ✅ Normal authentication (Biometric + Fallback)
    const result = await rnBiometrics.simplePrompt({
      promptMessage: 'Authenticate to continue',
      cancelButtonText: 'Cancel',

      // 🔥 THIS enables fallback to device PIN / Pattern / Password
      allowDeviceCredentials: true,
    });

    console.log('✅ Auth Result:', result);

    return result.success;

  } catch (error) {
    console.log('🚨 Biometric Error:', error);

    /*
      ✅ Important Behaviour:

      User cancels → Return false
      Too many attempts → OS handles lockout
      Sensor error → Return false
    */

    return false;
  }
}
