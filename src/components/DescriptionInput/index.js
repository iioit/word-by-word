/* @flow */

import React, { Component } from 'react';
import styled from 'styled-components/native';

const Input = styled.TextInput`
  font-family: Montserrat-Light;
  font-size:14;
  color: #fff;
  background-color: rgba(0, 18, 32, 0.7);
  align-self: stretch;
  padding-right: 10;
  padding-left: 10;
  top:0;
  left:0;
  right:0;
  height:60;
`;

class DescriptionInput extends Component {
  props: {
    value: string,
    placeholder: string,
    editable: boolean,
    handleTextChange: Function,
    handleSubmitEditing?: null,
    passedRef?: Function,
    autoFocus: boolean,
    inputOpacity: number,
    autoCapitalize: string,
    onSelectionChange: Function,
    selection: {
      start:number,
      end:number,
    }
  };

  render() {
    const {
      value,
      placeholder,
      handleTextChange,
      editable,
      handleSubmitEditing,
      passedRef,
      autoFocus,
      inputOpacity,
      onSelectionChange,
      selection,
      autoCapitalize
    } = this.props;

    return (
      <Input
        innerRef={passedRef}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        returnKeyType='send'
        value={value}
        onChangeText={handleTextChange}
        editable={editable}
        onSubmitEditing={handleSubmitEditing}
        autoCapitalize={autoCapitalize}
        autoFocus={autoFocus}
        underlineColorAndroid="#AE6C00"
        style={{opacity:inputOpacity}}
        onSelectionChange={onSelectionChange}
        selection={selection}
      />
    );
  }
}

export default DescriptionInput;
