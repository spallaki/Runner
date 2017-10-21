import React from 'react';
import { AsyncStorage, StyleSheet, View, Text, TouchableOpacity, TextInput, ListView, Alert, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions } from 'expo';
//
// class App extends React.Component {
//   // static navigationOptions = ({ navigation }) => ({
//   //   title: 'Choose your activity',
//   //   headerRight:
//   //   <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
//   // });
//   static navigationOptions = {
//     title: 'Choose your activity'
//   };
//
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>Open up App.js to start working on your app!</Text>
//         {/* <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={this.register.bind(this)}>
//             <Text style={styles.buttonLabel}>Choose your activity!</Text>
//         </TouchableOpacity> */}
//         <View>
//           <Tiles renderItem={(text, size) => (
            <Image style={{ width: size, height: size }}
              src={{ uri: "https://unsplash.it/400/400/?random" }}
            />
//           )}
//           />
//         </View>
//       </View>
//     );
//   }
// }
// //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
//
// import Tiles from 'react-native-tiles';
//
// class ReactNativeTiles extends React.Component {
//   constructor(props) {
//     super(props);
//     const ds = new ListView.DataSource({
//       rowHasChanged: (r1, r2) => r1 !== r2
//     });
//     this.state = {
//       dataSource: ds.cloneWithRows(["row 1", "row 2"])
//     };
//   }
//   render() {
//     return (
//       <View style={{ flex: 1 }}>
//         <Tiles
//           style={{ marginTop: 10 }}
//           dataSource={this.state.dataSource}
//           tilesPerRow={2}
//           renderItem={(text, size) => (
//             <Tile text={text} />
//           )}
//         />
//       </View>
//     );
//   }
// }
//
// const Tile = ({text}) => {
//   return (
//     <View>
//       <Text>{text}</Text>
//     </View>
//   );
// }
//
// export default ReactNativeTiles;

import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get("window");

export default class App extends Component {
  render() {
    const tileDimensions = calcTileDimensions(width, 5)  // -> change this number and see!
    const tiles = 'iLike Running Alot'.split(' ')
    return (
      <View style={styles.container}>
        {tiles.map(i => Item({...tileDimensions, text: i}))}
      </View>
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

const styles = StyleSheet.create({
  container: {
     alignItems: 'center', justifyContent: "flex-start", flexDirection: "row", flexWrap: "wrap", marginTop: 30
  },
  item: {
    backgroundColor: 'white',
     alignSelf: "flex-start",
     alignItems: 'center',
     justifyContent: 'center',
     marginBottom: 20,
     borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  itemText: {
    fontSize: 20
  }
});
