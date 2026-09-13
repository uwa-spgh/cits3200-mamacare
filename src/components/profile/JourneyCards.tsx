import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React, { FC, ReactNode } from "react";
import { AppColors } from '../../styles/colors';
import {s, vs} from 'react-native-size-matters'
import { AppFonts } from '../../styles/fonts';
import { Ionicons } from '@expo/vector-icons';

interface JourneyCardsProp {
  title: string;
  icon: ReactNode;
  onPress: () => void;
  backgroundColor: string,
  style?: ViewStyle | ViewStyle[];
}
const JourneyCards: FC<JourneyCardsProp> = ({title, icon, onPress, backgroundColor, style}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, style]}>

        <View style={{
            backgroundColor: backgroundColor,
            height: s(30),
            width: s(30),
            borderRadius: s(15),
            justifyContent: 'center',
            alignItems: 'center'
        }}>{icon}</View>
      <Text style={{
        fontFamily: AppFonts.TextRegular,
        color: AppColors.text_headings,
        width: '70%',
        fontSize: s(13)
      }}>{title}</Text>
      <Ionicons name="chevron-forward" size={s(15)} color={AppColors.text_secondary} />
    </TouchableOpacity>
  )
}

export default JourneyCards

const styles = StyleSheet.create({
    container: {
        paddingVertical: vs(10),
        paddingHorizontal: s(15),
        flex: 1,
        flexDirection: 'row',
        borderColor: AppColors.stroke_primary,
        backgroundColor: AppColors.white,
        borderWidth: s(1),
        borderRadius: s(10),
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: s(10)

    }
})