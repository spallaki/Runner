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

//Screens
class HomeScreen extends React.Component {

  static navigationOptions = {
    title: 'Home Page'
  };

  register() {
    this.props.navigation.navigate('Register');
  }
  login() {
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Welcome to HoHoHo!</Text>
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.login()} }>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register'
  };
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }
  register() {
    fetch('https://hohoho-backend.herokuapp.com/register', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: this.state.username,
      password: this.state.password,
    })
  })
  .then((response) => response.json())
  .then((responseJson) => {
    if(responseJson.success === true){
      this.setState({
        username: responseJson.user.username,
        password: responseJson.user.password,
        _id: responseJson.user._id,
        createdAt: responseJson.user.createdAt
      })
      this.props.navigation.goBack();
    }
    //
    /* do something with responseJson and go back to the Login view but
     * make sure to check for responseJson.success! */
  })
  .catch((err) => {
    console.log('there was an error', err)
  });

  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
        style={{height: 40, color: 'black' }}
        placeholder="Enter your username"
        onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
        style={{height: 40, color: 'black'}}
        placeholder="Enter your password"
        onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
  }

  class LoginScreen extends React.Component {
      static navigationOptions = {
        title: 'Login'
      };
      constructor(props) {
        super(props);
        this.state = {
          username: '',
          password: ''
        }
      }

      componentDidMount() {
        AsyncStorage.getItem('user')
        .then(result => {
          var parsedResult = JSON.parse(result);
          var username = parsedResult.username;
          var password = parsedResult.password;
          if (username && password) {
            return this.login(username, password)
              .then(resp => resp.json())
              .then(() => {
                self.props.navigation.navigate('Users');
              }
            );
          }
        })
        .catch((err) => {
          console.log('there was an error', err)
        })
      }

      login() {
        fetch('https://hohoho-backend.herokuapp.com/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.success === true){
          this.setState({
            username: responseJson.user.username,
            password: responseJson.user.password,
            _id: responseJson.user._id,
            createdAt: responseJson.user.createdAt
          },()=>{
            AsyncStorage.setItem('user', JSON.stringify({
              username: this.state.username,
              password: pass
            }));
            this.props.navigation.navigate('Users');
          })

        }
      })
      .catch((err) => {
        console.log('there was an error', err)
      });
    }
      render() {
        return (
          <View style={styles.container}>
          <Text style={styles.textBig}>Login</Text>
          <TextInput
          style={{height: 40, color: 'black'}}
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
          />
          <TextInput
          style={{height: 40, color: 'black'}}
          placeholder="Password"
          onChangeText={(text) => this.setState({password: text})}
          />
          <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.login()} }>
            <Text style={styles.buttonLabel}>Login</Text>
          </TouchableOpacity>
        </View>
        )
    }
  }

  class UserScreen extends React.Component {
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
        location: {
          latitude: 0,
          longitude: 0
        }
      }
        fetch('https://hohoho-backend.herokuapp.com/users', {
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
      fetch('https://hohoho-backend.herokuapp.com/messages',{
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: user._id
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success){
        Alert.alert(
          'Message Sent',
          `Your Ho Ho Ho! to ${user.username} has been sent!`,
          [{text: 'Dismiss Button'}]
        )
        } else {
        Alert.alert(
          'Message Not Sent',
          `Your Ho Ho Ho! to ${user.username} has not been sent!`,
          [{text: 'Dismiss Button'}]
          )
        }
      })
    }

    longTouchUser(user, location) {
      fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: user._id,
          location: {
            longitude: location.longitude,
            latitude: location.latitude
          }
        })
      })
       .catch((err) => {
        console.log('there was an error sharing your location', err)
        })
  }


    sendLocation = async(user) => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        Alert.alert(
          'Cannot Send Location0',
          `We do not have permission to access your location. If you would like to share your location, please go into your settins and give this app permission.`,
          [{text: 'Dismiss Button'}]
        )
      }
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      this.longTouchUser(user, location)
      Alert.alert(
        'LocationShared',
        `You shared your location`,
        [{text: 'Dismiss'}]
        )
    }

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

class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => (response.json()))
    .then((res) => {
      this.setState({
        dataSource: ds.cloneWithRows(res.messages)
      })
    })
    .catch((err) => {
      console.log('there was an error', err)
    })
  }
  static navigationOptions = {
    title: 'Messages'
  };


  render() {
    return (
      <ListView
      dataSource={this.state.dataSource}
      renderRow={(rowData) =>
        <TouchableOpacity>
        <Text style={{
          paddingTop: 10,
          paddingBottom: 10,
          marginTop: 10,
          marginLeft: 5,
          marginRight: 5,
          color: 'red'}}>
          <Text>Message from: {rowData.from.username}</Text>
          <Text> to: {rowData.to.username}</Text>
          <Text> at: {rowData.timestamp}</Text>
          </Text>
          {(rowData.location) ? (
          <MapView style={{height: 150, width: 150, flex: 1}}
          region={rowData.location}
          >
          <MapView.Marker
            coordinate={{longitude: parseInt(rowData.location.longitude), latitude: parseInt(rowData.location.latitude)}}
            title={'Sent from'}
            />
        </MapView>
          ) : <Text></Text>}
          </TouchableOpacity>
        }
        />
  )
  }
}

//Navigator
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
  Messages: {
    screen: MessagesScreen
  }

}, {initialRouteName: 'Home'});


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
