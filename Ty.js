import React, { Component } from 'react';
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
import ModalDropdown from 'react-native-modal-dropdown';
import { Modal, Text, TouchableHighlight, View } from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements'

var site = 'https://stark-bastion-71532.herokuapp.com/'

class DiscoverScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={() => {navigation.state.params.onRightPress()}} />
  });

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { 
      users: [],
      dataSource: ds.cloneWithRows([]),
    }
      fetch(site + '/users', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({dataSource: ds.cloneWithRows(responseJson.users)});
        // this.setState({users})
      })
    }
  
  componentDidMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      if (username && password) {
        return login(username, password)
          .then(resp => resp.json())
          .then(checkResponseAndGoToMainScreen);
      }
    })
    .catch((err) => { 
      console.log('there was an error', err)
    })
    this.props.navigation.setParams({
      onRightPress: this.getMessages.bind(this)
    })
  }
    
  getMessages() {
    this.props.navigation.navigate('Messages')
  }
    
  touchUser(user) {
    fetch(site + 'profile/' + user._id ,{
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success){
      
  }
  
  longTouchUser(user) {
    fetch(site + '/messages' + user._id, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
     .catch((err) => {
      console.log('there was an error finding messages with this user', err)
      })
}


  // sendLocation = async(user) => {
  //   let { status } = await Permissions.askAsync(Permissions.LOCATION);
  //   if (status !== 'granted') {
  //     Alert.alert(
  //       'Cannot Send Location0',
  //       `We do not have permission to access your location. If you would like to share your location, please go into your settins and give this app permission.`,
  //       [{text: 'Dismiss Button'}]
  //     )
  //   }
  //   let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
  //   this.longTouchUser(user, location)
  //   Alert.alert(
  //     'LocationShared',
  //     `You shared your location`,
  //     [{text: 'Dismiss'}]
  //     )
  // }

  render() {
    return (
        <View style={styles.container}>
        <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <TouchableOpacity
           onPress={this.touchUser.bind(this, rowData)}
           onLongPress={this.sendLocation.bind(this, rowData)}
          //  delayLongPress={}
           >
           <Text style={{fontSize: 20}}>{rowData.username}</Text></TouchableOpacity>}
      />
        </View>
      );
    }
  }


class ModalExample extends Component {
  
    state = {
      modalVisible: false,
    }
  
    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    }
  
    render() {
      return (
        <View style={{marginTop: 22}}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {alert("Modal has been closed.")}}
            >
           <View style={{marginTop: 22}}>
            <View>
            <FormLabel>Name</FormLabel>
            <FormInput ref={input => this.input = input}/>
            <FormValidationMessage>Error message</FormValidationMessage>
  
              <TouchableHighlight onPress={() => {
                this.setModalVisible(!this.state.modalVisible)
              }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
  
            </View>
           </View>
          </Modal>
  
          <TouchableHighlight onPress={() => {
            this.setModalVisible(true)
          }}>
            <Text>Show Modal</Text>
          </TouchableHighlight>
  
        </View>
      );
    }
  }

modalNav(val){
  if (val === 'Profile'){
    this.props.navigation.navigate('Profile')
  } else if (val === 'Workout'){
    this.props.navigation.navigate('Workout')
  } else if (val === 'Pickup'){
    this.props.navigation.navigate('Pickup')
  } else if (val === 'Logout'){
    this.props.navigation.navigate('Logout')
  }
}

<ModalDropdown options={['Profile', 'Workout', 'Pickup', 'Logout']} onSelect= {(val) => this.modalNav(val)}>
</ModalDropdown>

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