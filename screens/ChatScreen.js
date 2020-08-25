import React, {useState, useEffect} from 'react';
import {AsyncStorage, View, ScrollView, KeyboardAvoidingView} from 'react-native';
import {ListItem, Button, Input} from 'react-native-elements';

import Icon from 'react-native-vector-icons/FontAwesome'

import socketIOClient from "socket.io-client";

const dotenv = require("dotenv");
dotenv.config();

var socket = socketIOClient(process.env.REACT_NATIVE_QUOTAGUARDSTATIC_URL, { forceNode: true });

export default function ChatScreen() {

  const [currentMessage, setCurrentMessage] = useState();
  const [listMessage, setListMessage] = useState([]);
  const [pseudoLocalStorage, setPseudoLocalStorage] = useState('');

  // WEBSOCKET RECEPTION

  socket.on('sendMessageToAll', (newMessageData)=> {    
    setListMessage([...listMessage, newMessageData]);  
  }); 

  // GET PSEUDO FROM LOCAL STORAGE
  
  useEffect(() => {
    AsyncStorage.getItem("pseudo", function(error, data){
      setPseudoLocalStorage(data);
    })
  }, []);

  // LIST ITEM MAPPING & REGEX

  var listItems = listMessage.map((messageData, i) => {
    var msg = messageData.message.replace(/:\)/g,"\u263A");
    msg = msg.replace(/:\(/g,"\u2639");
    msg = msg.replace(/:p/g,"\uD83D\uDE1B");
    msg = msg.replace(/fuck/ig,"\u2022\u2022\u2022\u2022");
    return <ListItem 
              key={i} 
              title={msg} 
              subtitle={messageData.pseudo} 
            />;
  }) 
 
  // CALLBACK

  return (
    <View style={{flex:1}}>
      <ScrollView  style={{flex:1, marginTop: 25}}>
        {listItems}
      </ScrollView >

      <KeyboardAvoidingView behavior="padding" enabled>
          <Input
              containerStyle = {{marginBottom: 5}}
              placeholder='Your message'
              onChangeText={(msg) => setCurrentMessage(msg)}
              value={currentMessage}
          />
          <Button
              icon={<Icon name="envelope-o" size={20} color="#ffffff"/>}
              title=" Send"
              buttonStyle={{backgroundColor: "#eb4d4b"}}
              type="solid"
              onPress={() => {socket.emit("sendMessage", {message: currentMessage, pseudo: pseudoLocalStorage}); setCurrentMessage('')}}
          />
      </KeyboardAvoidingView>
    </View>
  );
}
