import {useEffect, useState} from 'react';
import { KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import {TextInput, Text, View, StyleSheet} from 'react-native';
import { auth, db } from '../../firebase';
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { COLORS } from '../../style/colors';

export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user){
                navigation.navigate('Main');
            }
        })

        return unsubscribe;
    }, []);

    const handleSignup = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user =  userCredential.user;
            console.log(user.email);

            //add to firestore db
            setDoc(doc(db, "users", user.uid), {
                userId: user.uid,
                email: user.email,
                username: email.split("@")[0],
                photo: null
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        })
        .catch(error => alert(error.message));
    }

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            user = userCredential.user;
            //console.log(user)
            navigation.navigate("Main");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <View style={styles.titleContainer}>
            <Text style={styles.title1}>Hi!</Text>
            <Text style={styles.title2}>Welcome to App</Text>
        </View>
        <View style={styles.inputFieldContainer}>
            <TextInput style={styles.input} 
            placeholder='Email' value={email} onChangeText={text => setEmail(text)}>
            </TextInput>
            <TextInput style={styles.input} 
            placeholder='Password' value={password} onChangeText={text => setPassword(text)} secureTextEntry>
            </TextInput>
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton} onPress={handleSignup}>
                <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.pink,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleContainer: {
        marginBottom: 40,
        width: '80%',
        padding: 5,
        borderRadius: 5
    },
    title1: {
        color: "#00203FFF",
        fontSize: 40,
        paddingHorizontal: 10,
        fontWeight: '600'
    },
    title2: {
        color: "#00203FFF",
        fontSize: 35,
        paddingHorizontal: 10,
        fontWeight: '600'
    },
    inputFieldContainer: {
        paddingHorizontal: 15,
        width: '80%'
    },
    input: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 10,
        marginBottom: 5,
        borderColor: 'black',
        borderRadius: 5,
        borderWidth: 2
    },
    buttonContainer: {
        marginTop: 10,
        width: '80%',
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "60%",
        marginBottom: 7,
        backgroundColor: COLORS.darkBlue,
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    loginButtonText: {
        color: COLORS.lightGreen,
        fontWeight: 'bold',
        fontSize: 20
    },
    registerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "60%",
        backgroundColor: COLORS.lightGreen,
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    registerButtonText: {
        color: COLORS.darkBlue,
        fontWeight: 'bold',
        fontSize: 20
    },
  });