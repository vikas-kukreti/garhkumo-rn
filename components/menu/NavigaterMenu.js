import * as React from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from "react-navigation-stack";
import HomeComponent from "../HomeComponent";
import ArtistViewComponent from "../view-component/ArtistViewComponent";
import ChannelViewComponent from "../view-component/ChannelViewComponent";
import SongViewComponent from '../view-component/SongViewComponent';
import SongComponent from "../SongComponent";
import SearchComponent from '../SearchComponent';
import Searchbtn from '../layout/Searchbtn';
import RecentComponent from "../RecentComponent";
import AtristComponent from "../AtristComponent";
import ChannelComponent from "../ChannelComponent";
import VideoComponent from '../VideoComponent';
import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";
import CustomSidebarMenu from './CustomSidebarMenu';
import { Dimensions } from "react-native";

global.currentScreenIndex = 0;

const NavigaterMenu = createStackNavigator(
  {
    Search: {
      screen: SearchComponent,
    },
    HomeMenu: {
      screen: HomeComponent,
      navigationOptions: ({ navigation }) => {
        const { navigate } = navigation;
        return {
          headerLeft: ()=>(
            <Icon
              style={{ paddingLeft: 10 }}
              onPress={() => navigation.openDrawer()}
              name="md-menu"
              size={30}
            />
          ),
          headerTitle: 'Garhkumo',
          headerRight: () => <Searchbtn navigate={navigate} />


        }
      },
    },
    ArtistMenu: {
      screen: ArtistViewComponent,
    },
    ChannelMenu: {
      screen: ChannelViewComponent,      
    },
    allSong: {
      screen: SongComponent,
    },
    allArtist: {
      screen: AtristComponent,
    },
    allChannel: {
      screen: ChannelComponent,
    },
    recentScreen: {
      screen: RecentComponent,
      navigationOptions: () => {
        return {
          headerShown: false
        }
      },
    },
    songInfo: {
      screen: SongViewComponent,
    },
    playVideoMenu: {
      screen: VideoComponent,
      navigationOptions: ({ navigation }) => {
        return {
          headerShown: false

        }
      },
    },
  },
  {
    initialRouteName: "HomeMenu",
    backBehavior: "initialRoute"
  }
);

const AppDrawerNavigator = createDrawerNavigator(
  {

    HomeDrawer: {
      screen: NavigaterMenu,
    }
  },
  {
    contentComponent: CustomSidebarMenu,
    drawerWidth: Dimensions.get('window').width - 130,
  }
);
export default createAppContainer(AppDrawerNavigator);

