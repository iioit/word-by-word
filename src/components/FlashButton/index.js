/* @flow */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

type Props = {
  useFlash: boolean,
  onPress: Function,
};

const Button = styled.Image`
  height: 15;
  width: 15;
  padding: 20;
`;

const FlashButton = ({ useFlash, onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <Button
      source={useFlash ? require('./Flash.png') : require('./NoFlash.png')}
    />
  </TouchableOpacity>
);

export default FlashButton;
