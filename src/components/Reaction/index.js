/* @flow */

import React, { Component } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';

const Button = styled.Image`
  height: 40;
  width: 40;
  margin-left:10;
  resize-mode: contain;
`;

class Reaction extends Component {
  props: {
    type:string
  };

  render(){
    let emojiSource;
    if(this.props.type == 'funny') {
      emojiSource = require('../../assets/images/emojis/emoji_lol.png')
    }else if(this.props.type == 'love'){
      emojiSource = require('../../assets/images/emojis/emoji_love.png')
    }else{
      emojiSource = require('../../assets/images/emojis/emoji_shocked.png')
    }
    return(
      <TouchableWithoutFeedback >
        <Button source={emojiSource}/>
      </ TouchableWithoutFeedback >
    )
  }
}

export default Reaction;