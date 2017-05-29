/* @flow */

import React, { Component } from 'react';
import { TouchableOpacity, Animated, Easing } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import styled from 'styled-components/native';
import Toolbar from '../ToolBar';
import MainMenuNotLoggedInScreen from '../MainMenuNotLoggedInScreen';
import LoaderWithBackground from '../LoaderWithBackground';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorScreen from '../ErrorScreen';

const TexturedContainer = styled.Image`
  flex:1;
  background-color:transparent;
  justify-content: center;
  align-items: center;
  resize-mode:cover;
  padding:0 20;
`;
const ButtonContainer = styled.View`
  flex-direction:row;
  margin-bottom:20;
  background-color:#fff;
  border: 1 solid #354259; 
  border-radius:8;
  width: 200;
  justify-content:center;
  align-items:center;
`;
const TextStyle = styled.Text`
  padding: 20;
  font-family: Montserrat-Light;
  font-size:20;
  text-align:center;
  padding-bottom:50;
  color:#354259;
`;
const LinkText = styled.Text`
  padding:15;
  font-size:16;
  text-align:center;
  color:#354259;
  font-family: Montserrat-Light;
`;
const ToolbarWrapper = styled(Animated.View)`
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  height:50;
`;

class ChooseAction extends Component {
  props: {
    location:Object,
    data:Object,
  };

  state: {
    animateIn: Object,
  };

  toolbarIn: Function;

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
    const { data, location } = this.props;

    if (data.loading) {
      return (
        <LoaderWithBackground />
      );
    }

    if (data.error) {
      return (
        <ErrorScreen />
      );
    }

    //if user is not logged in
    if (data.user === null){
      return <MainMenuNotLoggedInScreen location={location.pathname} />
    }

    return(
      <TexturedContainer source={require('../../assets/images/texture_9.png')} style={{height:undefined, width:undefined}} >
        <TextStyle>
          Out of you and your partner, who&#39;s closest to the ceiling?
        </TextStyle>

        <Link to="/theme" component={TouchableOpacity}><ButtonContainer><LinkText>ME ME ME</LinkText></ButtonContainer></Link>

        <Link to="/join" component={TouchableOpacity}><ButtonContainer><LinkText>NOT ME</LinkText></ButtonContainer></Link>

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

export default graphql(userQuery, { options: { fetchPolicy: 'network-only' }})(withRouter(ChooseAction));
