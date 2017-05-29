/* @flow */

import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { withRouter, Link } from 'react-router-native';
import styled from 'styled-components/native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ReactionToVote from '../ReactionToVote';
import LoaderWithBackground from '../LoaderWithBackground';
import ErrorScreen from '../ErrorScreen';

const Container = styled.View`
  flex: 1;
  flex-direction:column;
  justify-content: center;
  align-items: center;
`;
const TexturedContainer = styled.Image`
  flex:1;
  background-color:transparent;
  justify-content: center;
  align-items: center;
  resize-mode:cover;
`;
const Headline = styled.Text`
  flex:1;
  color: #354259;
  padding-top:60;
  text-align:center;
  font-size:40;
  font-family: LibreBaskerville-Regular;
  padding-bottom:20;
`;
const ButtonContainer = styled.View`
  flex-direction:row;
  background-color:#354259;
  border-radius:8;
  justify-content:center;
  align-items:center;
  margin-bottom:20;
`;
const LinkText = styled.Text`
  padding:15;
  font-size:16;
  text-align:center;
  color:#fff;
  font-family: Montserrat-Light;
`;
const QuestionText = styled(LinkText)`
  color:#354259;
  font-size:18;
`;
const Emojies = styled.View`
flex:1;
  flex-direction:row;
  justify-content:center;
  align-items:center;
  padding:0 20;
`;
const EmojiBar = styled.View`
  flex:1;
  flex-direction:column;
  justify-content:center;
  align-items:center;
`;
const ReactionWithCounter = styled.View`
  flex-direction:column;
  justify-content:center;
  align-items:center;
  padding:0 5;
`;
const Counter = styled.Text`
  font-size:18;
  text-align:center;
  padding:2;
  color:#354259;
  font-family: Montserrat-Light;
`;

class StoryInGalleryEndOfStory extends Component {
  props: {
    noOfEntries: number,
    isCameraSlide: boolean,
    history: { location: Object},
    storyId: string,
    data:Object,
    reactions:Object,
  };
  state: {
    goBack: boolean,
  };

  constructor(){
    super();
    this.state = {
      goBack:false,
    };
  }

  render() {
    const { reactions, data, storyId, history } = this.props;
    let emojies = [];
    let funnyCount = 0;
    let loveCount = 0;
    let shockedCount = 0;
    for (let i=0; i < reactions.length; i++) {
      if(reactions[i].funny){
        funnyCount++;
      }
      if (reactions[i].love){
        loveCount++;
      }
      if (reactions[i].shocked){
        shockedCount++;
      }
    }

    if (data.loading) {
      return (
        <LoaderWithBackground/>
      );
    }

    if (data.error) {
      return (
        <ErrorScreen />
      );
    }

    if(data.user) {
      emojies.push(<ReactionWithCounter key={1}><ReactionToVote storyId={storyId} userId={data.user.id} type="funny"/><Counter>{funnyCount}</Counter></ReactionWithCounter>);
      emojies.push(<ReactionWithCounter key={2}><ReactionToVote storyId={storyId} userId={data.user.id} type="love"/><Counter>{loveCount}</Counter></ReactionWithCounter>);
      emojies.push(<ReactionWithCounter key={3}><ReactionToVote storyId={storyId} userId={data.user.id} type="shocked"/><Counter>{shockedCount}</Counter></ReactionWithCounter>);
    }

    return (
      <TexturedContainer source={require('../../assets/images/texture_9.png')} style={{height:undefined, width:undefined}} >
        <Container>
          <Headline>The End!</Headline>

          {(data.user && ( history.location.state == undefined || !history.location.state.fromMyStories ) ) &&
            <EmojiBar>
              <QuestionText>What did you think of the story?</QuestionText>
              <Emojies>
                {emojies}
              </Emojies>
            </EmojiBar>
          }

          <Link to="/" component={TouchableOpacity}><ButtonContainer><LinkText>RETURN TO THE GALLERY</LinkText></ButtonContainer></Link>

        </Container>
      </TexturedContainer>
    );
  }
}

const userQuery = gql`
  query userQuery {
    user {
      id
    }
  }
`;

export default graphql(userQuery, { options: { fetchPolicy: 'network-only' }})(withRouter(StoryInGalleryEndOfStory))
