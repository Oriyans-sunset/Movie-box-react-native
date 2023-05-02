import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen({navigation}) {
  
    return (
      <View style={styles.container}>
        <View style={styles.apiContainer}>
  
          <Text style={styles.title}>Press this button below!</Text> 
  
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={ {color: "#80e0ed", fontSize: 25, } }>Press!</Text>
          </TouchableOpacity>
  
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 30,
      justifyContent: 'center',
      alignItems: 'center'
    },
    apiContainer: {
      backgroundColor: "#80e0ed",
      padding: 20,
      borderRadius: 20
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold'
    },
    button: {
      alignSelf: 'center',
      backgroundColor: "black",
      marginTop: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20
    },
  });