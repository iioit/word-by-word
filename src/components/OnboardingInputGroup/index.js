/* @flow */

import React, { Component } from 'react';
import styled from 'styled-components/native';
import DescriptionInput from '../DescriptionInput';

const Group = styled.View`
  flex:1;
`;
const FirstInput = styled(DescriptionInput)`
  font-size:12 !important;
`;
const LastInput = styled(DescriptionInput)`
`;

class OnboardingInputGroup extends Component {
  props: {
    editable: boolean,
  };

  render() {
    const { editable } = this.props;

    return (
      <Group>
        <FirstInput
          placeholder="… finish the sentence from the previous photo."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          autoFocus={false}
          editable={editable}
        />
        <LastInput
          placeholder="Start a sentence for your partner to finish …"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          editable={editable}
        />
      </Group>
    );
  }
}

export default OnboardingInputGroup;
