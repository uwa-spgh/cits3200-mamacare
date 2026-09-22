import { StyleSheet, TextInput, TextStyle } from 'react-native'
import React, { FC } from 'react'
import { s, vs, ms } from 'react-native-size-matters'
import { AppColors } from '../../styles/colors'

interface AppTextInputProps {
    value?: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    style?: TextStyle | TextStyle[];
}

const AppTextInput: FC<AppTextInputProps> = ({ value, onChangeText, placeholder, secureTextEntry, keyboardType, style }) => {
  return (
    <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={[styles.input, style]}
    />
  )
}

export default AppTextInput

const styles = StyleSheet.create({

    input:{
        height: vs(45),
        width: "100%",
        borderRadius: s(25),
        borderWidth: s(1),
        borderColor: AppColors.stroke_primary,
        paddingHorizontal: s(20),
        fontSize: ms(16),
        color: AppColors.text_headings,
        backgroundColor: AppColors.white,
        marginBottom: s(10)
    }

})