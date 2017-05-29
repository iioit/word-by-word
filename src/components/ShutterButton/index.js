/* @flow */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

type Props = {
  onPress: Function,
  opacity: number
};

const Button = styled.Image`
  border-radius: 35;
  height: 70;
  width: 70;
  margin: 40;
`;

const ShutterButton = ({ onPress, opacity }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <Button source={require('./shutter.png')} style={{opacity: opacity}} />
  </TouchableOpacity>
);

export default ShutterButton;
