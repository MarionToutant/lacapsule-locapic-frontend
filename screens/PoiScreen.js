import React, {useState, useEffect} from 'react';
import {AsyncStorage, View, ScrollView} from 'react-native';
import {Text, ListItem} from 'react-native-elements';

import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';

function PoiScreen(props) {
 
  const [listPOI, setListPOI] = useState([]);

  // GET POI LIST FROM LOCAL STORAGE
  
  useEffect(() => {
    AsyncStorage.getItem("listPOI", function(error, data){
      var poiData = JSON.parse(data);
      if(data) {
        setListPOI(poiData);
      }
    })
  }, [listPOI]);

  // DELETE POI

  var deletePOI = (i) => {
    listPOI.splice(i, 1);
    AsyncStorage.setItem("listPOI", JSON.stringify(listPOI));
    props.onDeletePOI(i);
  }

  // POI LIST ITEM

  if(listPOI.length > 0) {
    var listItemPOI = listPOI.map(function(poi, i) {
      return <ListItem key={i} title={poi.title} subtitle={poi.description} rightElement={<Icon onPress={() => deletePOI(i)} name='trash' size={20} color='black' />}/>;
    }) 
  } else {
    listItemPOI = <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop:40}}><Text style={{fontStyle:'italic'}}>No POI found</Text></View>; 
  }

  // CALLBACK

  return (
    <View style={{flex:1}}>
      <ScrollView  style={{flex:1, marginTop: 25}}>
        {listItemPOI}
      </ScrollView >
    </View>
  );
}

// REDUX

function mapDispatchToProps(dispatch){
  return {
    onDeletePOI: function(i){
      dispatch({type: 'deletePOI', position: i})
    }
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(PoiScreen);

