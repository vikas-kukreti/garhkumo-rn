import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView} from "react-native";
import SongView from "./homeComponent/SongView";
import ArtistView from "./homeComponent/ArtistView";
import ChannelView from "./homeComponent/ChannelView";
import HomeIcon from "./layout/HomeIcon";
import SliderViewPager from "./layout/SliderViewPager";

export default class HomeComponent extends Component {
  render() {

    return (
      <ScrollView>
        <View style={styles.container}>
          <SliderViewPager screenProps={this.props.screenProps}/>
          <View style={styles.optionView}>
            <HomeIcon
              name="users"
              props={this.props}
              Title="Artist"
              menuName="allArtist"
            />
            <HomeIcon
              name="th-large"
              props={this.props}
              Title="Channel"
              menuName="allChannel"
            />
            <HomeIcon
              name="music"
              props={this.props}
              Title="Songs"
              menuName="allSong"
            />
            <HomeIcon
              name="heart"
              props={this.props}
              Title="Recently"
              menuName="recentScreen"
            />
           
          </View>
          <SongView Title="New Song" table="song" props={this.props} />
          <ArtistView Title="Our Artist" table="artist" props={this.props} />
          <ChannelView Title="Channel" table="channel" props={this.props} />
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageViewOption: {},
  imageView: {
    width: null,
    height: 180
  },
  optionView: {
    backgroundColor: "#efefef",
    justifyContent: "space-around",
    flexDirection: "row"
  }
});
