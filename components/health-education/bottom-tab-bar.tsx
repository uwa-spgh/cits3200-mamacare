import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/health-education";

export type BottomTabId = "home" | "planner" | "meds" | "library";

interface Tab {
  id: BottomTabId;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const TABS: Tab[] = [
  { id: "home", label: "Home", icon: "home-outline" },
  { id: "planner", label: "Planner", icon: "calendar-outline" },
  { id: "meds", label: "Meds", icon: "medkit-outline" },
  { id: "library", label: "Library", icon: "book-outline" },
];

interface BottomTabBarProps {
  activeTab: BottomTabId;
  onSelectTab?: (tab: BottomTabId) => void;
}

export function BottomTabBar({ activeTab, onSelectTab }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onSelectTab?.(tab.id)}
            style={[styles.tab, isActive && styles.tabActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Ionicons
              name={tab.icon}
              size={18}
              color={isActive ? colors.surface : colors.tabInactive}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  tab: {
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.tabInactive,
  },
  labelActive: {
    color: colors.surface,
  },
});
