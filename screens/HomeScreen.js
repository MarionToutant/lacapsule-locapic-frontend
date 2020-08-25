import React, {useState, useEffect} from 'react';
import {AsyncStorage, ImageBackground} from 'react-native';
import {Text, Button, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'

import {connect} from 'react-redux';

function HomeScreen({navigation, onSubmitPseudo}) {

  const [pseudo, setPseudo] = useState('');
  const [pseudoLocalStorage, setPseudoLocalStorage] = useState('');

  // GET PSEUDO FROM LOCAL STORAGE
  
  useEffect(() => {
    AsyncStorage.getItem("pseudo", function(error, data){
      setPseudoLocalStorage(data);
    })
  }, []);

  // ON SUBMIT "GO TO MAP"

  var onSubmit = () => {
    if(pseudo) {
      onSubmitPseudo(pseudo); 
      AsyncStorage.setItem("pseudo", pseudo);
    }
    navigation.navigate('Map'); 
  }

  // SHOWING PSEUDO INPUT OR WELCOME MESSAGE IF PSEUDO IN LOCAL STORAGE

  var inputPseudo = <Input
    containerStyle={{marginBottom: 25, width:'70%'}}
    inputStyle={{marginLeft: 10}}
    placeholder=' John'
    leftIcon={<Icon name='user' size={24} color='#eb4d4b' />}
    onChangeText={(e) => setPseudo(e)}
  />
  
  if(pseudoLocalStorage) {
    inputPseudo = <Text style={{color:'white', fontSize:20, marginBottom:40}}>Welcome back {pseudoLocalStorage}!</Text>
  } 

  // CALLBACK

  return (
        <ImageBackground source={require('../assets/home.jpg')} style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            {inputPseudo}
            <Button 
              title=" Go to map"
              icon={<Icon name='arrow-right' size={20} color='#eb4d4b' />}
              onPress={() => onSubmit()}
            />
        </ImageBackground>
  );
}

// REDUX

function mapDispatchToProps(dispatch) {
  return {
    onSubmitPseudo: function(pseudo) {
        dispatch( {type: 'savePseudo', pseudo: pseudo} )
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(HomeScreen);
