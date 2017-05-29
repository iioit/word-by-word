/* @flow */

import React, { Component } from 'react';
import { Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components/native';

const Button = styled(Animated.Image)`
  width:50;
  height:50;
`;

class ReactionToVote extends Component {
  props: {
    VotesQuery: {
      id:string,
      funny:boolean,
      love:boolean,
      shocked:boolean,
      allReactions:Array<Object>,
      refetch:Function
    },
    type:string,
    updateVote:Function,
    vote: Function,
    userId: string,
    storyId: string
  };

  state: {
    clicked:boolean
  };

  animatedValue: Object;
  enlarge: Function;

  constructor(){
    super();

    this.state = { clicked:false };

    this.animatedValue = new Animated.Value(0);
    this.enlarge = this.enlarge.bind(this);
  }

  enlarge(){
    const { VotesQuery, type, updateVote, vote, userId, storyId } = this.props;

    this.animatedValue.setValue(1);
    Animated.spring(
      this.animatedValue,
      {
        toValue: 0,
        duration: 50,
      }
    ).start();

    VotesQuery.refetch().then((response)=> {
      switch(type) {
        case 'funny':
          (VotesQuery.allReactions.length != 0) ?
            (updateVote({
              variables: {
                id:VotesQuery.allReactions[0].id,
                funny:!VotesQuery.allReactions[0].funny
              }
            })
          ):(
            vote({
              variables: {
                userId: userId,
                storyId: storyId,
                funny: true,
              },
            })
          );
          break;
        case 'love':
          (VotesQuery.allReactions.length != 0) ?
            (updateVote({
                variables: {
                  id:VotesQuery.allReactions[0].id,
                  love:!VotesQuery.allReactions[0].love
                }
              })
            ):(
              vote({
                variables: {
                  userId: userId,
                  storyId: storyId,
                  love: true,
                },
              })
            );
          break;
        case 'shocked':
          (VotesQuery.allReactions.length != 0) ?
            (updateVote({
                variables: {
                  id:VotesQuery.allReactions[0].id,
                  shocked:!VotesQuery.allReactions[0].shocked
                }
              })
          ):(
              vote({
                variables: {
                  userId: userId,
                  storyId: storyId,
                  shocked: true,
                },
              })
          );
        break;
      }

      if(this.state.clicked){
        this.setState({clicked:false});
      }else{
        this.setState({clicked:true});
      }
    });
  }

  render(){
    let emojiSource;
    if(this.props.type == 'funny') {
      emojiSource = require('../../assets/images/emojis/emoji_lol.png');
    }else if(this.props.type == 'love'){
      emojiSource = require('../../assets/images/emojis/emoji_love.png');
    }else{
      emojiSource = require('../../assets/images/emojis/emoji_shocked.png');
    }

    const enlarge = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.4]
    });
    const shrink = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1.4, 1]
    });

    const xy = (this.state.clicked) ? shrink : enlarge;

    return(
      <TouchableWithoutFeedback onPress={this.enlarge}>
        <Button source={emojiSource} style={{transform:[{scale:xy}]}}/>
      </ TouchableWithoutFeedback >
    )
  }
}

const vote = gql`
  mutation($userId:ID!, $storyId: ID!, $funny:Boolean, $love:Boolean, $shocked:Boolean) {
    createReaction(userId:$userId, storyId:$storyId, funny:$funny, love:$love, shocked:$shocked){
      id
    }
  }
`;

const updateVote = gql`
  mutation($id:ID!, $funny:Boolean, $love:Boolean, $shocked:Boolean){
    updateReaction(id:$id,funny:$funny, love:$love, shocked:$shocked){
      id
    }
  }
`;
const queryVotes = gql`
  query userReactionsOnStory($userId:ID!, $storyId: ID!) {
    allReactions(filter: {
      user: {
        id: $userId
      },
      story: {
        id: $storyId
      }
    }) {
      id
      love
      funny
      shocked
    }
  }
`;

const userQuery = gql`
  query userQuery {
    user {
      id
    }
  }
`;

export default compose(
  graphql(vote, {name: 'vote'}),
  graphql(updateVote, {name: 'updateVote'}),
  graphql(userQuery, { options: { fetchPolicy: 'network-only' }}),
  graphql(queryVotes, {name: 'VotesQuery', options: { fetchPolicy: 'network-only' }})
)(ReactionToVote)
