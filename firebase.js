// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
import * as firebase from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCng5rvTLoPYXiBZjWEZ1qv8hVvWhgkNR8",
  authDomain: "fir-auth-aaee3.firebaseapp.com",
  projectId: "fir-auth-aaee3",
  storageBucket: "fir-auth-aaee3.appspot.com",
  messagingSenderId: "625216604584",
  appId: "1:625216604584:web:c4d52a8c82e9266387b59d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db }