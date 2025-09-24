export default {
  expo: {
    name: "DieselControl",
    slug: "diesel-control-app",
    version: "1.0.0",
    platforms: ["android", "ios"],
    android: {
      package: "com.jaclb.dieselcontrol",
      versionCode: 1,
      permissions: [
        "CAMERA",
        "INTERNET",
        "WRITE_EXTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE"
      ]
    },
    extra: {
      apiUrl: "https://362cba55bc74.ngrok-free.app/api"
    }
  }
};
