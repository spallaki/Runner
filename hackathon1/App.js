import React, { Component } from 'react';
import { Animated, Text, View, Dimensions, TextInput, TouchableOpacity, StyleSheet, AsyncStorage, Button, ListView, Alert, ScrollView, Image, Slider } from 'react-native';
import { Constants } from 'expo';
import { StackNavigator } from 'react-navigation';
import MapView from 'react-native-maps';
import { athletes } from './athletes.js';

const site = 'https://stark-bastion-71532.herokuapp.com/'

const PAGE_WIDTH = Dimensions.get('window').width;
const PAGES = [
  {
    title: 'Runnr+',
    description: "Connect with active people nearby looking for a workout partner",
    backgroundColor: '#2448a2',
    image: 'http://assets.menshealth.co.uk/main/thumbs/35653/nike1__square.jpg'
  },
  {
    title: 'Runnr+',
    description: "Choose the sport you want to play... and we'll find players in your vicinity",
    backgroundColor: '#79a9dc',
    image: 'https://images.unsplash.com/photo-1468465226960-8899e992537c?w=1653'
  },
  {
    title: 'Runnr+',
    description: "Join and play pick-up sports instantly",
    backgroundColor: '#66a98b',
    image: 'https://images.unsplash.com/photo-1497292348804-01ddc743bcb7?w=1950'
  },
  {
    title: 'Runnr+',
    description: "Find someone to motivate you and inspire you",
    backgroundColor: '#4b79a9',
    image: 'https://images.unsplash.com/photo-1506534067239-9e2fabb3a863?w=1950'
  },
  {
    title: 'Runnr+',
    description: "Changing the way you train - from solo to social",
    backgroundColor: '#127186',
    image: 'https://images.unsplash.com/photo-1474925558543-e7a5f06e733e?w=1950'
  },
]


class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
    header: null
  }
  state = {
    scroll: new Animated.Value(0),
  };
  loginpress() {
    this.props.navigation.navigate('Login');
  }
  registerpress() {
    this.props.navigation.navigate('Register');
  }
  render() {
    const position = Animated.divide(this.state.scroll, PAGE_WIDTH);
    const backgroundColor = position.interpolate({
      inputRange: PAGES.map((_, i) => i),
      outputRange: PAGES.map(p => p.backgroundColor),
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[ StyleSheet.absoluteFill, { backgroundColor, opacity: 0.8 } ]} />
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [ { nativeEvent: { contentOffset: { x: this.state.scroll } } } ],
          )}>
          {PAGES.map((page, i) => (
            <View key={i} style={styles.page}>
              <View style={[ styles.card ]}>
                <Text style={styles.title}>{page.title}</Text>
                <Text style={styles.desc}>{page.description}</Text>
              </View>
              <Animated.View style={[ styles.frame, styles.shadow, { transform: [{ translateX: Animated.multiply(Animated.add(position, -i), -200) }] } ]}>
                <Animated.Image
                  source={{uri: page.image}}
                  style={styles.photo}
                />
              </Animated.View>
            </View>
          ))}
        </Animated.ScrollView>
        <View>
          <TouchableOpacity onPress={ () => {this.registerpress()} } style={styles.buttonRegister}>
            <Text style={styles.buttonText}>{"REGISTER"}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={ () => {this.loginpress()} } style={styles.buttonLogin}>
            <Text style={styles.buttonText}>{"  LOGIN   "}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register',
    header: null
  };

  constructor() {
    super();
    this.state = {
      username:'',
      password:''
    }
  }

  register2press() {
    fetch('https://stark-bastion-71532.herokuapp.com/register',
    {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        passwordRepeat: this.state.passwordRepeat,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
      })
    })
    .then((response) => {
      return response.json()
    })
    .then((responseJson) => {
      if (responseJson.success) {
        this.props.navigation.navigate('Login');
      }
    })
    .catch((err) => {
      console.log('error', err)
    });
  }

  render() {
    return (
      <View style={styles.container1}>
        <Text style={styles.title}>Your Account For Everything Runnr+</Text>
        <TextInput
          style={{height: 40, borderStyle: 'solid', margin: 10}}
          placeholderTextColor="white"
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, borderStyle: 'solid', margin: 10}}
          placeholderTextColor="white"
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TextInput
          style={{height: 40, borderStyle: 'solid', margin: 10}}
          placeholderTextColor="white"
          placeholder="Repeat Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TextInput
          style={{height: 40, borderStyle: 'solid', margin: 10}}
          placeholderTextColor="white"
          placeholder="First Name"
          onChangeText={(text) => this.setState({firstName: text})}
        />
        <TextInput
          style={{height: 40, borderStyle: 'solid', margin: 10}}
          placeholderTextColor="white"
          placeholder="Last Name"
          onChangeText={(text) => this.setState({lastName: text})}
        />
        <TouchableOpacity style={styles.buttonRegister1} onPress={ () => {this.register2press()} }>
          <Text style={styles.buttonText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
    header: null
  };

  constructor() {
    super();
    this.state = {
      username:'',
      password:'',
      err:''
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      const parsedResult = JSON.parse(result);
      const username = parsedResult.username;
      const password = parsedResult.password;
      if (username && password) {
        return login(username, password)
      }
    })
    .catch(err => { console.log('error', err); })
  }

  login2press() {
    fetch('https://stark-bastion-71532.herokuapp.com/login',
    {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) {
        AsyncStorage.setItem('user', JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }))
        .then(() => this.props.navigation.navigate('chooseActivity'))
      } else {
        this.setState({error: 'error'});
      }
    })
    .catch((err) => {
      console.log("Error!", err);
    });
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container1}>
        <Text style={styles.title}>Your Account For Everything Runnr+</Text>
        <TextInput
          style={{height: 40, borderStyle: 'solid', margin: 10}}
          placeholderTextColor="white"
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, borderStyle: 'solid', margin: 10}}
          placeholderTextColor="white"
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={ () => {this.login2press()} } style={styles.buttonLogin1}>
          <Text style={styles.buttonText}>{"LOGIN"}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const { width } = Dimensions.get("window");

