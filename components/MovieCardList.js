import React from 'react';
import { View, Text, FlatList } from 'react-native';

const MovieCardList = ({ data, renderItem }) => {
  return (
    <>
      <FlatList 
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </>
  );
};

export default MovieCardList;
