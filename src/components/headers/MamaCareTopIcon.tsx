import { StyleSheet, View } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { AppColors } from '../../styles/colors'
import AppText from '../texts/AppText'
import {s} from 'react-native-size-matters' 
import { AppFonts } from '../../styles/fonts'

const MamaCareTopIcon = () => {
  return (
     <View style={styles.textContainer}>
        <MaterialCommunityIcons
          name="mother-nurse"
          size={s(20)}
          color={AppColors.button_primary_accent}
        />
        <AppText style={styles.appName} variation="bold">
          MamaCare
        </AppText>
      </View>
  )
}

export default MamaCareTopIcon

const styles = StyleSheet.create({
    textContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },

  appName: {
    color: AppColors.button_primary_accent,
    fontFamily: AppFonts.Heading1Bold
  },
})