import React, {useState, useEffect} from 'react';
import {AsyncStorage, View} from 'react-native';
import {Button, Overlay, Input} from 'react-native-elements'

import Icon from 'react-native-vector-icons/FontAwesome';

import MapView,{Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import socketIOClient from "socket.io-client";
import {connect} from 'react-redux';

const dotenv = require("dotenv");
dotenv.config();

var socket = socketIOClient(process.env.REACT_NATIVE_QUOTAGUARDSTATIC_URL, { forceNode: true });

function MapScreen(props) {

  const [currentLocation, setCurrentLocation] = useState({latitude: 0, longitude: 0});
  const [listLocation, setListLocation] = useState([]);

  const [addPOI, setAddPOI] = useState(false);
  const [listPOI, setListPOI] = useState([]);
  
  const [tempPOI, setTempPOI] = useState();
  const [titlePOI, setTitlePOI] = useState();
  const [descPOI, setDescPOI] = useState();

  const [isVisible, setIsVisible] = useState(false);

  const [pseudoLocalStorage, setPseudoLocalStorage] = useState('');


  // GET PSEUDO FROM LOCAL STORAGE
  
  useEffect(() => {
    AsyncStorage.getItem("pseudo", function(error, data){
      setPseudoLocalStorage(data);
    })
  }, []);

  // MY REAL-TIME LOCATION

  useEffect(() => {
    async function askPermissions() {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        Location.watchPositionAsync({distanceInterval: 2},
          (location) => {
            setCurrentLocation({latitude: location.coords.latitude, longitude: location.coords.longitude});
            socket.emit("sendLocation", {pseudo: pseudoLocalStorage, latitude: location.coords.latitude, longitude: location.coords.longitude})
          }
        );
      }
    }
    askPermissions();
  }, []);

  // GET OTHER LOCATIONS FROM BACKEND

  useEffect(() => {
    socket.on('sendLocationToAll', (newLocation)=> {
      var listLocationCopy = [...listLocation];
      listLocationCopy = listLocationCopy.filter(location => location.pseudo != newLocation.pseudo);
      listLocationCopy.push(newLocation);
      setListLocation(listLocationCopy);
    });
  }, [listLocation]);

  var markerListLocation = listLocation.map((location, i)=>{
    return <Marker 
              key={i} 
              pinColor="green" 
              title={location.pseudo}
              coordinate={{latitude: location.latitude, longitude: location.longitude}}
            />
  });

  // UPDATE TEMP POI
  
  var selectPOI = (e) => {
    if(addPOI){
      setAddPOI(false);
      setIsVisible(true);
      setTempPOI({latitude: e.nativeEvent.coordinate.latitude, longitude:e.nativeEvent.coordinate.longitude});
    }
  }

  // UPDATE POI LIST STATE & EMPTY TEMP POI

  var handleSubmit = () => {
    var copyListPOI = [...listPOI, {longitude: tempPOI.longitude, latitude: tempPOI.latitude, title: titlePOI, description: descPOI}];
    setListPOI(copyListPOI);
    AsyncStorage.setItem("listPOI", JSON.stringify(copyListPOI));
    props.onSubmitPOI(tempPOI, titlePOI, descPOI);

    setIsVisible(false);
    setTempPOI();
    setDescPOI();
    setTitlePOI();
  }
  
  // GET POI LIST FROM LOCAL STORAGE

  useEffect(() => {
    AsyncStorage.getItem("listPOI", function(error, data){
      var poiData = JSON.parse(data);
      if(data) {
        setListPOI(poiData);
      }
    })
  }, []);

  // GET POI LIST FROM LOCAL STORAGE IF POI HAVE BEEN DELETED

  useEffect(() => {
    AsyncStorage.getItem("listPOI", function(error, data){
      var poiData = JSON.parse(data);
      if(data) {
        setListPOI(poiData);
      }
    })
  }, [props.poi]);
 
  // POI MARKER MAPPING

  var markerPOI = listPOI.map((POI, i)=>{
    return <Marker 
              key={i} 
              pinColor="blue" 
              coordinate={{latitude: POI.latitude, longitude: POI.longitude}}
              title={POI.title}
              description={POI.description}
            />
  });

  // ADD POI BUTTON DISABLING

  var isDisabled = false;
  if(addPOI) {
    isDisabled = true;
  }

  // CALLBACK

  return (
    <View style={{flex : 1}} >

      <Overlay
        overlayStyle={{width:'75%', height:'75%'}} 
        isVisible={isVisible}
        onBackdropPress={() => {setIsVisible(false)}}
      >
        <View>
          <Input
            containerStyle = {{marginBottom: 25}}
            placeholder='title'
            onChangeText={(val) => setTitlePOI(val)}
          />
          <Input
            containerStyle = {{marginBottom: 25}}
            placeholder='description'
            onChangeText={(val) => setDescPOI(val)}
          />
          <Button
            title= "Add POI"
            buttonStyle={{backgroundColor: "#eb4d4b"}}
            onPress={() => {handleSubmit()}}
            type="solid"
          />
        </View>
      </Overlay>

      <MapView 
        onPress={(e) => {selectPOI(e)}}
        style={{flex : 1}} 
        initialRegion={{
          latitude: 48.866667,
          longitude: 2.333333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker key={"currentPos"}
            pinColor="red"  
            title="Hello"
            description="I am here"
            coordinate={{latitude: currentLocation.latitude, longitude: currentLocation.longitude}}
        />  
        {markerListLocation} 
        {markerPOI}
      </MapView>

      <Button 
        disabled={isDisabled}
        title=" Add POI" 
        icon={
          <Icon
          name="map-marker"
          size={20}
          color="#ffffff"
          />
        } 
        buttonStyle={{backgroundColor: "#eb4d4b"}}
        type="solid"
        onPress={()=>setAddPOI(true)} 
      />

    </View>
  );
}

// REDUX 

function mapStateToProps(state) {
  return {poi: state.poi}
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmitPOI: function(tempPOI, titlePOI, descPOI) {
      dispatch( {type: 'savePOI', latitude: tempPOI.latitude, longitude: tempPOI.longitude, title: titlePOI, description: descPOI} )
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapScreen);
