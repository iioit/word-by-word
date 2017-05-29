/* @flow */

import React, { Component } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import DescriptionInput from '../DescriptionInput';

const Group = styled.View`
  flex:1;
`;
const FirstInput = styled(DescriptionInput)`
`;
const LastInput = styled(DescriptionInput)`
`;

class InputGroup extends Component {
  props: {
    values: {
      'firstInput': string,
      'lastInput': string,
    },
    handleTextChange: Function,
    handleSubmitEditing: Function,
    editable: boolean,
  };

  state: {
    lastInputVisibility:number,
    firstInputVisibility:number,
    selection:{
      start:number,
      end:number
    },
  };

  firstInput: Object;
  lastInput: Object;
  updateVisibility: Function;
  onSelectionChangeLast: Function;

  constructor(){
    super();

    this.state = {
      lastInputVisibility:0,
      firstInputVisibility:1,
      selection: {start: 0, end: 0},
    }

    this.updateVisibility = this.updateVisibility.bind(this);
    this.onSelectionChangeLast = this.onSelectionChangeLast.bind(this);
  }

  updateVisibility(){
    if(this.props.values.firstInput.length != 0) {
      this.setState({
        lastInputVisibility:1,
        firstInputVisibility:0.3,
      });
    } else {
      Alert.alert(
        'Hey there,',
        'please, complete your story line.',
      );
    }
  }

  onSelectionChangeLast({nativeEvent: {selection}}:Object) {
    if(this.props.values.lastInput.length > 0 && selection.start == this.props.values.lastInput.length){
      let selectionPosition = this.props.values.lastInput.length - 3;
      this.setState({selection:{start:selectionPosition, end:selectionPosition}});
    } else {
      this.setState({selection});
    }
  }

  render() {
    const { values, handleTextChange, editable, handleSubmitEditing } = this.props;
    const { firstInputVisibility, lastInputVisibility, selection } = this.state;

    return (
      <Group>
        <FirstInput
          placeholder="… finish the sentence from the previous photo."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          returnKeyType={"next"}
          autoFocus={true}
          value={values.firstInput}
          handleTextChange={handleTextChange.bind(this, 'firstInput')}
          handleSubmitEditing={() => {
            this.updateVisibility();
            if(values.firstInput.length != 0){
              this.lastInput && this.lastInput.focus();
            }
          }}
          editable={editable}
          inputOpacity={firstInputVisibility}
          autoCapitalize="none"
        />
        <LastInput
          passedRef={input => { this.lastInput = input; }}
          placeholder="Start a sentence for your partner to finish …"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={values.lastInput}
          handleTextChange={handleTextChange.bind(this, 'lastInput')}
          editable={editable}
          inputOpacity={lastInputVisibility}
          onSelectionChange={this.onSelectionChangeLast}
          selection={selection}
          autoCapitalize="sentences"
          handleSubmitEditing={handleSubmitEditing}
        />
      </Group>
    );
  }
}

export default InputGroup;
