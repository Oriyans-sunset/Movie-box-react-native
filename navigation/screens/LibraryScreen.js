import * as React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../../style/colors";
import DropDownPicker from "react-native-dropdown-picker";
import { useState, useEffect } from "react";
import {
  doc,
  docSnap,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import MovieCardList from "../../components/MovieCardList";
import { poster_base_uri, TMDB_API_KEY, movie_search_base_uri } from "@env";
import { useIsFocused } from "@react-navigation/native";
import { db, auth } from "../../firebase";
import MovieCard from "../../components/MovieCard";
import { Toast } from "react-native-toast-message/lib/src/Toast";

import LottieView from "lottie-react-native";

export default function LibraryScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Watched", value: "Watched" },
    { label: "Watchlist", value: "Watchlist" },
  ]);

  const [watchlist, setWatchList] = useState([]);

  const userDocumentReference = doc(db, "users", auth.currentUser.uid);

  //useEffect start
  useEffect(() => {
    console.log("use effect called");

    function fetchUserWatchlist() {
      onSnapshot(userDocumentReference, (doc) => {
        fetchData(doc.data().watchlist);
      });
    }

    fetchUserWatchlist();

    async function fetchData(movieIDs) {
      try {
        const results = await Promise.all(
          movieIDs.map((id) =>
            fetch(movie_search_base_uri + id + "?api_key=" + TMDB_API_KEY).then(
              (response) => response.json()
            )
          )
        );
        setWatchList(results);
      } catch (error) {
        console.error(error);
        alert("Error Timeout. Please try again later.");
      }
      setIsLoading(false); // set isLoading to false after data is retrieved
    }
  }, [useIsFocused]);
  //useEffect end

  const removeMovieFromWatchlist = async (movie_id) => {
    if (userDocumentReference) {
      await updateDoc(userDocumentReference, {
        watchlist: arrayRemove(movie_id.toString()),
      })
        .then(() => {
          Toast.show({
            type: "success", // Can be 'success', 'error', 'info', or 'default'
            position: "top", // Can be 'top', 'bottom', 'center'
            text2: "Removed from wacthlist!",
            visibilityTime: 1000, // Duration for which the toast is visible (in milliseconds)
          });
        })
        .catch((error) => {
          console.error("Error removing item from array:", error);
        });
    } else {
      console.log("No such document!");
    }
  };

  const renderItem = ({ item }) => (
    <MovieCard
      item={item}
      movieFunction={removeMovieFromWatchlist}
      screenName={"Library"}
    />
  );

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
        <View style={styles.mainTopContainer}>
          <View style={styles.titleAndDropdownContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Library</Text>
            </View>

            <View style={styles.filterDropdownContainer}>
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style={{
                  backgroundColor: COLORS.lightGreen,
                }}
                textStyle={{
                  fontSize: 15,
                  fontWeight: 400,
                }}
                containerStyle={{ width: 150 }}
              />
            </View>
          </View>
        </View>

        <View style={{ marginTop: 30 }}>
          <MovieCardList data={watchlist} renderItem={renderItem} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.pink,
    paddingBottom: 100,
  },
  mainTopContainer: {
    width: "100%",
    backgroundColor: "black",
    justifyContent: "center",
    height: "20%",
    zIndex: 1,
  },
  titleAndDropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  titleContainer: {
    justifyContent: "center",
  },
  titleText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
  filterDropdownContainer: {},
});
