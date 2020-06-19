import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Share,
  TouchableHighlight,ToastAndroid
  
} from "react-native";
import ViewPager from "@react-native-community/viewpager";
import ApiHandelComponent from "../handler/ApiHandelComponent";
import ShareHandlerComponent from "../handler/ShareHandlerComponent";
import Preloader from './Preloader';

const SliderViewPager = (props) => {
  const fromLimit = 0; //kha se start ho
  const toLimit = 7; //per page kitne item

  const [slideSong, setSlideSong] = useState();
  const [loading, setLoading] = useState(true);
  const URL = ApiHandelComponent.songRand.url + fromLimit + "/" + toLimit;

  useEffect(() => {
    fetch(URL)
      .then(response => response.json())
      .then(responseJson => {
        setSlideSong(responseJson.songResult);
        setLoading(false);
      })
      .catch(() => {
      });
  }, []);
  const songClickHandler = song => {
    props.screenProps(song, null, 'play');
    ToastAndroid.show('Playing',ToastAndroid.SHORT);
  };
  const shareBtnHandler = songId => {
    const shareUrl = ShareHandlerComponent.songShare.url + songId;
    Share.share({
      message: shareUrl
    });
  };


  if (loading) {
    return <Preloader data={loading}/>
  } else {
    return (
      <View style={{ flex: 1 }}>
        <ViewPager style={styles.viewPager} initialPage={0} transitionStyle='curl' pageMargin={-10}>
          {slideSong.map(song => {
            return (
              <TouchableHighlight
                key={song.id}
                style={styles.page}
                onPress={() => songClickHandler(song)}
                onLongPress={() => shareBtnHandler(song.songId)}
              >
                <View>
                  <ImageBackground
                    resizeMode="cover"
                    source={{ uri: song.songImg }}
                    style={styles.sliderBackground}
                  />
                  <ImageBackground
                    blurRadius={8}
                    source={{ uri: song.songImg }}
                    style={styles.sliderPoint}
                  >
                    <Text numberOfLines={1} style={styles.songNameText}>
                      {song.songName}
                    </Text>
                  </ImageBackground>

                </View>
              </TouchableHighlight>
            );
          })}
        </ViewPager>
      </View>
    );
  }
};
export default SliderViewPager;
const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
    flexDirection: "row",
    height: 220
  },
  page: {
    paddingEnd: 5,
    marginRight: 12,
  },
  sliderBackground: {
    height: 200,
    width: null
  },
  sliderPoint: {
    width: null,
    height: 20,
    bottom: 20
  },
  songNameText: {
    textAlign: "center",
    paddingBottom: 3,
    paddingLeft: 10,
    paddingRight: 5,
    color: "#fff"
  }
});
