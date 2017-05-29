/* @flow */

import React, { Component } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View, AsyncStorage } from 'react-native';
import styled from 'styled-components/native';
import { Link, withRouter } from 'react-router-native';

const ToolbarWrapper = styled.View`
  background-color:#354259;
  flex-direction:row;
  justify-content:space-around;
  align-items:flex-end;
  border-top-width:2;
  border-top-color:#9b6103;
  border-style:solid;
`;
const ToolbarItem = styled.View`
  flex-direction:column;
  align-items:center;
  justify-content:center;
  padding:5;
  flex:0.25;
`;
const ToolbarItemText = styled.Text`
  color:white;
  align-self:center;
`;
const ToolbarItemIcon = styled.Image`
  align-self:center;
  height:20;
  width:20;
`;

class ToolBar extends Component {
  props: {
    history:Object,
    location:Object
  };

  state: {
    play:boolean,
    help:boolean,
    gallery:boolean,
    me:boolean,
    gameExists:boolean
  };

  checkForCurrentGame:Function;

  constructor(){
    super();

    this.state = {
      play:false,
      help:false,
      gallery:false,
      me:false,
      gameExists:false
    };

    this.checkForCurrentGame = this.checkForCurrentGame.bind(this);
  }

  checkForCurrentGame(){
    const { history, location } = this.props;
    let storyKey;

    AsyncStorage.getAllKeys((err, keys) => {
      keys.map(key => {
        if (key !== 'auth0IdToken' && key !== 'checkedIn') {
          this.setState({gameExists: true});
          storyKey = key;
        }
      });

      if(this.state.gameExists && location.pathname === '/onboard'){
        history.goBack();
      } else {
        history.push('/chooseaction');
      }
    });
  }

  render(){
    const { location } = this.props;
    let play, help, gallery, me;
    let reg = /^\/create/
    let create = location.pathname.match(reg) ? location.pathname : '';

    //signify the current location
    switch(location.pathname) {
      case '/':
        play = false;
        help = false;
        gallery = true;
        me = false;
        break;
      case '/onboard':
        play = false;
        help = true;
        gallery = false;
        me = false;
        break;
      case '/profile':
      case '/mystories':
        play = false;
        help = false;
        gallery = false;
        me = true;
        break;
      case '/chooseaction':
      case '/join':
      case create:
      case '/theme':
        play = true;
        help = false;
        gallery = false;
        me = false;
        break;
    }

    return(
      <ToolbarWrapper >
        <ToolbarItem style={play ? {backgroundColor:'#9b6103'} : ''}>
          <TouchableOpacity onPress={this.checkForCurrentGame} >
            <View>
              <ToolbarItemIcon source={require('../../assets/images/menu/play2.png')} />
              <ToolbarItemText>Play</ToolbarItemText>
            </View>
          </TouchableOpacity>
        </ToolbarItem>

        <ToolbarItem  style={help ? {backgroundColor:'#9b6103'} : ''}>
          <Link to="/onboard" component={ help ? TouchableWithoutFeedback : TouchableOpacity }>
            <View>
              <ToolbarItemIcon source={require('../../assets/images/menu/help2.png')} />
              <ToolbarItemText>Help</ToolbarItemText>
            </View>
          </Link>
        </ToolbarItem>

        <ToolbarItem style={gallery ? {backgroundColor:'#9b6103'} : ''}>
          <Link to="/" component={ gallery ? TouchableWithoutFeedback : TouchableOpacity }>
            <View>
              <ToolbarItemIcon source={require('../../assets/images/menu/gallery2.png')} />
              <ToolbarItemText>Gallery</ToolbarItemText>
            </View>
          </Link>
        </ToolbarItem>

        <ToolbarItem  style={me ? {backgroundColor:'#9b6103'} : ''}>
          <Link to="/profile" component={ me ? TouchableWithoutFeedback : TouchableOpacity }>
            <View>
              <ToolbarItemIcon source={require('../../assets/images/menu/me2.png')} />
              <ToolbarItemText>Me</ToolbarItemText>
            </View>
          </Link>
        </ToolbarItem>

      </ToolbarWrapper>
    );
  }
}

export default withRouter(ToolBar);
