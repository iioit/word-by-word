/* @flow */

import React, { Component } from 'react';
import { TouchableOpacity, AsyncStorage } from 'react-native';
import { withRouter } from 'react-router-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  flex-direction:row;
  justify-content:center;
  align-items:flex-start;
  margin-bottom:0;
`;
const TexturedContainer = styled.Image`
  flex:1;
  flex-direction:column;
  background-color:transparent;
  justify-content: space-around;
  align-items: center;
  resize-mode:cover;
  padding:0 30;
`;
const ButtonContainer = styled.View`
  flex-direction:row;
  background-color:#354259;
  border: 1 solid #354259; 
  border-radius:8;
  width: 200;
  justify-content:center;
  align-items:center;
  margin-top:25;
`;
const ButtonContainer2 = styled(ButtonContainer)`
  background-color:#AE6C00;
  border: 1 solid #AE6C00; 
  margin-bottom:40;
  margin-top:20;
`;
const TextStyle = styled.Text`
  font-family: Montserrat-Light;
  font-size:18;
  text-align:center;
  padding:20 10 5;
`;
const TextStyle2 = styled(TextStyle)`
  padding:0 10 0;
`;
const LinkText = styled.Text`
  padding:15;
  font-size:16;
  text-align:center;
  color:#fff;
  font-family: Montserrat-Light;
`;
const Icon = styled.Image`
    flex:1;
    border-radius:8;
    height:200;
    resize-mode:contain;
    justify-content:center;
    align-self:center;
`;

class FirstTimeMenu extends Component {
  props: {
    history:Object
  };

  checkIn:Function;

  constructor(){
    super();
  }

  checkIn(location){
    AsyncStorage.setItem('checkedIn', JSON.stringify(true));
    this.props.history.push(location);
  }

  render(){
    return(
      <TexturedContainer source={require('../../assets/images/texture_9.png')} style={{height:undefined, width:undefined}} >
        <Container>
          <Icon source={require('../../assets/images/head_white.png')} />
        </Container>
        <TextStyle>
          {`It looks like this is your\nfirst time here.`}
        </TextStyle>
        <TextStyle2>
          Would you like to...
        </TextStyle2>
        <ButtonContainer>
          <TouchableOpacity onPress={this.checkIn.bind(this, '/login')}><LinkText>SIGN IN</LinkText></TouchableOpacity>
        </ButtonContainer>
        <ButtonContainer2>
          <TouchableOpacity onPress={this.checkIn.bind(this, '/')}><LinkText>BROWSE STORIES</LinkText></TouchableOpacity>
        </ButtonContainer2>
      </TexturedContainer>
    );
  }
}

export default withRouter(FirstTimeMenu);
