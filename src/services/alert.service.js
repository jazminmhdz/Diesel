const { Expo } = require('expo-server-sdk');
const ExpoSdk = new Expo();

async function sendPush(tokens, title, body) {
  const messages = tokens.filter(Expo.isExpoPushToken).map(token=>({ to: token, sound:'default', title, body }));
  const chunks = ExpoSdk.chunkPushNotifications(messages);
  for (let chunk of chunks) { await ExpoSdk.sendPushNotificationsAsync(chunk); }
}

module.exports = { sendPush };
