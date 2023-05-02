import * as React from 'react';
import {FlatList, Text, View, StyleSheet} from 'react-native';
import {auth} from "../../firebase"
import {useState, useEffect} from 'react'
import { COLORS } from '../../style/colors';

export default function HomeScreen() {
    const [data, setData] = useState();

    useEffect(() => {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
       
      fetch('https://imdb-api.com/en/API/MostPopularMovies/k_334h0qn0', requestOptions)
        .then(response => response.json())
        .then(json => setData(json.items))
        .catch(error => console.log('error', error));
      }, []);
    

    return (
    <View style={styles.container}>
        <View style={styles.writtenContainer}>
            <Text style={styles.written}>
                This is the About Screen of {auth.currentUser?.email}
            </Text>
        </View>
        <View style={styles.listView}>
            <FlatList 
            data={data}
            renderItem={({item}) => <View style={styles.item}><Text style={styles.textItem}>{item.title}</Text></View> }
            keyExtractor={item => item.id.toString()}
            />
        </View>

    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 30,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.pink
    },
    writtenContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: "black",
        width: "100%",
        borderRadius: 10
    },
    written: {
        color: "white",
        fontSize: 25,
        marginTop: 10,
        padding: 5,
        fontWeight: 'bold'
    },
    listView: {
        padding: 2,
        marginTop: 5
    },
    item: {
        backgroundColor: COLORS.darkBlue,
        margin: 5,
        padding: 7,
        borderRadius: 5
    },
    textItem: {
        color: "white",
        fontSize: 20,
        fontWeight: "500"
    }
  });