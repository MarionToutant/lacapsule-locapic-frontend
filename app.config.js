const dotenv = require("dotenv");
dotenv.config();

export default {
    expo: {
      name: "locapic",
      slug: "locapic",
      platforms: [
        "ios",
        "android",
        "web"
      ],
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      updates: {
        fallbackToCacheTimeout: 0
      },
      assetBundlePatterns: [
        "**/*"
      ],
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.toutenm.locapic",
        buildNumber: "1.0.0"
      },
      android: {
        package: "com.toutenm.locapic",
        versionCode: 1,
        config: {
          googleMaps: {
            apiKey: process.env.REACT_NATIVE_API_KEY
          }
        }
      }
    }
}