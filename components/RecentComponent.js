import React, {Component} from 'react';  
import {View, StyleSheet, Button} from 'react-native';  
import {createAppContainer} from 'react-navigation';   
  
import RecentComponentNavigater from './menu/RecentComponentNavigater';  
const AppIndex = createAppContainer(RecentComponentNavigater)  
  
 class RecentComponent extends Component{  
	rconst
	render(){  
		return(  
			<View style={styles.container} >				
				<AppIndex/>  
			</View>  
		)  
	}  
}  

const styles = StyleSheet.create({
	container:{
		flex:1,
		marginTop:23,
	}
})

export default RecentComponent;