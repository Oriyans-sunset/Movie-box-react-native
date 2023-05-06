import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { COLORS } from '../../style/colors';
import { db, auth } from '../../firebase';
import { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";

export default function ProfileScreen({navigation}) {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function fetchUser() {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setUsername(docSnap.data().username);
        setEmail(docSnap.data().email);
      } else {
        console.log("No such document!");
      }
    }
    fetchUser();
  }, []);

  
  
    return (
      <View style={styles.container}>
        <Image
        style={styles.profileImage}
        source={{ uri: 'https://fastly.picsum.photos/id/989/200/300.jpg?hmac=ogky6xHUEi9lZWaqSfoblaQBusCIKbpFT1HQ2h4jZM0' }}
        />

        <Text style={styles.username}>{username}</Text>

        <View style={styles.mainInfoCotainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>
        </View>

      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.pink,
      alignItems: 'center',
      padding: 20,
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 20,
    },
    username: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    infoLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      marginRight: 10,
    },
    infoValue: {
      fontSize: 18,
    },
  });