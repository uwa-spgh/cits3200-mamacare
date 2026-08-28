import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppSafeView from '../../components/views/AppSafeView'
import HomeHeader from '../../components/headers/HomeHeader'

const MedsScreen = () => {
  return (
    <AppSafeView>
      <HomeHeader/>
      <Text>MedsScreen</Text>
    </AppSafeView>
  )
}

export default MedsScreen

const styles = StyleSheet.create({})