import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import {Ionicons} from "@expo/vector-icons"
import AppText from '../texts/AppText'
import { AppColors } from '../../styles/colors'
import {s, vs} from 'react-native-size-matters'
import { useTranslation } from 'react-i18next'

interface BackBtnProps {
    onPress: () => void,
    iconSize: number,
    color: string
}

const BackBtn: FC<BackBtnProps> = ({onPress, iconSize, color}) => {

  const {t} = useTranslation();
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <Ionicons name="chevron-back" size={iconSize} color={color} />
      <AppText style={[styles.btnText, {color: color}]}>{t("buttonArrows.back")}</AppText>
    </TouchableOpacity>
  )
}

export default BackBtn

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    btnText: {
        color: AppColors.text_secondary,
        paddingRight: s(5)
    }
})