class chooseActivity extends React.Component {
  static navigationOptions = {
    title: 'Choose',
    header: null
  }

  constructor(props) {
    super(props);
  }

  workoutPress() {
    this.props.navigation.navigate('workout');
  }

  sportsPress() {
    this.props.navigation.navigate('sports');
  }

  render() {
    const workoutTile = [];
    const sportsTile = [];
    return (
      <ScrollView style={[styles.container3], {backgroundColor: '#81A078', paddingTop: 40}} contentContainerStyle={styles.cont}>
        <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>Today I feel like... </Text>
        <View>
          <TouchableOpacity style={{paddingTop: 40, paddingBottom: 20}} onPress={() => {this.workoutPress()}}>
            <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
              source={require ('./images/workout.png')}
            />
            <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>working out</Text>
            {workoutTile.map(i => Item({...tileDimensions, text: i}))}
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => {this.sportsPress()}} style={{display: 'flex'}}>
            <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
              source={require ('./images/sports.png')}
            />
            <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>a pick-up game</Text>
            {sportsTile.map(i => Item({...tileDimensions, text: i}))}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}


const Item = ({size, margin, text}) => (
  <View style={[styles.item, {width: size, height: size, marginHorizontal: margin}]}>
    <Text style={styles.itemText}>{text}</Text>
  </View>
)

const calcTileDimensions = (deviceWidth, tpr) => {
  const margin = deviceWidth / (tpr * 10);
  const size = (deviceWidth - margin * (tpr * 2)) / tpr;
  return { size, margin };
};

class workoutScreen extends React.Component {
  static navigationOptions = {
    title: 'workout',
    header: null
  }

  run() {
    this.props.navigation.navigate('runMap');
  }

