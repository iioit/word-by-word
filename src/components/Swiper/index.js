/* @flow */

import React from 'react';
import styled from 'styled-components/native';

const Bubble = styled.View`
  border-radius: 50;
  height: 40;
  width: 40;
  border: 3 solid #AE6C00;
  background-color:rgba(255, 255, 255, 0.7);
`;

const Swiper = () => (
  <Bubble />
);

export default Swiper;
