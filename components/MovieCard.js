import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../style/colors";
import { poster_base_uri } from "@env";

const MovieCard = ({ item, movieFunction, screenName }) => (
  <View style={styles.item}>
    <View style={styles.itemImageContainer}>
      <Image
        style={styles.itemImage}
        source={{ uri: poster_base_uri + item.poster_path }}
      />
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
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => movieFunction(item.id)}
        >
          {(() => {
            if (screenName === "Home") {
              return <Text style={styles.buttonText}>Watch Later +</Text>;
            } else if (screenName === "Library") {
              return <Text style={styles.buttonText}>Remove -</Text>;
            }

            return null;
          })()}
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
const styles = StyleSheet.create({
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
  buttonText: {
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default MovieCard;
