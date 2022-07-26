import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';



const HomeScreen = () => {
  return (
    <View style={styles.container}>
    <Text 
    style={{
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold'
    }}>
      Heello
  </Text> 
  </View>
);
  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    root: {
      flexDirection: 'row',
      width: '100%',
      padding: 10,
    },
   
  });
export default HomeScreen