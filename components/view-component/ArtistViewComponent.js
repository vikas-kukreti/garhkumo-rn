import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ImageBackground,
  FlatList,
  Share,
  Dimensions,
  AsyncStorage,
  ToastAndroid,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ApiHandelComponent from "../handler/ApiHandelComponent";
import ShareHandlerComponent from "../handler/ShareHandlerComponent";
import SongListLayout from "../layout/SongListLayout";
import Searchbtn from "../layout/Searchbtn";
import Preloader from "../layout/Preloader";
import { useKeepAwake } from 'expo-keep-awake';

var fromLimit = 0; //kha se start ho
const ArtistViewComponent = (props) => {

  useKeepAwake()
  const navigation = props.navigation;
  const toLimit = 20; //per page kitne item
  const limitOrder = "D"; //D=DESC, A=ASC

  const artistId = navigation.state.params.artistID;
  const [artistInfo, setartistInfo] = useState([])
  const [loading, setLoading] = useState(true);
  const [loaded, setloaded] = useState(false);
  const [arSong, setArSong] = useState({
    songs: []
  })
  const [renderItemOk, setrenderItemOk] = useState(false);

  // artist info url
  const artistUrl = ApiHandelComponent.artistInfo.url + artistId;
  //artist song list
  const artistSongUrl = ApiHandelComponent.artistSongList.url + fromLimit + "/" + toLimit + "/" + limitOrder + "/" + artistId;


  const loadArtistSong = () => {
    fetch(artistSongUrl)
      .then(response => response.json())
      .then(responseJson => {
        setArSong({ songs: responseJson.artistResult });
        console.log('artist data mil gya h  ');
        setLoading(false);
        setrenderItemOk(true);
      })
      .catch(() => {
        console.log('artist data not ');

      });
  }
  useEffect(() => {
    fetch(artistUrl)
      .then(response => response.json())
      .then(responseJson => {
        setartistInfo(responseJson);
        loadArtistSong();
      }).catch(() => {
      });

  }, []);

  const playAllSongHandler = () => {
    const arSongList = arSong.songs;
    try {
      if (arSongList.length > 0) {
        props.screenProps(null, arSongList, 'play');
      }
    } catch (error) {
      ToastAndroid.show('Opps!', ToastAndroid.SHORT);
    }
  };
  const shareArtistBtnHandler = (artistId, name) => {
    const shareUrl =
      ShareHandlerComponent.artistShare.url + artistId + "/" + name;
    Share.share({
      message: shareUrl
    });
  };

  const _loadMoreDataHandler = () => {
    setrenderItemOk(false);
    fromLimit += 20;
    fetch(artistSongUrl)
      .then(response => response.json())
      .then(responseJson => {
        setArSong({ songs: [...arSong.songs, ...responseJson.artistResult] })
        setrenderItemOk(true);
      })
      .catch(() => {
      });
  }
  if (loading) {
    return <Preloader data={loading} />
  } else {
    const AsyncStorageData = async (artisDeatils) => {
      var artistData;
      var newArtisId;
      try {
        if (!loading) {
          artistData = {
            ar_id: artisDeatils[0].ar_id,
            ar_name: artisDeatils[0].ar_name,
            ar_img: artisDeatils[0].ar_img,
          }
          newArtisId = artistData.ar_id;
        }
      } catch (error) {
      }
      if (newArtisId != '') {
        if (!loaded) {
          setloaded(true);

          await AsyncStorage.getItem('artist')
            .then((res) => JSON.parse(res))
            .then((oldArtist) => {

              oldArtist.find((element) => {
                if (element.ar_id != newArtisId) {
                  oldArtist.push(artistData);
                  oldArtist.unshift(artistData);
                  AsyncStorage.setItem('artist', JSON.stringify(oldArtist));
                }
              });
            }).catch(() => {
              let oldArtist = [];
              oldArtist.push(artistData);
              AsyncStorage.setItem('artist', JSON.stringify(oldArtist));
            });
        }
      } else {
        setloaded(false);
        AsyncStorageData(artisDeatils)

      }
    }
    // AsyncStorageData(artistInfo);
    return (
      <View style={styles.container}>
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={20}
          showsVerticalScrollIndicator={false}
          updateCellsBatchingPeriod={100}
          windowSize={21}
          data={artistInfo}
          keyExtractor={(item) => item.ar_id}
          renderItem={
            (artistInfo) => {
            return (
              <ImageBackground source={{
                uri: ApiHandelComponent.artistImage.url + artistInfo.item.ar_img
              }} style={{ width: "100%", height: 130 }} blurRadius={0.4}>
                <View style={styles.imageViewContainer}>
                  <Image resizeMode="contain" source={{
                    uri: ApiHandelComponent.artistImage.url + artistInfo.item.ar_img
                  }} style={styles.imageView} />
                  <View style={styles.textContainer}>
                    <Text style={styles.text}>{artistInfo.item.ar_name}</Text>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <TouchableOpacity style={styles.ButtonStyle} onPress={() => playAllSongHandler()}>
                        <Text style={styles.ButtonText}>Play All</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.ButtonStyle} onPress={() => shareArtistBtnHandler(artistInfo.item.ar_id, artistInfo.item.ar_name)}>
                        <Text style={styles.ButtonText}>Share</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ImageBackground>);

          }
          }
        />
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={20}
          showsVerticalScrollIndicator={false}
          updateCellsBatchingPeriod={100}
          windowSize={21}
          onEndReached={() => _loadMoreDataHandler()}
          style={styles.songListContainer}
          keyExtractor={(item, index) => index.toString() + Math.floor(Math.random() * (20 - 0 + 1)) + 0}
          data={arSong.songs}
          renderItem={artistSong => {
            if (renderItemOk) {
              return (
                <SongListLayout data={artistSong} screenProps={props.screenProps} />
              );
            }

          }}
        />
        <View style={{ height: 30 }}></View>
      </View>
    )
  }
}

ArtistViewComponent.navigationOptions = ({ navigation }) => {
  const { navigate } = navigation;
  return {
    headerTitle: () => (
      <Text numberOfLines={1} style={{ width: Dimensions.get('screen').width - 120, fontSize: 15 }}>{navigation.state.params.artistName}</Text>
    ),
    headerRight: () => <Searchbtn navigate={navigate} />

  }

}
export default ArtistViewComponent
const styles = StyleSheet.create({
  container: {},

  imageViewContainer: {
    padding: 5,
    flex: 1,
    flexDirection: "row"
  },
  imageView: {
    width: 120,
    height: 120,
    borderRadius: 50
  },
  text: {
    color: "#fff",
    fontWeight: "bold"
  },
  ButtonStyle: {
    width: 80,
    padding: 5,
    backgroundColor: "#00BCD4",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#fff"
  },
  ButtonText: {
    textAlign: "center"
  }
});