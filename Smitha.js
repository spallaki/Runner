import { StackNavigator } from 'react-navigation';
import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Button, Image, ScrollView } from 'react-native';

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
      <ScrollView style={[styles.container], {backgroundColor: '#81A078', paddingTop: 40}} contentContainerStyle={styles.cont}>
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
      <ScrollView style={styles.container} contentContainerStyle={styles.cont}>
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
        <TouchableOpacity style={{display: 'flex', paddingTop: 40, paddingBottom: 20}}>
          <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
            source={require ('./hit1.png')}
          />
          <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>keep it high-intensity</Text>
          {hit.map(i => Item({...tileDimensions, text: i}))}
        </TouchableOpacity>
      </View>
      <View>
      <TouchableOpacity style={{textAlign: 'center', color: 'white', paddingTop: 40, paddingBottom: 20}}>
        <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
          source={require ('./gym1.png')}
        />
        <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>go to the gym</Text>
        {gym.map(i => Item({...tileDimensions, text: i}))}
      </TouchableOpacity>
    </View>
    <View>
    <TouchableOpacity style={{textAlign: 'center', color: 'white', paddingTop: 40, paddingBottom: 20}}>
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
      <ScrollView style={styles.container} contentContainerStyle={styles.cont}>
        <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>Today I feel like playing... </Text>
        <TouchableOpacity style={{textAlign: 'center', color: 'white', paddingTop: 40, paddingBottom: 20}}>
          <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
            source={require ('./basketball1.png')}
          />
          <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>basketball</Text>
          {basketball.map(i => Item({...tileDimensions, text: i}))}
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingTop: 40, paddingBottom: 20 }}>
          <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
            source={require ('./football1.png')}
          />
          <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>football</Text>
          {football.map(i => Item({...tileDimensions, text: i}))}
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingTop: 40, paddingBottom: 20 }}>
          <Image style={[styles.shadow], {resizeMode: 'contain', width: 150, height: 150}}
            source={require ('./soccer1.png')}
          />
          <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, fontSize: 16}}>soccer</Text>
          {soccer.map(i => Item({...tileDimensions, text: i}))}
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingTop: 40, paddingBottom: 20 }}>
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
  }
});


///STYLING
const styles = StyleSheet.create({
  container: {
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
  }
});

console.disableYellowBox = true;
