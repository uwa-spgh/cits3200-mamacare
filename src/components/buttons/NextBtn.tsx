import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AppText from '../texts/AppText'
import { AppColors } from '../../styles/colors'
import {s, vs} from 'react-native-size-matters'
import { useTranslation } from 'react-i18next'

interface NextBtnProps {
    onPress: () => void,
    iconSize: number,
    color: string
}

const NextBtn: FC<NextBtnProps> = ({onPress, iconSize, color}) => {

  const {t} = useTranslation();
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <AppText style={[styles.btnText, {color:color}]}>{t("buttonArrows.next")}</AppText>
      <Ionicons name="chevron-forward" size={iconSize} color={color} />
    </TouchableOpacity>
  )
}

export default NextBtn

const styles = StyleSheet.create({
    container: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: AppColors.button_primary_accent,
            paddingHorizontal: s(20),
            paddingVertical: vs(8),
            borderRadius: s(8)
        },
    
        btnText: {
            color: AppColors.text_secondary,
            paddingRight: s(5)
        }
})