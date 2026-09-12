// Danger Signs: general signs to watch for throughout pregnancy, plus
// signs to watch for at each of the 8 ANC contacts. Reachable from the 
// Education Library screen
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import { ContactDangerSignsAccordion } from "../../components/health-education/contact-danger-signs-accordion";
import { DangerSignCard } from "../../components/health-education/danger-sign-card";
import { EmergencyCallButton } from "../../components/health-education/emergency-call-button";
import { SeekHelpBanner } from "../../components/health-education/seek-help-banner";
import {
  ANC_CONTACT_DANGER_SIGNS,
  DANGER_SIGNS,
  GENERAL_DANGER_SIGN_IDS,
} from "../../constants/danger-signs";
import { colors } from "../../constants/health-education";
import HomeHeader from "../../components/headers/HomeHeader";

export default function DangerSignsScreen() {
  const [expandedContact, setExpandedContact] = useState<number | null>(1);
  const { t } = useTranslation();

  const translateSign = (id: string) => ({
    ...DANGER_SIGNS[id],
    title: t(`dangerSignsScreen.signs.${id}`),
  });

  const generalSigns = GENERAL_DANGER_SIGN_IDS.map(translateSign);
  const contacts = ANC_CONTACT_DANGER_SIGNS.map((contact) => ({
    ...contact,
    label: t(`dangerSignsScreen.contacts.${contact.contact}`),
  }));

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <HomeHeader/>
      <ScrollView contentContainerStyle={styles.content}>
        <SeekHelpBanner />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("dangerSignsScreen.generalTitle")}</Text>
          <Text style={styles.sectionSubtitle}>
            {t("dangerSignsScreen.generalSubtitle")}
          </Text>
          <View style={styles.list}>
            {generalSigns.map((sign) => (
              <DangerSignCard key={sign.id} sign={sign} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("dangerSignsScreen.byContactTitle")}</Text>
          <Text style={styles.sectionSubtitle}>
            {t("dangerSignsScreen.byContactSubtitle")}
          </Text>
          <View style={styles.list}>
            {contacts.map((contact) => (
              <ContactDangerSignsAccordion
                key={contact.contact}
                contact={contact}
                signs={contact.signIds.map(translateSign)}
                expanded={expandedContact === contact.contact}
                onToggle={() =>
                  setExpandedContact((current) =>
                    current === contact.contact ? null : contact.contact,
                  )
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <EmergencyCallButton
        label={t("dangerSignsScreen.callEmergency")}
        onPress={() => {
          // TODO: add local emergency number or prompt user to call emergency services
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: -6,
  },
  list: {
    gap: 10,
  },
});
