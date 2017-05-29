/* @flow */

import React, { Component } from 'react';
import { TouchableOpacity, AsyncStorage } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import styled from 'styled-components/native';
import Story from '../Story';
import Toolbar from '../ToolBar';

const TexturedContainer = styled.Image`
  flex:1;
  background-color:transparent;
  justify-content: center;
  align-items: center;
  resize-mode:cover;
`;
const Container = styled.View`
  flex: 1;
  flex-direction:column;
`;
const TextContainer = styled(Container)`
  justify-content:flex-end;
  align-items: center;
  margin-bottom:20;
  padding:40;
`;
const ButtonContainer = styled.View`
  flex-direction:row;
  margin-bottom:70;
  background-color:#354259;
  border-radius:8;
  width: 200;
  justify-content:center;
  align-items:center;
`;
const LinkText = styled.Text`
  padding:15;
  font-size:16;
  text-align:center;
  color:#fff;
  font-family: Montserrat-Light;
`;
const BackButtonContainer = styled.View`
  position:absolute;
  top:0;
  left:0;
`;
const BackButton = styled.Image`
  transform: scale(0.8, 0.8) rotate(180deg);
  margin-top:-20;
`;
const Description = styled.Text`
    color: #354259;
    font-size:20;
    text-align:center;
    font-family: Montserrat-Light;
`;
const Description2 = styled(Description)`
    font-size:36;
    font-family: LibreBaskerville-Regular;
    padding: 20 0;
`;
const Description3 = styled(Description)`
    color: #354259;
    text-align:center;
    font-family: Montserrat-ExtraLight;
`;

class CreateStory extends Component {
  props: {
    codeWord:string,
    storyId:string,
    history:Object,
  };

  onStartButtonPressed: Function;

  constructor(){
    super();

    this.onStartButtonPressed = this.onStartButtonPressed.bind(this);
  }

  onStartButtonPressed(){

    //set code word with 'true' value, which defines that this player has the first turn
    AsyncStorage.setItem(this.props.codeWord, JSON.stringify(true));
    this.props.history.push(`/load/${this.props.codeWord}`);
  }

  render() {
    const { codeWord } = this.props;

    return (
      <TexturedContainer source={require('../../assets/images/texture_9.png')} style={{height:undefined, width:undefined}}>
        <TextContainer>
          <Description>Your code word is</Description>
          <Description2>{(codeWord).toUpperCase()}</Description2>
          <Description3>Have your partner enter the code word on their phone</Description3>
        </TextContainer>

        <TouchableOpacity onPress={this.onStartButtonPressed}>
          <ButtonContainer><LinkText>LET&#39;S PLAY</LinkText></ButtonContainer>
        </TouchableOpacity>

        <BackButtonContainer>
          <Link to="/theme" component={TouchableOpacity}><BackButton source={require('../../assets/images/arrows/arrow_noBG_yellow.png')}/></Link>
        </BackButtonContainer>

        <Toolbar />
      </TexturedContainer>
    );
  }
}

export default withRouter(CreateStory);