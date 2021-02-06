import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  Share,
  Dimensions,
  AsyncStorage
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ShareHandlerComponent from "../handler/ShareHandlerComponent";
import ApiHandelComponent from "../handler/ApiHandelComponent";
import SongListLayout from '../layout/SongListLayout';
import Searchbtn from '../layout/Searchbtn';
import Preloader from '../layout/Preloader';

var fromLimit = 0; //kha se start ho

const ChannelViewComponent = props => {

  const toLimit = 21; //per page kitne item
  const limitOrder = "D";

  const channelId = props.navigation.state.params.channelId;

  const [channelInfo, setChannelInfo] = useState([]);
  const [state, setstate] = useState({
    channelSong: [],
    loading: true,
    loaded: false
  })
  const channelUrl = ApiHandelComponent.channelInfo.url + channelId;
  const channelSongUrl =
    ApiHandelComponent.channelSongList.url +
    fromLimit +
    "/" +
    toLimit +
    "/" +
    limitOrder +
    "/" +
    channelId;

  const _loadChannelSong = async () => {
    await fetch(channelSongUrl)
      .then(response => response.json())
      .then(responseJson => {
        setstate({ channelSong: [...state.channelSong, ...responseJson.channelResult] })

      })
      .catch(() => {
      });
  }
  useEffect(() => {

    fetch(channelUrl)
      .then(response => response.json())
      .then(responseJson => {
        setChannelInfo(responseJson);
        setstate({ loading: false })
      })
      .catch(() => {
      });

    // call channel  song
    _loadChannelSong();
  }, []);

  const shareChannelBtnHandler = channelId => {
    const shareUrl = ShareHandlerComponent.channelShare + channelId;
    Share.share({
      message: shareUrl
    });
  };
  const _loadMoreDataHandler = async () => {
    fromLimit += 21;
    await fetch(channelSongUrl)
      .then(response => response.json())
      .then(responseJson => {
        setstate({ channelSong: [...state.channelSong, ...responseJson.channelResult], loading: false })
      })
      .catch(() => {
      });
  }

  if (state.loading) {
    return <Preloader renderToHardwareTextureAndroid={true} data ={state.loading}/>
  } else {

    const AsyncStorageData = (channelDeatils) => {
      var channelData;
      var newChannelId;
      try {
        if (!state.loading) {
          channelData = {
            c_id: channelDeatils[0].c_id,
            c_name: channelDeatils[0].c_name,
            c_img: channelDeatils[0].c_img,
            c_name_id: channelDeatils[0].c_name_id,
          }
          newChannelId = channelData.c_id;
        }
      }
      catch (error) {
      }
      if (newChannelId != '') {
        if (!state.loaded) {
          setstate({ loaded: true })

          AsyncStorage.getItem('channel')
            .then((res) => JSON.parse(res))
            .then((oldChannel) => {

              oldChannel.find((element) => {
                if (element.c_id != newChannelId) {

                  oldChannel.push(channelData);
                  oldChannel.unshift(channelData);
                  AsyncStorage.setItem('channel', JSON.stringify(oldChannel));
                }
              });
            }).catch(() => {
              let oldChannel = [];
              oldChannel.push(channelData);
              AsyncStorage.setItem('channel', JSON.stringify(oldChannel));
            });
        }
      } else {
        setstate({ loaded: false })
        AsyncStorageData(channelDeatils);
      }

    }

    return (
      <View style={styles.container}>

        {AsyncStorageData(channelInfo)}

        <FlatList
          renderToHardwareTextureAndroid={true}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          showsVerticalScrollIndicator={false}
          updateCellsBatchingPeriod={100}
          windowSize={5}
          keyExtractor={data => data.c_id}
          data={channelInfo}
          renderItem={data => {
            return (
              <ImageBackground
                source={{ uri: data.item.c_img }}
                style={{ width: "100%", height: 150 }}
                blurRadius={1.5}
              >
                <View style={styles.imageViewContainer}>
                  <Image
                    resizeMode="contain"
                    source={{ uri: data.item.c_img }}
                    style={styles.imageView}
                    key={data.item.c_id}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.text}>{data.item.c_name}</Text>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <TouchableOpacity style={styles.ButtonStyle}>
                        <Text style={styles.ButtonText}>Play All</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.ButtonStyle}
                        onPress={() =>
                          shareChannelBtnHandler(data.item.c_name_id)
                        }
                      >
                        <Text style={styles.ButtonText}>Share</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            );
          }}
        />
        <FlatList
          renderToHardwareTextureAndroid={true}
          removeClippedSubviews={true}
          maxToRenderPerBatch={20}
          showsVerticalScrollIndicator={false}
          updateCellsBatchingPeriod={100}
          windowSize={21}
          onEndReached={() => _loadMoreDataHandler()}
          style={styles.songList}
          keyExtractor={song => song.id}
          data={state.channelSong}
          renderItem={song => {
            return (
              <SongListLayout data={song} screenProps={props.screenProps} />
            );
          }}
        />
      </View>
    );
  }
};
ChannelViewComponent.navigationOptions = ({ navigation }) => {
  const { navigate } = navigation;
  return {
    headerTitle: () => (
      <Text numberOfLines={1} style={{ width: Dimensions.get('screen').width - 120, fontSize: 15 }}>{navigation.state.params.channelName}</Text>
    ),
    headerRight: () => <Searchbtn navigate={navigate} />

  }
}

export default ChannelViewComponent;
const styles = StyleSheet.create({
  container: {},
  imageViewContainer: {
    padding: 5,
    flex: 1,
    flexDirection: "row"
  },
  imageView: {
    width: 110,
    height: 110,
    borderRadius: 100
  },
  textContainer: {
    padding: 20
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
  },
  songList: {
    marginTop: 2
  }
});


