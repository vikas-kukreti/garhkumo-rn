import {createAppContainer} from 'react-navigation';  

import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import RecentArtist from '../screen/RecentArtist';
import RecentChannel from '../screen/RecentChannel';
import RecentSong from '../screen/RecentSong';
const RecentComponentNavigater = createMaterialTopTabNavigator(  
    {  
        Song: RecentSong,  
        Channel: RecentChannel,  
        Artist: RecentArtist,  
    },  
    {  
        tabBarOptions: {  
            activeTintColor: 'white',  
            showIcon: true,  
            showLabel:false,  
            style: { 
                padding:0,
                margin:0, 
                backgroundColor:'#0098EE'  
            }  
        },  
    }  
)  
export default createAppContainer(RecentComponentNavigater); 