import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions, MapView } from 'expo';

var site = 'https://stark-bastion-71532.herokuapp.com/'

class PickupScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
      title: 'PickUp'
    //   headerRight: <Button title='Messages' onPress={() => {navigation.state.params.onRightPress()}} />
    });

    constructor(props) {
      super(props);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = { 
        users: [],
        dataSource: ds.cloneWithRows([]),
        location: {
          latitude: 0,
          longitude: 0
        }
      }
        fetch(site, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json"
          },
        })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({dataSource: ds.cloneWithRows(responseJson.users)});
        })
      }

    onRegionChangeComplete(region){
        for (var key in region){
          AsyncStorage.setItem(key, JSON.stringify(region[key]))
        }
      }
    
    componentDidMount() {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        Alert.alert(
          'Cannot Send Location',
          `We do not have permission to access your location. If you would like to share your location, please go into your settins and give this app permission.`,
          [{text: 'Dismiss Button'}]
        )
      }
      let userLocation = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      this.setState({location.latitude: userLocation.latitude, location.longitude: userLocation.longitude})
      Alert.alert(
        'LocationShared',
        `You shared your location`,
        [{text: 'Dismiss'}]
        )
      }
    //   this.setState({location.latitude: , location.longitude: })
    //   // AsyncStorage.getItem('user')
    //   // .then(result => {
    //   //   var parsedResult = JSON.parse(result);
    //   //   var username = parsedResult.username;
    //   //   var password = parsedResult.password;
    //   //   if (username && password) {
    //   //     return login(username, password)
    //   //       .then(resp => resp.json())
    //   //       .then(checkResponseAndGoToMainScreen);
    //   //   }
    //   // })
    //   // .catch((err) => { 
    //   //   console.log('there was an error', err)
    //   // })
    //   // this.props.navigation.setParams({
    //   //   onRightPress: this.getMessages.bind(this)
    //   // })
    // }
      
    // getMessages() {
    //   this.props.navigation.navigate('Messages')
    // }
      
    // longPressMap(location) {
    //   fetch(site,{
    //     method: 'POST',
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         location: {
    //             longitude: location.longitude,
    //             latitude: location.latitude
    //         }
    //     })
    //   })
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     if (responseJson.success){
    //     Alert.alert(
    //       'Location Set',
    //       `Your location has been shared`,
    //       [{text: 'Dismiss'}]
    //     )
    //     } else {
    //     Alert.alert(
    //       'Location not Set',
    //       `Your location has not been set`,
    //       [{text: 'Dismiss'}]
    //       )
    //     } 
    //   })
    // }
    
//     longTouchUser(user, location) {
//       fetch('https://hohoho-backend.herokuapp.com/messages', {
//         method: 'POST',
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           to: user._id,
//           location: {
//             longitude: location.longitude,
//             latitude: location.latitude
//           }
//         })
//       })
//        .catch((err) => {
//         console.log('there was an error sharing your location', err)
//         })
//   }


    // sendLocation = async(user) => {
    //   let { status } = await Permissions.askAsync(Permissions.LOCATION);
    //   if (status !== 'granted') {
    //     Alert.alert(
    //       'Cannot Send Location',
    //       `We do not have permission to access your location. If you would like to share your location, please go into your settins and give this app permission.`,
    //       [{text: 'Dismiss Button'}]
    //     )
    //   }
    //   let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    //   // longPressMap(location)
    //   Alert.alert(
    //     'LocationShared',
    //     `You shared your location`,
    //     [{text: 'Dismiss'}]
    //     )
    // }
    
    youAreHere(){
      navigator.geolocation.getCurrentPosition(
        (success) => {
          this.setState({
            latitude: success.coords.latitude,
            longitude: success.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.0025,
          });
        },
        (error) => {
        },
        {}
      )}

    render() {
      return (
        <View style={styles.container}>
        <TouchableOpacity
          onPress={this.touchUser.bind(this, rowData)}
          onLongPress={this.sendLocation.bind(this, rowData)}>
        <MapView region={latitude: this.state.location.latitude,
           longitude: this.state.location.latitude,
          latitudeDelta: .025,
          longitudeDelta: .025} style={{height: 200, margin: 40}} showsUserLocation={true} />
        </TouchableOpacity>
          <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => }
        />
          </View>
        );
      }
    }

    export default StackNavigator({
        Home: {
          screen: HomeScreen
        },
        Register: {
          screen: RegisterScreen
        },
        Login: {
          screen: LoginScreen
        },
        Users: {
          screen: UserScreen
        },
        Sport: {
          screen: PickupScreen
        }
        
      }, {initialRouteName: 'Sport'});
      
      
      //Styles
      const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F5FCFF',
          borderColor: 'black',
          borderWidth: 4,
          paddingLeft: 10,
          paddingRight: 10,
        },
        containerFull: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'stretch',
          backgroundColor: '#F5FCFF',
        },
        welcome: {
          fontSize: 20,
          textAlign: 'center',
          margin: 10,
        },
        instructions: {
          textAlign: 'center',
          color: '#333333',
          marginBottom: 5,
        },
        textBig: {
          fontSize: 36,
          textAlign: 'center',
          margin: 10,
          color: 'blue'
        },
        button: {
          alignSelf: 'stretch',
          paddingTop: 10,
          paddingBottom: 10,
          marginTop: 10,
          marginLeft: 5,
          marginRight: 5,
          borderRadius: 5
        },
        buttonRed: {
          backgroundColor: '#FF585B',
        },
        buttonBlue: {
          backgroundColor: '#0074D9',
        },
        buttonGreen: {
          backgroundColor: '#2ECC40'
        },
        buttonLabel: {
          textAlign: 'center',
          fontSize: 16,
          color: 'white'
        }
      });