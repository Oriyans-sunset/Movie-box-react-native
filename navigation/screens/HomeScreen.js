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
import { auth } from "../../firebase";
import { useState, useEffect } from "react";
import { COLORS } from "../../style/colors";
import Autocomplete from "react-native-autocomplete-input";

export default function HomeScreen() {
  const [data, setData] = useState();
  const API_KEY = "8b3351fbc55348927d563617f46f2114";
  const movie_base_uri = "https://api.themoviedb.org/3/movie/popular?api_key=";
  const poster_base_uri = "https://image.tmdb.org/t/p/original/";

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(movie_base_uri + API_KEY, requestOptions)
      .then((response) => response.json())
      .then((json) => setData(json.results))
      .catch((error) => console.log("error", error));
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemImageContainer}>
        <Image
          style={styles.itemImage}
          source={{ uri: poster_base_uri + item.poster_path }}
        ></Image>
      </View>

      <View style={styles.itemInfo}>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.itemTitle}>
          {item.title}
        </Text>
        <Text style={styles.itemYear}>{item.release_date}</Text>
        <View style={styles.itemInfoOverviewAndButton}>
          <Text
            numberOfLines={4}
            ellipsizeMode="tail"
            style={styles.itemDescription}
          >
            {item.overview}
          </Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Watch Later +</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  //autocomplete
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleQueryChange = async (text) => {
    setQuery(text);

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=8b3351fbc55348927d563617f46f2114&language=en-US&query=${text}`
    );
    const data = await response.json();

    setSuggestions(data.results.map((movie) => movie.title));
  };

  const handleSuggestionSelect = (item) => {
    setQuery(item);
    setSuggestions([]); // Clear suggestions after selection
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
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionSelect(item)}
                >
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

      <View style={styles.listView}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Popular This Week</Text>
        </View>

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.pink,
  },
  textInputContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchContainer: {
    zIndex: 10, // Increased zIndex for higher priority
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "black",
    width: "100%",
  },
  autocompleteContainer: {
    position: "absolute",
    top: 50, // Adjust this value for better alignment
    width: "99.5%",
    padding: 10,
    zIndex: 10, // Higher zIndex to ensure it overlaps other elements
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
  item: {
    backgroundColor: COLORS.darkBlue,
    marginBottom: 15,
    padding: 10,
    borderRadius: 15,
    flexDirection: "row",
    width: "100%",
  },
  itemImageContainer: {
    flexGrow: 1,
  },
  itemImage: {
    borderRadius: 15,
    borderColor: "white",
    borderWidth: 2,
    width: 120,
    height: 180,
  },
  itemInfo: {
    backgroundColor: COLORS.lightGreen,
    padding: 5,
    borderRadius: 15,
    width: "60%",
  },
  itemTitle: {
    color: COLORS.black,
    fontSize: 20,
    fontWeight: "500",
  },
  itemYear: {
    color: COLORS.grey,
  },
  itemInfoOverviewAndButton: {
    flex: 1,
    justifyContent: "space-between",
    marginTop: 5,
  },
  itemDescription: {},
  addButton: {
    marginTop: 4,
    backgroundColor: COLORS.darkBlue,
    width: "100%",
    alignItems: "center",
    padding: 5,
    borderRadius: 15,
  },
  addButtonText: {
    fontWeight: "bold",
    color: COLORS.white,
  },
});
