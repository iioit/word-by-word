/* @flow */

import React, { Component } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { withRouter } from 'react-router-native';
import styled from 'styled-components/native';
import Reaction from '../Reaction';

const Container = styled.View`
  flex: 1;
  margin-bottom:20;
  height:240;
  flex-direction:column;
`;
const ScrollContainer = styled.ScrollView`
  flex: 4;
`;
const Slide = styled.Image`
  flex: 1;
  margin:0 10;
  height:150;
  width:80;
  resize-mode:cover;
`;
const ButtonContainer = styled.View`
  flex:1;
  margin:5;
  background-color:#354259;
  border-radius:8;
`;
const LinkText = styled.Text`
  padding:10;
  font-size:14;
  text-align:center;
  color:#fff;
  font-family: Montserrat-Light;
`;
const ThemeHeadline = styled.Text`
  padding:2 10 5;
  font-size:12;
  text-align:left;
  color:#fff;
  font-family: Montserrat-Light;
`;
const Emojies = styled.View`
  flex:2;
  flex-direction:row;
  align-self:stretch;
  justify-content:flex-start;
`;
const LowerBar = styled.View`
  flex:1;
  flex-direction:row;
  justify-content:flex-start;
  align-items:center;
  padding-bottom:10;
`;
const ReactionWithCounter = styled.View`
  flex:1;
  flex-direction:row;
  align-items:center;
`;
const Counter = styled.Text`
  font-size:16;
  text-align:left;
  padding:2;
  color:#fff;
  font-family: Montserrat-Light;
`;

class StoryInGallery extends Component {
  props: {
    history:Object,
    updateStoryId:Function,
    storyId:string,
    fromMyStories:boolean,
    theme:string,
    reactions:Object,
    entries:Object
  };

  state: {
    loading:boolean
  };

  onViewStory:Function;

  constructor() {
    super();

    this.state = {loading:true};

    this.onViewStory = this.onViewStory.bind(this);
  }

  onViewStory(){
    const { history, updateStoryId, storyId, fromMyStories } = this.props;

    updateStoryId(storyId, 'storyId');

    //noting if component is accessed from user's stories, in order not to enable voting at the end of the story
    if(fromMyStories){
      const nextLocation = {
        pathname: `/story/${storyId}`,
        state: { fromMyStories: true }
      };
      history.push(nextLocation);
    } else {
      history.push(`/story/${storyId}`);
    }
  }

  render() {
    const { reactions, entries, theme } = this.props;
    let themeColour;
    if(theme == 'Crime'){
      themeColour='#720328'
    } else if (theme == 'Fairytale'){
      themeColour='#AE6C00'
    } else {
      themeColour='rgb(0, 18, 32)'
    }
    let emojies = [];
    if(reactions.length != 0){
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
      {funnyCount != 0 &&
        emojies.push(<ReactionWithCounter key={1}><Reaction type="funny"/><Counter>{funnyCount}</Counter></ReactionWithCounter>);
      }
      {loveCount != 0 &&
        emojies.push(<ReactionWithCounter key={2}><Reaction type="love" /><Counter>{loveCount}</Counter></ReactionWithCounter>);
      }
      {shockedCount != 0 &&
        emojies.push(<ReactionWithCounter key={3}><Reaction  type="shocked" /><Counter>{shockedCount}</Counter></ReactionWithCounter>);
      }
    }

    return (
      <Container style={{ backgroundColor:themeColour}}>
        <ThemeHeadline>{theme}</ThemeHeadline>

        <ScrollContainer horizontal={true} >
          {entries.map(entry => (
            <Slide key={entry.id} source={this.state.loading ?  require('../../assets/images/loader_quick.gif') : {uri: entry.file.url}} onLoad={(e) => this.setState({loading: false})} />
          ))}
        </ScrollContainer>

        <LowerBar>
          <Emojies>
            {emojies}
          </Emojies>
          <ButtonContainer><TouchableOpacity onPress={this.onViewStory}><LinkText>VIEW</LinkText></TouchableOpacity></ButtonContainer>
        </LowerBar>
      </Container>
    );
  }
}

export default withRouter(StoryInGallery);
