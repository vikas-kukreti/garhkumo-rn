import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ArtistCard from "./layout/ArtistCard";
import ApiHandelComponent from "./handler/ApiHandelComponent";
import Searchbtn from './layout/Searchbtn';
import Preloader from './layout/Preloader';

var fromLimit = 0; //kha se start ho

const AtristComponent = props => {

  const toLimit = 40; //per page kitne item 40
  const limitOrder = "D"; //D=DESC, A=ASC
  const [artistList, setArtistList] = useState({
    list: [],
    loading: true
  })

  const songUrl =
    ApiHandelComponent.arlistList.url +
    fromLimit +
    "/" +
    toLimit +
    "/" +
    limitOrder;

  useEffect(() => {
    fetch(songUrl)
      .then(response => response.json())
      .then(responseJson => {
        setArtistList({ list: [...artistList.list, ...responseJson], loading: false });
      })
      .catch(() => {
      });
  }, []);
  const _handelLoadMoreData = async () => {
    fromLimit += 40;
    await fetch(songUrl)
      .then(response => response.json())
      .then(responseJson => {
        setArtistList({ list: [...artistList.list, ...responseJson] });
      })
      .catch(() => {
      });
  }

  return (
    <View renderToHardwareTextureAndroid={true}>
      <Preloader data={artistList.loading} />
      <FlatList
        onEndReached={() => _handelLoadMoreData()}
        renderToHardwareTextureAndroid={true}
        removeClippedSubviews={true}
        maxToRenderPerBatch={20}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={100}
        windowSize={20}
        onEndReachedThreshold={2}
        scrollEventThrottle= {50}
        style={styles.songList}
        numColumns={4}
        keyExtractor={(item, index) => index.toString()+ Math.floor(Math.random() * (20 - 0 + 1)) + 0}
        data={artistList.list}
        renderItem={artist => {
          return (
            <ArtistCard data={artist.item} nav={props.navigation} />
          );
        }}
      />
    </View>
  );
};
AtristComponent.navigationOptions = ({ navigation }) => {
  const { navigate } = navigation;
  return {
    headerTitle: 'Our Artist',
    headerRight: () => <Searchbtn navigate={navigate} />

  }
}

export default AtristComponent;
const styles = StyleSheet.create({
  container: {},
  songList: {
    marginTop: 2
  }
});
