import * as Haptics from "expo-haptics";

type HapticTone = "selection" | "soft" | "success";

export async function triggerHaptic(tone: HapticTone = "selection") {
  try {
    if (tone === "selection") {
      await Haptics.selectionAsync();
      return;
    }

    if (tone === "success") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Haptics are non-critical.
  }
}
