import * as React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
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
  arrayUnion,
} from "firebase/firestore";
import MovieCardList from "../../components/MovieCardList";
import { poster_base_uri, TMDB_API_KEY, movie_search_base_uri } from "@env";
import { useIsFocused } from "@react-navigation/native";
import { db, auth } from "../../firebase";
import MovieCard from "../../components/MovieCard";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Ionicons from "react-native-vector-icons/Ionicons";

import LottieView from "lottie-react-native";
import * as Haptics from "expo-haptics";

export default function WatchedMovieScreen({ navigation }) {
  const [movieList, setMovieList] = useState([]);

  const userDocumentReference = doc(db, "users", auth.currentUser.uid);
  const [isLoading, setIsLoading] = useState(true);

  //useEffect start
  useEffect(() => {
    function fetchUserMovielist() {
      onSnapshot(userDocumentReference, (doc) => {
        fetchData(doc.data().watchlist);
      });
    }

    fetchUserMovielist();

    async function fetchData(movieIDs) {
      try {
        const results = await Promise.all(
          movieIDs.map((id) =>
            fetch(movie_search_base_uri + id + "?api_key=" + TMDB_API_KEY).then(
              (response) => response.json()
            )
          )
        );
        setMovieList(results);
      } catch (error) {
        console.error(error);
        alert("Error Timeout. Please try again later.");
      }
      setIsLoading(false); // set isLoading to false after data is retrieved
    }
  }, [useIsFocused]);
  //useEffect end

  const removeMovieFromWatchlist = async (movie_id) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (userDocumentReference) {
      await updateDoc(userDocumentReference, {
        ["watchlist"]: arrayRemove(movie_id.toString()),
      })
        .then(() => {
          Toast.show({
            type: "success", // Can be 'success', 'error', 'info', or 'default'
            position: "top", // Can be 'top', 'bottom', 'center'
            text2: "Removed from Watchlist!",
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
      movieListName={"watched"}
      screenName={"Library"}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.mainTopContainer}>
        <View style={styles.titleAndDropdownContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Watched Movies</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        <MovieCardList data={movieList} renderItem={renderItem} />
      </View>
    </View>
  );
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
  filterDropdownContainer: {
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
  },
});
