/* @flow */

import React, { Component } from 'react';
import { TouchableOpacity, NetInfo, Alert } from 'react-native';
import styled from 'styled-components/native';
import { withRouter } from 'react-router-native';

const TexturedContainer = styled.Image`
  flex:1;
  background-color:transparent;
  justify-content: center;
  align-items: center;
  resize-mode:cover;
  padding:0;
`;
const TextStyle = styled.Text`
  padding: 20;
  font-family: Montserrat-Light;
  font-size:20;
  text-align:center;
  padding-bottom:50;
`;
const ButtonContainer = styled.View`
  flex-direction:row;
  margin:10;
  background-color:#354259;
  border-radius:8;
  justify-content:center;
  align-items:center;
  align-self:center;
`;
const LinkText = styled.Text`
  padding:10 40;
  font-size:16;
  text-align:center;
  color:#fff;
  font-family: Montserrat-Light;
`;
class ErrorScreen extends Component {
  props: {
    history:Object
  };

  refetchStories:Function;

  constructor() {
    super();

    this.refetchStories = this.refetchStories.bind(this);
  }

  refetchStories(){
    NetInfo.isConnected.fetch().done(
      (connectionInfo) => {
        if(connectionInfo){
          this.props.history.push("/");
        }else{
          Alert.alert("Live in the now and connect to the Internet, por favor!");
        }
      }
    );
  }

  render() {
    return (
      <TexturedContainer source={require('../../assets/images/texture_9.png')} style={{height:undefined, width:undefined}} >
        <TextStyle>
          An unexpected error occurred
        </TextStyle>
        <ButtonContainer>
          <TouchableOpacity onPress={this.refetchStories}><LinkText>REFRESH</LinkText></TouchableOpacity>
        </ButtonContainer>
      </TexturedContainer>
    );
  }
}

export default withRouter(ErrorScreen);