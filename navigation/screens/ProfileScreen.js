import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { COLORS } from "../../style/colors";
import { useState, useEffect } from "react";

import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db, auth, storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";

import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import * as ImagePicker from "expo-image-picker";
import { random_profile_image_uri } from "@env";

export default function ProfileScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profilePictureURI, setProfilePictureURI] = useState(
    random_profile_image_uri
  );

  const [isLoading, setIsLoading] = useState(true);

  const userDocumentReference = doc(db, "users", auth.currentUser.uid);

  useEffect(() => {
    async function fetchUser() {
      const docSnap = await getDoc(userDocumentReference);
      if (docSnap.exists()) {
        if (docSnap.data().photo === "" || docSnap.data().photo === null) {
          setProfilePictureURI(random_profile_image_uri);
        } else {
          setProfilePictureURI(docSnap.data().photo);
        }
        setEmail(docSnap.data().email);
        setUsername(docSnap.data().username);
        console.log("Document data:", docSnap.data().photo);
      } else {
        setProfilePictureURI(random_profile_image_uri);
        console.log("No such document!");
      }

      setIsLoading(false);
    }
    fetchUser();

    // Request permission to access the photo library
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Cannot access library!",
          "Please change permission settings to proceede further."
        );
      }
    })();
  }, []);

  const handleEditProfilePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];

      //convert image to blob
      const blobImg = await imageToBlob(selectedImage.uri);
      uploadImageToFirebaseStorage(blobImg);
    }
  };

  async function imageToBlob(imageUri) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", imageUri, true);
      xhr.send(null);
    });
  }

  function uploadImageToFirebaseStorage(blobImg) {
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "profile-pictures/" + auth.currentUser.uid);

    //set metadata
    const metadata = {
      contenType: "image/jpeg",
    };
    const uploadTask = uploadBytesResumable(storageRef, blobImg, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProfilePictureURI(downloadURL);
          updateDoc(userDocumentReference, {
            photo: downloadURL,
          });

          console.log("File available at", downloadURL);
        });
      }
    );
  }

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.pink,
        }}
      >
        <LottieView
          source={require("../../style/loading-animation.json")}
          autoPlay
          loop
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.settingsIconContainer}>
          <TouchableOpacity onPress={() => {}}>
            <View>
              <Ionicons
                name="cog"
                size={32}
                color={COLORS.darkBlue}
                style={{ alignSelf: "flex-end" }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={{
                uri: profilePictureURI,
              }}
              loadingIndicatorSource={require("../../style/loading-animation.json")}
            />

            <TouchableOpacity onPress={() => handleEditProfilePicture()}>
              <Ionicons
                name="create-outline"
                size={24}
                color="black"
                style={{ alignSelf: "flex-end" }}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.username}>{username}</Text>

          <View style={styles.mainInfoCotainer}>
            <View style={styles.emailInfoContainer}>
              <Text style={styles.emailInfoLabel}>Email:</Text>
              <Text style={styles.emailInfoValue}>{email}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pink,
    alignItems: "center",
    padding: 10,
  },
  profileImageContainer: {
    marginLeft: 25,
    flexDirection: "row",
  },
  settingsIconContainer: {
    marginTop: 27,
    width: "100%",
  },
  userInfo: {
    width: "100%",
    marginTop: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  username: {
    color: COLORS.darkBlue,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emailInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  emailInfoLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  emailInfoValue: {
    color: COLORS.darkBlue,
    fontSize: 18,
  },
});
