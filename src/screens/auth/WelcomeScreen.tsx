import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppSafeView from '../../components/views/AppSafeView'
import AppText from '../../components/texts/AppText'

const WelcomeScreen = () => {
  return (
    <>
    <AppSafeView style={styles.container}>
        <AppText>Welcome to MamaCare!</AppText>
    </AppSafeView>
    </>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})