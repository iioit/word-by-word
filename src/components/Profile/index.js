/* @flow */

import React, { Component } from 'react';
import { TouchableOpacity, AsyncStorage, Animated, Easing } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-native';
import styled from 'styled-components/native';
import ErrorScreen from '../ErrorScreen';
import MainMenuNotLoggedInScreen from '../MainMenuNotLoggedInScreen';
import LoaderWithBackground from '../LoaderWithBackground';
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
  background-color:#fff;
  border: 1 solid #354259; 
  border-radius:8;
  width: 200;
  justify-content:center;
  align-items:center;
  margin-top:0;
  margin-bottom:70;
`;
const ButtonContainer2 = styled(ButtonContainer)`
  background-color:#AE6C00;
  border: 1 solid #AE6C00; 
  margin-bottom:20;
`;
const LinkText = styled.Text`
  padding:15;
  font-size:16;
  text-align:center;
  color:#fff;
  font-family: Montserrat-Light;
`;
const LinkText2 = styled(LinkText)`
  color:#354259;
`;
const Icon = styled.Image`
  flex:1;
  border-radius:8;
  height:200;
  resize-mode:contain;
  justify-content:center;
  align-self:center;
`;
const ToolbarWrapper = styled(Animated.View)`
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  height:50;
`;

class Profile extends Component {
  props: {
    location:Object,
    history:Object,
    data:Object,
    updateUserId:Function,
  };

  state:{
    animateIn:Object,
  };

  onLogOutButtonPressed:Function;
  showMyStories:Function;
  toolbarIn:Function;

  constructor(){
    super();

    this.state = {
      animateIn: new Animated.Value(100),
    };

    this.onLogOutButtonPressed = this.onLogOutButtonPressed.bind(this);
    this.showMyStories = this.showMyStories.bind(this);
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

  onLogOutButtonPressed(){
    AsyncStorage.removeItem('auth0IdToken');

    this.props.history.push('/');
  }

  showMyStories(){
    this.props.updateUserId(this.props.data.user.id);
    this.props.history.push('/mystories');
  }

  render(){
    if (this.props.data.loading) {
      return (
        <LoaderWithBackground/>
      );
    }

    if (this.props.data.error) {
      return (
        <ErrorScreen />
      );
    }

    if (this.props.data.user === null){
      return <MainMenuNotLoggedInScreen location={this.props.location.pathname} />
    }

    return(
      <TexturedContainer source={require('../../assets/images/texture_9.png')} style={{height:undefined, width:undefined}} >
        <Container>
          <Icon source={require('../../assets/images/head_white.png')} />
        </Container>
        <TouchableOpacity onPress={this.showMyStories}>
          <ButtonContainer2><LinkText>MY STORIES</LinkText></ButtonContainer2>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onLogOutButtonPressed}>
          <ButtonContainer><LinkText2>LOG OUT</LinkText2></ButtonContainer>
        </TouchableOpacity>
        <ToolbarWrapper style={{transform:[{translateY:this.state.animateIn}]}}>
          <Toolbar />
        </ToolbarWrapper>
      </TexturedContainer>
    );
  }
}

const userQuery = gql`
  query userQuery {
    user {
      id
    }
  }
`;

export default graphql(userQuery, { options: { fetchPolicy: 'network-only' }})(withRouter(Profile))