  render() {
    const run = [];
    const gym = [];
    const yoga = [];
    const hit = [];

    return (
      <ScrollView style={[styles.container3], {backgroundColor: '#98a5ba', paddingTop: 40}} contentContainerStyle={styles.cont}>
        <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>and I want to... </Text>
        <View>
          <TouchableOpacity onPress={() => {this.run()}} style={{paddingTop: 40, paddingBottom: 20}}>
            <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
              source={require ('./images/run1.png')}
            />
            <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>run</Text>
            {run.map(i => Item({...tileDimensions, text: i}))}
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={{display: 'flex', paddingTop: 10, paddingBottom: 20}}>
            <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
              source={require ('./images/hit1.png')}
            />
            <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>keep it high-intensity</Text>
            {hit.map(i => Item({...tileDimensions, text: i}))}
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={{textAlign: 'center', color: 'white', paddingTop: 10, paddingBottom: 20}}>
            <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
              source={require ('./images/gym1.png')}
            />
            <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>go to the gym</Text>
            {gym.map(i => Item({...tileDimensions, text: i}))}
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={{textAlign: 'center', color: 'white', paddingTop: 10, paddingBottom: 20}}>
            <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
              source={require ('./images/yoga1.png')}
            />
            <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>yoga</Text>
            {yoga.map(i => Item({...tileDimensions, text: i}))}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

class sportsScreen extends React.Component {
  static navigationOptions = {
    title: 'sports',
    header: null
  }

  render() {
    const basketball = [];
    const football = [];
    const soccer = [];
    const tennis = [];

    return (
      <ScrollView style={[styles.container3], {backgroundColor: '#8fb2b7', paddingTop: 40}} contentContainerStyle={styles.cont}>
        <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>Today I feel like playing... </Text>
        <TouchableOpacity style={{textAlign: 'center', color: 'white', paddingTop: 40, paddingBottom: 20}}>
          <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
            source={require ('./images/basketball1.png')}
          />
          <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>basketball</Text>
          {basketball.map(i => Item({...tileDimensions, text: i}))}
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingTop: 15, paddingBottom: 20 }}>
          <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
            source={require ('./images/football1.png')}
          />
          <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>football</Text>
          {football.map(i => Item({...tileDimensions, text: i}))}
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingTop: 15, paddingBottom: 20 }}>
          <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
            source={require ('./images/soccer1.png')}
          />
          <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>soccer</Text>
          {soccer.map(i => Item({...tileDimensions, text: i}))}
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingTop: 15, paddingBottom: 20 }}>
          <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
            source={require ('./images/tennis1.png')}
          />
          <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>tennis</Text>
          {tennis.map(i => Item({...tileDimensions, text: i}))}
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

class App extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Run Map',
    headerRight: <Button title='Users' onPress={() => {navigation.state.params.onRightPress()}} />
  })

  constructor(props) {
    super(props)
    this.state = {
      paceToggleOn: false,
      timeToggleOn: false,
      markers: athletes,
      time: 0,
      disabled: false,
      pace: 0,
    }
    this.handlePress=this.handlePress.bind(this);
  }

  getMessages() {
    this.props.navigation.navigate('Users')
  }

  componentDidMount(){
    this.props.navigation.setParams({
      onRightPress: this.getMessages.bind(this)
    })
  }

  getModal(){}

  handlePress(e) {
    const sliderTime = this.state.time
    const sliderPace = this.state.pace

    const sliceMarkers = this.state.markers.slice()
    sliceMarkers.push({
      name: 'Pam',
      coordinate: Object.values(e.nativeEvent.coordinate),
      sport: 'running',
      pace: 8,
      image: 'https://scontent-sjc2-1.xx.fbcdn.net/v/t31.0-8/21414894_1458249047562200_5036214036861933050_o.jpg?oh=2f5c495444364c8259de38e61a38f6fb&oe=5AB00CFB',
      distance: 4,
      start: sliderTime,
      show: true,
    })

    this.setState({
      markers: sliceMarkers
    }, () => console.log('NEW STATE', this.state.markers.length));
  }

  checkTime(timeValue) {
    if (this.state.paceToggleOn) {
      this.checkBoth(timeValue, this.state.pace)
    } else {
      const copiedAthletes = [...this.state.markers]
      const timeAlteredAthletes = copiedAthletes.map((person) => {
        if (person.start === timeValue){
          person.show = true
        } else { person.show = false }
        return person
      })
      this.setState({markers: timeAlteredAthletes, time: timeValue})
    }
  }

  checkPace(paceValue) {
    if (this.state.timeToggleOn) {
      this.checkBoth(this.state.time, paceValue)
    } else {
      // if both toggles are on, go to check Both, else
      const copiedAthletesPace = [...this.state.markers]
      const paceAlteredAthletes = copiedAthletesPace.map((person) => {
        if (person.pace === paceValue) {
          person.show = true
        } else { person.show = false }
        return person
      })
      this.setState({markers: paceAlteredAthletes, pace: paceValue})
    }
  }

  checkBoth(timeValue, paceValue){
    const copiedAthletesBoth = [...this.state.markers]
    const bothAlteredAthletes = copiedAthletesBoth.map((person) => {
      if (person.pace === paceValue && person.start === timeValue) {
        person.show = true
      } else {
        person.show = false }
        return person
      })
      this.setState({markers: bothAlteredAthletes, pace: paceValue, time: timeValue})
    }

    render() {
      return (
        <View style={styles.container5}>
          <View style={styles.mapHalf}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 37.792900,
                longitude: -122.428202,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2,
              }}
              onPress={this.handlePress}
              >
                {this.state.markers.map((marker, index) => (
                  <MapView.Marker
                    coordinate={{
                      latitude: marker.coordinate[0],
                      longitude: marker.coordinate[1],
                    }}
                    key={index} >
                    <Image
                      source={{uri: marker.image}}
                      style={{width:30, height:30, display: marker.show ? "flex" : "none"}}
                    />
                  </MapView.Marker>
                ))}
              </MapView>
            </View>
            <View style={styles.bottomHalf}>
              <View style={styles.timeSliderView} >
                <TouchableOpacity
                  style={styles.button5}
                  onPress={() => this.setState({
                    timeToggleOn: !this.state.timeToggleOn
                  })}
                  >
                    <Text style={styles.buttonText5}>{this.state.timeToggleOn ? 'All times' : ' Filter by time'} </Text>
                  </TouchableOpacity>
                  <Text style={[styles.textTime, {display: this.state.timeToggleOn ? "flex" : 'none'}]}>
                    {this.state.time ? this.state.time + " o'clock": " Choose start time."}
                  </Text>
                  <Slider
                    style={[styles.slider, {display: this.state.timeToggleOn ? "flex" : 'none'}]}
                    step={1}
                    minimumValue={5}
                    maximumValue={23}
                    maximumTrackTintColor={'blue'}
                    value={this.state.time}
                    onValueChange={(val) => {this.checkTime(val)}}
                  />
                </View>

                {/* PACE SLIDER */}

                <View style={styles.paceSliderView}>
                  <TouchableOpacity
                    style={styles.button5}
                    onPress={() => this.setState({
                      paceToggleOn: !this.state.paceToggleOn
                    })}
                    >
                      <Text style={styles.buttonText5}>{this.state.paceToggleOn ? 'All paces' : 'Filter by pace'} </Text>
                    </TouchableOpacity>
                    <Text style={[styles.textPace, {display: this.state.paceToggleOn ? "flex" : 'none'}]}>
                      {this.state.pace ? this.state.pace + "min/mile": "Choose pace."}
                    </Text>
                    <Slider
                      style={[styles.slider, {display: this.state.paceToggleOn ? "flex" : 'none'}]}
                      step={1}
                      minimumValue={5}
                      maximumValue={10}
                      maximumTrackTintColor={'blue'}
                      value={this.state.pace}
                      onValueChange={(val) => {this.checkPace(val)}}
                    />
                  </View>
                </View>
              </View>
            );
          }
        }

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
      this.setState({dataSource: ds.cloneWithRows(athletes)});
    })
  }

  componentDidMount() {
    this.setState({dataSource: ds.cloneWithRows(athletes)});
    AsyncStorage.getItem('user')
    .then(result => {
      const parsedResult = JSON.parse(result);
      const username = parsedResult.username;
      const password = parsedResult.password;
      if (username && password) {
        return login(username, password)
        .then(resp => resp.json())
        .then(checkResponseAndGoToMainScreen);
      }
    })
    .catch((err) => {
      console.log('Error!', err)
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
    })
  }

  longTouchUser(user) {
    fetch(site + '/messages' + user._id, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .catch((err) => {
      console.log('Error!', err)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <TouchableOpacity
            onPress={this.touchUser.bind(this, rowData)}
            onLongPress={this.sendLocation.bind(this, rowData)}
            >
              <Text style={{fontSize: 20}}>{rowData.username}</Text></TouchableOpacity>}
            />
          </View>
        );
      }
    }

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
      })
    }

    componentDidMount() {
      AsyncStorage.getItem('user')
      .then(result => {
        const parsedResult = JSON.parse(result);
        const username = parsedResult.username;
        const password = parsedResult.password;
        if (username && password) {
          return login(username, password)
          .then(resp => resp.json())
          .then(checkResponseAndGoToMainScreen);
        }
      })
      .catch((err) => {
        console.log('Error!', err)
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
            console.log('Error!', err)
          })
        }

        render() {
          return (
            <View style={styles.container}>
              <ListView
                dataSource={this.state.dataSource}
                renderRow={(rowData) => <TouchableOpacity
                  onPress={this.touchUser.bind(this, rowData)}
                  onLongPress={this.sendLocation.bind(this, rowData)}
                  >
                    <Text style={{fontSize: 20}}>{rowData.username}</Text></TouchableOpacity>}
                  />
                </View>
              );
            }
          }

