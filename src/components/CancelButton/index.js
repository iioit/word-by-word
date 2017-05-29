/* @flow */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

type Props = {
  onPress: Function,
};

const ButtonWrapper = styled.View`
  background-color:rgba(53,66,89,0.7);
  border-radius:50;
  padding: 5;
`;
const Button = styled.Image`
  height: 25;
  width: 25;
`;

const CancelButton = ({ onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <ButtonWrapper>
      <Button source={require('./CancelButton.png')} />
    </ButtonWrapper>
  </TouchableOpacity>
);

export default CancelButton;
