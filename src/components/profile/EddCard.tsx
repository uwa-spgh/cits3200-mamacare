import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {s, vs} from "react-native-size-matters"
import { AppColors } from '../../styles/colors'
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AppText from '../texts/AppText';
import { AppFonts } from '../../styles/fonts';
import ProgressBar from './ProgressBar';

const EddCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="calendar-alt" size={22} color={AppColors.button_primary_accent}/>
        <View style={styles.rightHeader}>
            <AppText style={styles.edd}>Estimated Due Date</AppText>
            <AppText style={styles.date}>Oct 12, 2026</AppText>
        </View>
      </View>
      <View style={styles.separator}></View>
      <View style={styles.textProgress}>
        <AppText style={{
            fontFamily: AppFonts.Heading1Bold,
            fontSize: s(12),
            color: AppColors.text_headings
        }}>Progress</AppText>
        <AppText style={{
            fontFamily: AppFonts.Heading1Bold,
            fontSize: s(12),
            color: AppColors.button_primary_accent,
            marginBottom: s(5)
        }}>60%</AppText>
      </View>
      <ProgressBar progress={0.6}/>
      <AppText style={{
        fontFamily: AppFonts.TextLight,
            fontSize: s(12),
            color: AppColors.text_secondary,
            marginTop: s(10)
      }}>41 days to go. You're doing great!</AppText>
    </View>
  )
}

export default EddCard

const styles = StyleSheet.create({
    container: {
        width: '80%',
        justifyContent: "center",
        alignItems: 'center',
        borderColor: AppColors.stroke_primary,
        borderWidth: s(1),
        borderRadius: s(10),
        padding: s(20),
        backgroundColor: AppColors.white

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    rightHeader:{

        flex: 1,
        marginLeft: s(10)

    },

    edd: {

        fontFamily: AppFonts.Heading2Medium,
        color: AppColors.text_secondary,
        fontSize: s(12)

    },

    date: {
        fontFamily: AppFonts.Heading2Medium,
        color: AppColors.text_headings,
        fontSize: s(15)
    },
    separator:{
        height: s(1),
        width: '100%',
        backgroundColor: AppColors.stroke_primary,
        marginVertical: vs(8)
    },
    textProgress: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})