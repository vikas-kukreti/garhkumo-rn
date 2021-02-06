import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ArtistCard from "../layout/ArtistCard";
import ApiHandelComponent from "../handler/ApiHandelComponent";
import Preloader from '../layout/Preloader';
import { useKeepAwake } from 'expo-keep-awake';
const ArtistView = props => {
  useKeepAwake();


  const fromLimit = 0; //kha se start ho
  const toLimit = 10; //per page kitne item

  const TitleName = props.Title;
  const [artistList, setArtistList] = useState();
  const [loading, setLoading] = useState(true);
  const URL = ApiHandelComponent.artistRand.url + fromLimit + "/" + toLimit;
  useEffect(() => {
    fetch(URL)
      .then(response => response.json())
      .then(responseJson => {
        setArtistList(responseJson.artistResult);
        setLoading(false);
      })
      .catch(() => {
      });
  }, []);

  const allClickHandler = () => {
    props.props.navigation.navigate("allArtist");
  };


  return (
    <View renderToHardwareTextureAndroid={true}>
      <Preloader data={loading} />

      <View style={styles.OptionList}>
        <Text style={styles.OptionListView}>{TitleName}</Text>
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
        keyExtractor={artist => artist.ar_id}
        data={artistList}
        renderItem={artist => {
          return (
            <ArtistCard data={artist.item} nav={props.props.navigation} />
          );
        }}
      />
    </View>
  );
};
export default ArtistView;
const styles = StyleSheet.create({
  scrollView: {
    overflow: "hidden"
  },
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
