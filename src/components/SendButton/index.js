/* @flow */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

type Props = {
  onPress: Function,
};

const Button = styled.Image`
  border-radius: 35;
  height: 70;
  width: 70;
`;

const CancelButton = ({ onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <Button source={require('../../assets/images/arrows/arrow_2.png')} />
  </TouchableOpacity>
);

export default CancelButton;