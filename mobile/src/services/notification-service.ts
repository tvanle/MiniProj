import { Platform, Alert } from 'react-native';

// Only import expo-notifications on native platforms
let Notifications: typeof import('expo-notifications') | null = null;
let Device: typeof import('expo-device') | null = null;

if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');
  Device = require('expo-device');

  Notifications!.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export const registerForPushNotifications = async (): Promise<string | null> => {
  if (Platform.OS === 'web') return null;
  if (!Notifications || !Device) return null;

  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('showtime', {
      name: 'Showtime Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
};

// Schedule a reminder 30 minutes before showtime
// On web: shows an Alert instead of push notification
export const scheduleShowtimeReminder = async (
  movieTitle: string,
  theaterName: string,
  showDateTime: string,
  ticketId: string
): Promise<string | null> => {
  const showDate = new Date(showDateTime);
  const timeStr = showDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  if (Platform.OS === 'web') {
    // Web: countdown toast handles the UI, no alert needed
    return null;
  }

  if (!Notifications) return null;

  const reminderDate = new Date(showDate.getTime() - 30 * 60 * 1000);
  if (reminderDate <= new Date()) return null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '🎬 Sắp đến giờ chiếu!',
      body: `${movieTitle} tại ${theaterName} sẽ chiếu lúc ${timeStr}. Hãy chuẩn bị nhé!`,
      data: { ticketId },
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
    },
  });

  return id;
};
