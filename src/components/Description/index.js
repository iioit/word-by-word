/* @flow */

import React, { Component } from 'react';
import styled from 'styled-components/native';

const StyledDescription = styled.Text`
  background-color: rgba(0,0,0,0.5);
  padding: 10;
  color: #fff;
`;

class Description extends Component {
  props: {
    description: string,
  };

  render() {
    const { description } = this.props;

    return (
      <StyledDescription>
        {description}
      </StyledDescription>
    );
  }
}

export default Description;
