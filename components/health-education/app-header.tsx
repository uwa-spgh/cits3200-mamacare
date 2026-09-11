import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/health-education";

interface AppHeaderProps {
  title: string;
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
  onSettingsPress?: () => void;
}

export function AppHeader({
  title,
  onProfilePress,
  onNotificationsPress,
  onSettingsPress,
}: AppHeaderProps) {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleBack}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={22} color={colors.primary} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actions}>
        <Pressable
          onPress={onProfilePress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Profile"
        >
          <Ionicons name="person-circle-outline" size={22} color={colors.textPrimary} />
        </Pressable>
        <Pressable
          onPress={onNotificationsPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
        </Pressable>
        <Pressable
          onPress={onSettingsPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Ionicons name="settings-outline" size={22} color={colors.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.primary,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
});
