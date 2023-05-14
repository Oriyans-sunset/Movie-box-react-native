import * as React from "react";
import {
  TextInput,
  FlatList,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useEffect } from "react";
import { COLORS } from "../../style/colors";
import MovieCard from "../../components/MovieCard";
import Autocomplete from "react-native-autocomplete-input";
import { docSnap, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../../firebase";

import { Toast } from "react-native-toast-message/lib/src/Toast";
import * as Haptics from "expo-haptics";

import MovieCardList from "../../components/MovieCardList";
import {
  TMDB_API_KEY,
  movies_popular_base_uri,
  search_bar_base_uri,
} from "@env";

export default function HomeScreen() {
  const [data, setData] = useState();

  const addMovieToWatchlist = async (movie_id) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const userDocumentReference = doc(db, "users", auth.currentUser.uid);
    if (userDocumentReference) {
      await updateDoc(userDocumentReference, {
        watchlist: arrayUnion(movie_id.toString()),
      });
      Toast.show({
        type: "success", // Can be 'success', 'error', 'info', or 'default'
        position: "top", // Can be 'top', 'bottom', 'center'
        text2: "Added to wacthlist!",
        visibilityTime: 1000, // Duration for which the toast is visible (in milliseconds)
      });
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(movies_popular_base_uri + TMDB_API_KEY, requestOptions)
      .then((response) => response.json())
      .then((json) => setData(json.results))
      .catch((error) => console.log("error", error));
  }, []);

  const renderItem = ({ item }) => (
    <MovieCard
      item={item}
      movieFunction={addMovieToWatchlist}
      screenName={"Home"}
    />
  );

  //autocomplete
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleQueryChange = async (text) => {
    setQuery(text);

    const response = await fetch(
      search_bar_base_uri + TMDB_API_KEY + `&query=${text}`
    );
    const data = await response.json();

    setSuggestions(data.results.map((movie) => movie.title));
  };

  const renderTextInput = (props) => {
    return (
      <View style={styles.textInputContainer}>
        <TextInput
          {...props}
          style={{ fontSize: 17, color: COLORS.black }}
          placeholder="Search Movies"
          placeholderTextColor={COLORS.grey}
        />
      </View>
    );
  };
  //autocomplete

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.autocompleteContainer}>
          <Autocomplete
            data={suggestions}
            value={query}
            onChangeText={handleQueryChange}
            placeholder="Search..."
            renderTextInput={renderTextInput}
            inputContainerStyle={{ borderColor: COLORS.black }}
            flatListProps={{
              renderItem: ({ item }) => (
                <TouchableOpacity style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              ),
              keyExtractor: (item, index) => index.toString(),
              style: styles.suggestionList,
              contentContainerStyle: { flexGrow: 1 },
            }}
          />
        </View>
      </View>

      <View>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Popular This Week</Text>
        </View>

        <MovieCardList data={data} renderItem={renderItem} />
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
  textInputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  searchContainer: {
    zIndex: 1,
    width: "100%",
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "20%",
  },
  autocompleteContainer: {
    marginTop: 10,
    backgroundColor: COLORS.black,
    width: "99.5%",
    paddingLeft: 10,
    paddingRight: 10,
  },
  suggestionList: {
    borderRadius: 15,
  },
  suggestionItem: {
    padding: 10,
    backgroundColor: COLORS.white,
    borderColor: COLORS.black,
    borderTopWidth: 2,
  },
  suggestionText: {},
  titleView: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
  },
});
