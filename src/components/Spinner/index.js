/* @flow */

import React from 'react';
import styled from 'styled-components/native';

const Button = styled.Image`
  border-radius: 50;
  height: 70;
  width: 70;
`;

const Spinner = () => (
  <Button source={require('../../assets/images/loader_quick.gif')}/>
);

export default Spinner;