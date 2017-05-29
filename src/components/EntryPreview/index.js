/* @flow */

import React, { Component } from 'react';
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import styled from 'styled-components/native';
import SendButton from '../SendButton';
import CancelButton from '../CancelButton';
import InputGroup from '../InputGroup';
import Spinner from '../Spinner';

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
  bottom: 30;
  left: 0;
  flex-shrink: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 10;
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

class EntryPreview extends Component {
  props: {
    handleCancelPress: Function,
    handleSubmit: Function,
    handleTextChange: Function,
    photoPreview: {
      uri: string,
    },
    photoSource: ?{
      uri: string,
    },
    inputValues: {
      'firstInput': string,
      'lastInput': string,
    },
    sending: boolean,
    previousEntryText: string,
  };

  render() {
    const {
      handleCancelPress,
      handleSubmit,
      photoPreview,
      photoSource,
      handleTextChange,
      inputValues,
      sending,
      previousEntryText
    } = this.props;

    return (
      <Container>
        <TopBar>
          <CancelButton onPress={handleCancelPress} />
        </TopBar>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Preview source={photoSource ? photoSource : photoPreview} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingViewWithStyle>
          <PreviousEntryText>{previousEntryText}</PreviousEntryText>
          <Tip />
          <InputGroup
            values={inputValues}
            editable={!sending}
            handleTextChange={handleTextChange}
            handleSubmitEditing={handleSubmit}
          />
        </KeyboardAvoidingViewWithStyle>

        <BottomBar>
          {sending ? <Spinner /> : <SendButton onPress={handleSubmit} />}
        </BottomBar>
      </Container>
    );
  }
}

export default EntryPreview;
