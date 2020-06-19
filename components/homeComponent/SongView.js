import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import SongCard from "../layout/SongCard";
import ApiHandelComponent from "../handler/ApiHandelComponent";
import Preloader from '../layout/Preloader';



const SongView = props => {

  const fromLimit = 0; //kha se start ho
  const toLimit = 15; //per page kitne item
  const limitOrder = "D"; //D=DESC, A=ASC

  const titleName = props.Title;

  const [songList, setSongList] = useState();
  const [loading, setLoading] = useState(true);
  const URL =
    ApiHandelComponent.songList.url +
    fromLimit +
    "/" +
    toLimit +
    "/" +
    limitOrder;

  useEffect(() => {
    fetch(URL)
      .then(response => response.json())
      .then(responseJson => {
        setSongList(responseJson);
        setLoading(false);
      })
      .catch(() => {
        3
      });
  }, []);

  const allClickHandler = () => {
    const { navigate } = props.props.navigation;
    navigate("allSong");
  };

  return (
    <View>
      <Preloader data={loading} />
      <View style={styles.OptionList}>
        <Text style={styles.OptionListView}>{titleName}</Text>
        <TouchableOpacity onPress={() => allClickHandler()}>
          <Text style={styles.OptionListAll}>All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{ padding: 3 }}
        showsHorizontalScrollIndicator={false}
        renderToHardwareTextureAndroid={true}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={100}
        windowSize={5}
        horizontal={true}
        keyExtractor={song => song.id}
        data={songList}
        renderItem={song => {
          return (
            <SongCard data={song} nav={props.props.navigation} screenProps={props.props.screenProps} />
          );
        }}
      />
    </View>
  );
};
export default SongView;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
  },
  OptionList: {
    flexDirection: "row",
    marginTop: 5,
    padding: 7,
    backgroundColor: "#fff"
  },
  OptionListView: {
    fontWeight: "bold",
    padding: 5,
    flex: 6
  },
  OptionListAll: {
    fontWeight: "bold",
    padding: 5,
    flex: 1,
    textAlign: "right"
  }
});
