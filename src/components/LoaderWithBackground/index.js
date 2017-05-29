/* @flow */

import React from 'react';
import styled from 'styled-components/native';
import LoaderQuick from '../LoaderQuick';

const TexturedContainer = styled.Image`
  flex:1;
  flex-direction:column;
  background-color:transparent;
  justify-content: space-around;
  align-items: center;
  resize-mode:cover;
  padding:0 5 15;
`;

const LoaderWithBackground = () => (
  <TexturedContainer source={require('../../assets/images/texture_9.png')} style={{height:undefined, width:undefined}} >
    <LoaderQuick />
  </TexturedContainer>
);

export default LoaderWithBackground;