export default StackNavigator({
    chooseActivity: {
      screen: chooseActivity,
    },
    workout: {
      screen: workoutScreen,
    },
    sports: {
      screen: sportsScreen,
    },
    Login: {
      screen: LoginScreen,
    },
    Register: {
      screen: RegisterScreen,
    },
    Home: {
      screen: HomeScreen,
    },
    runMap: {
      screen: App,
    },
    Users: {
      screen: DiscoverScreen
    }

  },
  {initialRouteName: 'Home'},
  { headerMode: 'screen' }
);

const styles = StyleSheet.create({
  container5: {
    flexDirection: 'column',
    backgroundColor: 'red',
    borderColor: '#2448a2',
    borderWidth: 2,
    flex: 1,
    height: 100,
    width: 375,
  },
  mapHalf: {
    flex:3,
    flexDirection: 'row',
    backgroundColor: 'yellow',
  },
  bottomHalf: {
    backgroundColor: 'pink',
    borderWidth: 2,
    borderColor: '#2448a2',
    width: 375,
    height: 50,
    flex:1,
  },
  map: {
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    marginVertical: 20,
    backgroundColor: 'maroon',
    flex:1,
  },
  button5: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 20,
    padding: 10,
    width: 100,
    height: 40,
    marginVertical: 20,
    borderColor:'#2448A2',
    borderWidth: 1,
    flex:1,
  },
  buttonText5: {
    alignItems:'center',
  },
  timeSliderView: {
    flex: 1,
    height: 100,
    width: 375,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: '#4C69B0',
  },
  paceSliderView: {
    flex: 1,
    backgroundColor:'purple',
    height: 100,
    width: 375,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#4C69B0',
  },
  slider: {
    width: 100,
    height: 30,
    backgroundColor:'#4C69B0',
    flex:4,
  },
  textTime: {
    backgroundColor: '#4C69B0',
    color: 'white',
    flex: 1
  },
  textPace: {
    backgroundColor: '#4C69B0',
    color: 'white',
    flex: 1
  },
  container3: {
    backgroundColor: '#4C69B0',
    flex: 1,
    flexDirection: 'column',
    color: 'white',
    width: '100%',
    overflow: 'scroll',
    paddingTop: 40,
    paddingBottom: 40,
  },
  cont: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    alignSelf: "flex-start",
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    maxHeight: 30,
    maxWidth: 30
  },
  itemText: {
    fontSize: 20
  },
  shadow: {
    elevation: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: {
      height: 12
    }
  },
  container: {
    flex: 1,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4C68B1',
  },
  title: {
    fontSize: PAGE_WIDTH / 12,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  desc: {
    fontSize: PAGE_WIDTH / 24,
    color: '#fff',
    backgroundColor: 'transparent',
    marginTop: 20,
    lineHeight: 25,
    textAlign: 'center'
  },
  page: {
    width: PAGE_WIDTH,
    paddingTop: Constants.statusBarHeight + 48,
  },
  card: {
    position: 'absolute',
    margin: 12,
    marginTop: 40,
    left: 12,
    top: 0,
    right: 0,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 140,
  },
  frame: {
    position: 'absolute',
    left: 0,
    bottom: 160,
    borderRadius: (PAGE_WIDTH -100)/2,
    height: PAGE_WIDTH -100,
    width: PAGE_WIDTH - 100,
    margin: 50,
  },
  buttonRegister: {
    backgroundColor: 'rgba(0,0,0, 0.3)',
    position: 'absolute',
    margin: 12,
    marginLeft: -60,
    marginTop: 40,
    left: (PAGE_WIDTH / 2) - 100,
    borderRadius: 50,
    alignItems: 'center',
    bottom: 30,
  },
  buttonRegister1: {
    backgroundColor: 'rgba(0,0,0, 0.3)',
    position: 'absolute',
    margin: 12,
    marginLeft: 20,
    marginTop: 40,
    left: (PAGE_WIDTH / 2) - 100,
    borderRadius: 50,
    alignItems: 'center',
    bottom: 30,
  },
  buttonLogin: {
    backgroundColor: 'rgba(0,0,0, 0.3)',
    position: 'absolute',
    margin: 12,
    marginLeft: 115,
    marginTop: 40,
    left: (PAGE_WIDTH / 2) - 100,
    borderRadius: 50,
    alignItems: 'center',
    bottom: 30,
  },
  buttonLogin1: {
    backgroundColor: 'rgba(0,0,0, 0.3)',
    position: 'absolute',
    margin: 12,
    marginLeft: 35,
    marginTop: 40,
    left: (PAGE_WIDTH / 2) - 100,
    borderRadius: 50,
    alignItems: 'center',
    bottom: 30,
  },
  buttonText: {
    margin: 15,
    marginLeft: 50,
    marginRight: 40,
    color: '#fff',
    fontSize: 14,
  },
  photo: {
    flex: 1,
    borderRadius: (PAGE_WIDTH -100)/2,
  }
});

console.disableYellowBox = true;
