import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { COLORS } from '../../style/colors';
import { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import {db, auth} from '../../firebase';

export default function ProfileScreen({navigation}) {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function fetchUser() {
      const userDocumentReference = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(userDocumentReference);

      if (docSnap.exists()) {

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
        <View style={styles.userInfo}>
          <Image
          style={styles.profileImage}
          source={{ uri: 'https://fastly.picsum.photos/id/989/200/300.jpg?hmac=ogky6xHUEi9lZWaqSfoblaQBusCIKbpFT1HQ2h4jZM0' }}
          />

          <Text style={styles.username}>{username}</Text>

          <View style={styles.mainInfoCotainer}>
            <View style={styles.usernameAndEmailInfoContainer}>
              <Text style={styles.emailInfoLabel}>Email:</Text>
              <Text style={styles.emailInfoValue}>{email}</Text>
            </View>
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
    userInfo: {
      marginTop: 30,
      backgroundColor: "grey",
      justifyContent: "center",
      alignItems: 'center'
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
    usernameAndEmailInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    emailInfoLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      marginRight: 10,
    },
    emailInfoValue: {
      fontSize: 18,
    },
  });