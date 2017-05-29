/* @flow */

import React, { Component } from 'react';
import { TouchableOpacity, Animated, Easing } from 'react-native';
import { Link } from 'react-router-native';
import styled from 'styled-components/native';
import Toolbar from '../ToolBar';

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
  padding:0 5 15;
`;
const ButtonContainer = styled.View`
  flex-direction:row;
  background-color:#354259;
  border: 1 solid #354259; 
  border-radius:8;
  width: 200;
  justify-content:center;
  align-items:center;
  margin-top:30;
  margin-bottom:60;
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
const Message = styled.Text`
  color: #354259;
  font-family: Montserrat-Light;
  font-size:18;
  padding-top:20;
  text-align:center;
`;
const ToolbarWrapper = styled(Animated.View)`
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  height:50;
`;

class MainMenu extends Component {
  state:{
    animateIn:Object
  };

  toolbarIn:Function;

  constructor(){
    super();

    this.state = {
      animateIn: new Animated.Value(100),
    };

    this.toolbarIn = this.toolbarIn.bind(this);
  }

  componentDidMount(){
    setTimeout(()=>{this.toolbarIn()}, 500);
  }

  toolbarIn(){
    Animated.timing(
      this.state.animateIn,
      {
        toValue: 0,
        duration: 1000,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();
  }

  render(){
    return(
      <TexturedContainer source={require('../../assets/images/texture_9.png')} style={{height:undefined, width:undefined}} >
        <Container>
          <Icon source={require('../../assets/images/head_white.png')} />
        </Container>

        <Message>Please, sign in to continue.</Message>

        <Link to="/login" component={TouchableOpacity}>
          <ButtonContainer><LinkText>SIGN IN</LinkText></ButtonContainer>
        </Link>

        <ToolbarWrapper style={{transform:[{translateY:this.state.animateIn}]}}>
          <Toolbar />
        </ToolbarWrapper>
      </TexturedContainer>
    );
  }
}

export default MainMenu;
