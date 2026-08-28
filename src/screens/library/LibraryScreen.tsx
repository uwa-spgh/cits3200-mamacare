import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HomeHeader from '../../components/headers/HomeHeader'
import AppSafeView from '../../components/views/AppSafeView'

const LibraryScreen = () => {
  return (
    <AppSafeView>
      <HomeHeader/>
      <Text>LibraryScreen</Text>
    </AppSafeView>
  )
}

export default LibraryScreen

const styles = StyleSheet.create({})