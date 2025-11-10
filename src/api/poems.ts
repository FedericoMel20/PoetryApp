import Constants from "expo-constants";

const getBaseURL = (): string => {
  const LOCAL_PC_IP = "192.168.100.14"; 
  const PORT = 3000;

  try {
    const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
    if (debuggerHost) {
      const host = debuggerHost.split(":")[0];
      console.log("📡 Expo detected host:", host);
      return `http://${host}:${PORT}`;
    }
  } catch (err) {
    console.warn("Expo Constants not available, using fallback IP");
  }

  // Fallback: PC IP for physical device, 10.0.2.2 for Android emulator
  if (Constants.platform?.android) {
    console.log(" Running on Android, using PC IP (physical device likely)");
    return `http://${LOCAL_PC_IP}:${PORT}`;
  }

  console.log(" Using fallback localhost");
  return `http://localhost:${PORT}`;
};

const BASE_URL = getBaseURL();

export const getPoems = async () => {
  try {
    console.log("Fetching from:", `${BASE_URL}/api/poems`);
    const response = await fetch(`${BASE_URL}/api/poems`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching poems:", error);
    return [];
  }
};

export default getBaseURL;
