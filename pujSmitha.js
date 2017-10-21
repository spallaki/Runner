//// PUJ START
import React, { Component } from 'react';
import { Animated, Text, View, Dimensions, TextInput, TouchableOpacity, StyleSheet, AsyncStorage, Button, ListView, Alert, ScrollView, Image } from 'react-native';
import { Constants } from 'expo';
import { StackNavigator } from 'react-navigation';
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
// export default class App extends Component {
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
    console.log(PAGE_WIDTH)
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
      //res.json({someresponse: shityouwanttosend})
      console.log('response',response)
      return response.json()
    })
    .then((responseJson) => {
      console.log('repsonsejson', responseJson)
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
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      if (username && password) {
        return login(username, password)
      }
    })
    .catch(err => { /* handle the error */ })
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
        // alert('Successfully Logged In')
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
      console.log(err);
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
            source={require ('./workout.png')}
          />
          <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>working out</Text>
          {workoutTile.map(i => Item({...tileDimensions, text: i}))}
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => {this.sportsPress()}} style={{display: 'flex'}}>
          <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
            source={require ('./sports.png')}
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

  render() {
    const run = [];
    const gym = [];
    const yoga = [];
    const hit = [];

    return (
      <ScrollView style={[styles.container3], {backgroundColor: '#98a5ba', paddingTop: 40}} contentContainerStyle={styles.cont}>
        <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>and I want to... </Text>
        <View>
        <TouchableOpacity style={{paddingTop: 40, paddingBottom: 20}}>
          <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
            source={require ('./run1.png')}
          />
          <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>run</Text>
          {run.map(i => Item({...tileDimensions, text: i}))}
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={{display: 'flex', paddingTop: 10, paddingBottom: 20}}>
          <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
            source={require ('./hit1.png')}
          />
          <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>keep it high-intensity</Text>
          {hit.map(i => Item({...tileDimensions, text: i}))}
        </TouchableOpacity>
      </View>
      <View>
      <TouchableOpacity style={{textAlign: 'center', color: 'white', paddingTop: 10, paddingBottom: 20}}>
        <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
          source={require ('./gym1.png')}
        />
        <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>go to the gym</Text>
        {gym.map(i => Item({...tileDimensions, text: i}))}
      </TouchableOpacity>
    </View>
    <View>
    <TouchableOpacity style={{textAlign: 'center', color: 'white', paddingTop: 10, paddingBottom: 20}}>
      <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
        source={require ('./yoga1.png')}
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
            source={require ('./basketball1.png')}
          />
          <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>basketball</Text>
          {basketball.map(i => Item({...tileDimensions, text: i}))}
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingTop: 15, paddingBottom: 20 }}>
          <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
            source={require ('./football1.png')}
          />
          <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>football</Text>
          {football.map(i => Item({...tileDimensions, text: i}))}
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingTop: 15, paddingBottom: 20 }}>
          <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
            source={require ('./soccer1.png')}
          />
          <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>soccer</Text>
          {soccer.map(i => Item({...tileDimensions, text: i}))}
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingTop: 15, paddingBottom: 20 }}>
          <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
            source={require ('./tennis1.png')}
          />
          <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>tennis</Text>
          {tennis.map(i => Item({...tileDimensions, text: i}))}
        </TouchableOpacity>
      </ScrollView>
    );
  }
}


///navigation

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
},
{initialRouteName: 'Home'},
{ headerMode: 'screen' }
);


///STYLING
const styles = StyleSheet.create({
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
//// SMITHA END
