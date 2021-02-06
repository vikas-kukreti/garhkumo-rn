import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SongCard from "./layout/SongCard";
import ApiHandelComponent from "./handler/ApiHandelComponent";
import Searchbtn from "./layout/Searchbtn";
import Preloader from "./layout/Preloader";

var fromLimiData = 0;//kha se start ho
const SongComponent = props => {
  const toLimit = 51; //ik bari me kitna data 
  const limitOrder = "D"; //D=DESC, A=ASC

  const [SongState, setSongState] = useState({
    songList: [],
    loading: true,
  })
  const songUrl = ApiHandelComponent.songList.url + fromLimiData + "/" + toLimit + "/" + limitOrder;

  useEffect(() => {
    loadData()
  }, []);

  const loadData = async () => {
    await fetch(songUrl)
      .then(response => response.json())
      .then(responseJson => {
        setSongState({ songList: [...SongState.songList, ...responseJson], loading: false })
      })
      .catch(() => {
      });
  }
  const loadMoreData = () => {
    fromLimiData += 51;

    fetch(songUrl)
      .then(response => response.json())
      .then(responseJson => {
        setSongState({ songList: [...SongState.songList, ...responseJson] });
      })
      .catch(() => {
      });
  }


  if (SongState.loading) {
    return <Preloader data={SongState.loading} />
  } else {
    return (
      <View style={styles.container} renderToHardwareTextureAndroid={true}>
        <FlatList
          onEndReached={() => loadMoreData()}
          renderToHardwareTextureAndroid={true}
          removeClippedSubviews={true}
          maxToRenderPerBatch={20}
          showsVerticalScrollIndicator={false}
          updateCellsBatchingPeriod={100}
          windowSize={20}
          style={styles.songList}
          numColumns={3}
          keyExtractor={song => song.id + Math.floor(Math.random() * (20 - 0 + 1)) + 0}
          data={SongState.songList}
          renderItem={song => {
            return (
              <SongCard data={song} nav={props.navigation} screenProps={props.screenProps} />
            );
          }}
        />
      </View>
    );
  }
};
SongComponent.navigationOptions = ({ navigation }) => {
  const { navigate } = navigation;
  return {
    headerTitle: "New Songs",
    headerRight: () => <Searchbtn navigate={navigate} />

  }
}
export default SongComponent;

const styles = StyleSheet.create({
  container: {},
  cradContainer: {
    padding: 2
  },
  songList: {
    marginTop: 2
  }
});
