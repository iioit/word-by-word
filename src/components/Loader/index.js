/* @flow */

import React from 'react';
import styled from 'styled-components/native';

const LoaderIcon = styled.Image`
  height: 100;
  width: 100;
`;

const Loader = () => (
  <LoaderIcon source={require('../../assets/images/loader.gif')} />
);

export default Loader;
