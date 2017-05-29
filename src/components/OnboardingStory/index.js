/* @flow */

import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import OnboardingEntryList from '../OnboardingEntryList';
import styled from 'styled-components/native';
import ErrorScreen from '../ErrorScreen';
import LoaderWithBackground from '../LoaderWithBackground';
import Toolbar from '../ToolBar';

const StoryContainer = styled.View`
  flex: 1;
`;
const ToolbarWrapper = styled(Animated.View)`
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  height:50;
`;

class OnboardingStory extends Component {
  props: {
    storyKey:string,
    StoryQuery: {
      Story: {
        entries: Array<Object>,
        id: string,
      },
    },
  };

  state: {
    animateIn:Object
  };

  toolbarIn:Function;

  constructor() {
    super();

    this.state = {
      animateIn: new Animated.Value(100),
    };

    this.toolbarIn = this.toolbarIn.bind(this);
  }

  componentDidMount(){
    setTimeout(()=>{this.toolbarIn()}, 500);
  }

  toolbarIn(){
    Animated.timing(
      this.state.animateIn,
      {
        toValue: 0,
        duration: 1000,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();
  }

  render() {
    const { StoryQuery, storyKey } = this.props;

    if (StoryQuery.loading) {
      return (
        <LoaderWithBackground/>
      );
    }

    if (StoryQuery.error) {
      return (
        <ErrorScreen />
      );
    }

    return (
      <StoryContainer>
        <OnboardingEntryList entries={StoryQuery.Story.entries} storyId={StoryQuery.Story.id} storyKey={storyKey} />
        <ToolbarWrapper style={{transform:[{translateY:this.state.animateIn}]}}>
          <Toolbar />
        </ToolbarWrapper>
      </StoryContainer>
    );
  }
}

const StoryForId = gql`query
  StoryForId($id: ID!) {
    Story(id: $id) {
      entries(orderBy: createdAt_ASC) {
        id
        description
        file {
          url
        }
      }
      id
    }
  }
`;

export default graphql(StoryForId, { name: 'StoryQuery' })(OnboardingStory);

