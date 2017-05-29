/* @flow */

import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components/native';
import StoryInGallerySingleEntryList from '../StoryInGallerySingleEntryList/index';
import LoaderWithBackground from '../LoaderWithBackground';
import ErrorScreen from '../ErrorScreen';

const StoryContainer = styled.View`
  flex: 1;
`;

class Story extends Component {
  props: {
    id: string,
    firstPlayer: boolean,
    storyKey: string,
    StoryQuery: {
      Story: {
        entries: Array<Object>,
        id: string,
        reactions: {
          id:string,
          funny:boolean,
          shocked:boolean,
          love:boolean
        },
      },
      subscribeToMore: Function,
    },
  };

  state: {
    swipeIndex: number,
    isFirstPlayer: boolean,
  };

  reactionSubscription: Function;

  constructor() {
    super();

    this.state = {
      swipeIndex: 0,
      isFirstPlayer: false,
    };
  }

  componentDidMount() {
    this.reactionSubscription = this.props.StoryQuery.subscribeToMore({
      document: gql`
        subscription{
          Reaction(filter:{
            node:{
              story:{
                id:"${this.props.id}"
              }
            }
            mutation_in:[UPDATED,CREATED]
          }){
            mutation node{
                id,
                funny,
                love,
                shocked
            }
          }
        }
      `,
      variables: null,
      updateQuery: (previousState, { subscriptionData }) => {
        if (subscriptionData.data.Reaction.mutation === 'CREATED') {
          const newReaction= subscriptionData.data.Reaction.node;
          const reactions = previousState.Story.reactions.concat([newReaction]);
          return {
            Story: {
              reactions,
              id:previousState.Story.id,
              entries:previousState.Story.entries,
              __typename:previousState.Story.__typename
            },
          };
        } else if (subscriptionData.data.Reaction.mutation === 'UPDATED') {
          const reactions = previousState.Story.reactions.slice();
          const updatedReaction = subscriptionData.data.Reaction.node;
          const reactionIndex = reactions.findIndex(
            reaction => updatedReaction.id === reaction.id
          );
          reactions[reactionIndex] = updatedReaction;

          return {
            Story: {
              reactions,
              id:previousState.Story.id,
              entries:previousState.Story.entries,
              __typename:previousState.Story.__typename
            },
          };
        }
        return previousState;
      },
    });
  }

  componentWillUnmount(){
    this.reactionSubscription();
  }


  render() {
    const { StoryQuery, storyKey } = this.props;
    const { swipeIndex, isFirstPlayer } = this.state;

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
        <StatusBar hidden />
        <StoryInGallerySingleEntryList entries={StoryQuery.Story.entries} reactions={StoryQuery.Story.reactions} storyId={StoryQuery.Story.id} storyKey={storyKey} swipeIndex={swipeIndex} firstPlayer={isFirstPlayer} />
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
      reactions{
        id
        funny
        shocked
        love
      }
    }
  }
`;

export default graphql(StoryForId, { name: 'StoryQuery' })(Story);
