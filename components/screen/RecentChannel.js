import React, {Component} from 'react';  
import {View,Text, FlatList, AsyncStorage} from 'react-native';  
import { MaterialIcons } from "@expo/vector-icons";
import ChannelCard from '../layout/ChannelCard';
export default class RecentChannel extends Component{  
    constructor(props) {
		super(props)

		this.state = {
			channel: ''
		}
	}
    render(){  
        AsyncStorage.getItem('channel')
        .then((res) => JSON.parse(res))
        .then((data) => {
            this.setState({ channel: data });
        }).catch((e) => {
            this.setState({ channel: [] });
        })

    const newLocalChannel = this.state.channel;
    return (
        (newLocalChannel == null) ?
            (<View>
                <Text>No recent channel Viewed (-_-).</Text>
            </View>)
            : ((newLocalChannel.length == 0) ?
                (<View>
                    <Text>Loading...</Text>
                </View>)
                :
                (<View>
                    <FlatList
                        renderToHardwareTextureAndroid={true}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={5}
                        showsVerticalScrollIndicator={false}
                        updateCellsBatchingPeriod={100}
                        windowSize={5}
                        numColumns={4}
                        keyExtractor={channel => channel.c_id}
                        data={newLocalChannel}
                        renderItem={channels => {
                            return (
                                <ChannelCard data={channels} nav={this.props.navigation} />
                            );
                        }}
                    />
                </View >)
            )
    );
    }  
}  
RecentChannel.navigationOptions={  
    tabBarIcon:({tintColor, focused})=>(  
        <MaterialIcons  
            name={focused ? 'video-label' : 'video-library'}  
            color={tintColor}  
            size={25}  
        />  
    )  
}  



