/* @flow */

import React, { Component } from 'react';
import { TouchableWithoutFeedback, Keyboard, Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import SendButton from '../SendButton';
import CancelButton from '../CancelButton';
import OnboardingInputGroup from '../OnboardingInputGroup';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
`;
const TopBar = styled.View`
  flex-direction: row;
  padding: 10;
  justify-content: space-between;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 11;
`;
const BottomBar = styled.View`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  flex-shrink: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 35 10 10;
  z-index:13;
`;
const Preview = styled.Image`
  flex: 1;
`;
const PreviousEntryText = styled.Text`
  font-family: Montserrat-Light;
  font-size:14;
  color: #fff;
  background-color: rgba(174, 108, 0, .7);
  border: 1 solid rgba(0, 18, 32, 0.7);
  padding: 10;
  margin:0 30 0;
  align-self:stretch;
  border-radius:8;
`;
const Tip = styled.View`
  left:60;
  margin-left: -10;
  border-width: 10;
  border-style: solid;
  border-top-color: rgba(0, 18, 32, 0.7);
  border-bottom-color: transparent;
  border-right-color: transparent;
  border-left-color: transparent;
  width:20;
  height:20;
  margin-bottom:1;
`;
const KeyboardAvoidingViewWithStyle = styled.View`
  flex:1;
  flex-direction:column;
  position:absolute;
  top:100;
  left:0;
  right:0;
  z-index:12;
`;
const SendBubble = styled(Animated.View)`
  border-radius: 50;
  height: 80;
  width: 80;
  background-color:rgba(255, 255, 255, 0.5);
  position:absolute;
  bottom:5;
  right:5;
`;

class OnboardingEntryPreview extends Component {
  props: {
    handleCancelPress: Function,
    handleSubmit: Function,
    photoPreview: {
      uri: string,
    },
    previousEntryText: string,
  };
  blinkShutter:Function;
  animatedValue: Object;

  constructor() {
    super();

    this.animatedValue = new Animated.Value(0);
    this.blinkShutter = this.blinkShutter.bind(this);
  }

  componentDidMount(){
    setTimeout(()=>{this.blinkShutter()}, 3000);
  }

  blinkShutter(){
    this.animatedValue.setValue(0);
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start(() => {
      setTimeout(()=>{this.blinkShutter()}, 50);
    });
  }

  render() {
    const { handleCancelPress, handleSubmit, photoPreview, previousEntryText } = this.props;
    const blink = this.animatedValue.interpolate({
      inputRange:[0, 0.5, 1],
      outputRange:[0,1.1, 1.8]
    });
    const opacityBlink = this.animatedValue.interpolate({
      inputRange:[0, 0.2, 0.8, 1],
      outputRange:[0, 1, 1, 0]
    });

    return (
      <Container>
        <TopBar>
          <CancelButton onPress={handleCancelPress} />
        </TopBar>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Preview source={photoPreview} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingViewWithStyle behaviour="padding">
          <PreviousEntryText>{previousEntryText}</PreviousEntryText>
          <Tip />
          <OnboardingInputGroup editable={false} />
        </KeyboardAvoidingViewWithStyle>

        <BottomBar>
          <SendButton onPress={handleSubmit} />
          <TouchableWithoutFeedback onPress={handleSubmit}>
          <SendBubble style={{ opacity:opacityBlink, transform:[{scale:blink}] }} />
          </TouchableWithoutFeedback>
        </BottomBar>
      </Container>
    );
  }
}

export default OnboardingEntryPreview;
