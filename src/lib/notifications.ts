import { isRunningInExpoGo } from "expo";
import { Platform } from "react-native";

type NotificationsModule = typeof import("expo-notifications");
type PermissionSnapshot = {
  granted?: boolean;
  status?: string;
  ios?: {
    status?: number;
  };
};

const expoGoAndroidNotificationsMessage =
  "Expo Go on Android does not support the native notification registration used by expo-notifications. Use a development build to test workout reminders.";

let notificationsModulePromise: Promise<NotificationsModule | null> | null = null;
let didConfigureNotificationHandler = false;

export function areNotificationsSupported() {
  return Platform.OS !== "web" && !(Platform.OS === "android" && isRunningInExpoGo());
}

export function getNotificationsUnsupportedReason() {
  if (Platform.OS === "web") {
    return "Workout reminders are not available on web.";
  }

  if (Platform.OS === "android" && isRunningInExpoGo()) {
    return expoGoAndroidNotificationsMessage;
  }

  return null;
}

async function getNotificationsModule() {
  if (!areNotificationsSupported()) {
    return null;
  }

  if (!notificationsModulePromise) {
    notificationsModulePromise = import("expo-notifications").then((Notifications) => {
      if (!didConfigureNotificationHandler) {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true
          })
        });
        didConfigureNotificationHandler = true;
      }

      return Notifications;
    });
  }

  return notificationsModulePromise;
}

export async function ensureNotificationPermissions() {
  const Notifications = await getNotificationsModule();

  if (!Notifications) {
    return false;
  }

  const existing = await Notifications.getPermissionsAsync();
  const existingPermission = existing as PermissionSnapshot;

  if (
    existingPermission.granted ||
    existingPermission.status === "granted" ||
    existingPermission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  const requestedPermission = requested as PermissionSnapshot;

  return Boolean(requestedPermission.granted || requestedPermission.status === "granted");
}

export async function scheduleDailyWorkoutReminder() {
  const Notifications = await getNotificationsModule();

  if (!Notifications) {
    return false;
  }

  const allowed = await ensureNotificationPermissions();

  if (!allowed) {
    return false;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Lumina Fit",
      body: "Your premium session is ready. Step in and keep the streak alive."
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 7,
      minute: 0
    }
  });

  return true;
}

export async function clearWorkoutReminders() {
  const Notifications = await getNotificationsModule();

  if (!Notifications) {
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();
}
