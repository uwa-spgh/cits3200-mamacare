import { StyleSheet, Text, TextProps, TextStyle, View } from 'react-native'
import React, { FC } from 'react'
import {s,} from 'react-native-size-matters'
import { AppColors } from '../../styles/colors';

interface AppTextProp extends TextProps {
    children: React.ReactNode;
    style?: TextStyle | TextStyle[];
    variation?: 'bold' | 'medium';
}

const AppText :FC<AppTextProp> = ({ children, style, variation = "medium", ...rest }) => {
    return (
        <View>
            <Text
                {...rest}
                style={[styles[variation], style]}>{children}</Text>
        </View>
    )
}

export default AppText

const styles = StyleSheet.create({
    bold: {
        fontSize: s(20),
        color: AppColors.black,
    },

    medium: {
        fontSize: s(16),
        color: AppColors.lightGray
    }
})