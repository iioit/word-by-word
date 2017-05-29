/* @flow */

import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components/native';
import ErrorScreen from '../ErrorScreen';
import LoaderWithBackground from '../LoaderWithBackground';
import Toolbar from '../ToolBar';

const TexturedContainer = styled.Image`
  flex:1;
  background-color:transparent;
  justify-content: center;
  align-items: center;
  resize-mode:cover;
  padding:0 20;
`;
const ButtonContainer = styled.View`
  flex-direction:row;
  margin-bottom:20;
  background-color:#720328;
  border-radius:8;
  width: 200;
  justify-content:center;
  align-items:center;
`;
const ButtonContainer2 = styled(ButtonContainer)`
  background-color:#AE6C00;
`;
const ButtonContainer3 = styled(ButtonContainer)`
  background-color:rgb(0, 18, 32);
`;
const TextStyle = styled.Text`
  padding: 20;
  font-family: Montserrat-Light;
  font-size:20;
  text-align:center;
  padding-bottom:50;
`;
const LinkText = styled.Text`
  padding:15;
  font-size:16;
  text-align:center;
  color:#fff;
  font-family: Montserrat-Light;
`;
const BackButtonContainer = styled.View`
  position:absolute;
  top:0;
  left:0;
`;
const BackButton = styled.Image`
  transform: scale(0.8, 0.8) rotate(180deg);
  margin-top:-20;
`;
const ToolbarWrapper = styled.View`
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  height:50;
`;

class ChooseTheme extends Component {
  props: {
    history: Object,
    updateStoryKey:Function,
    updateStoryId:Function,
    QueryStoryKey:{
      theme:string,
      codeWord:string,
      id:string,
      allCodeWordses:Array<Object>
    },
    QueryEntryStarter:{
      id:string,
      starter:Object,
      allEntries:Array<Object>
    },
    createStory:Function,
    data:Object
  };

  onCreateStory: Function;

  onCreateStory(chosenTheme: string){
    const { updateStoryKey, updateStoryId, history, QueryStoryKey, QueryEntryStarter, createStory, data } = this.props;
    let listOfStarters = [];
    let thisCodeWord = {};

    //list available story starters according to the users chosen theme
    for (let i=0; i < QueryEntryStarter.allEntries.length; i++) {
      if(QueryEntryStarter.allEntries[i].starter == chosenTheme){
        listOfStarters.push(QueryEntryStarter.allEntries[i]);
      }
    }

    //pick a random story starter from the list
    const entryStarter = listOfStarters[Math.floor(Math.random() * listOfStarters.length)];
    for (let i=0; i < QueryStoryKey.allCodeWordses.length; i++) {
      if(QueryStoryKey.allCodeWordses[i].theme == chosenTheme){
        thisCodeWord = QueryStoryKey.allCodeWordses[i];
        break;
      }
    }

    //create a new story in the database
    createStory({
      variables: {
        theme: chosenTheme,
        storyKey: thisCodeWord.codeWord,
        entriesIds: entryStarter.id,
        codeWordId: thisCodeWord.id,
        userId:data.user.id
      },
    }).then(response => {
      updateStoryId(response.data.createStory.id, 'storyId');
    });

    updateStoryKey(thisCodeWord.codeWord, 'newStoryKey');
    history.push(`/create/${thisCodeWord.codeWord}`);
  }

  render(){
    const { QueryEntryStarter, QueryStoryKey } = this.props;

    if (QueryEntryStarter.loading || QueryStoryKey.loading) {
      return (
        <LoaderWithBackground />
      );
    }

    if (QueryEntryStarter.error || QueryStoryKey.error) {
      return (
        <ErrorScreen />
      );
    }

    return(
      <TexturedContainer source={require('../../assets/images/texture_9.png')} style={{height:undefined, width:undefined}} >
        <TextStyle>
          Which theme do you want for your story?
        </TextStyle>

        <TouchableOpacity onPress={this.onCreateStory.bind(this, 'Crime')}><ButtonContainer><LinkText>CRIME</LinkText></ButtonContainer></TouchableOpacity>

        <TouchableOpacity onPress={this.onCreateStory.bind(this, 'Fairytale')}><ButtonContainer2><LinkText>FAIRYTALE</LinkText></ButtonContainer2></TouchableOpacity>

        <TouchableOpacity onPress={this.onCreateStory.bind(this, 'Scifi')}><ButtonContainer3><LinkText>SCI-FI</LinkText></ButtonContainer3></TouchableOpacity>

        <BackButtonContainer>
          <Link to="/chooseaction" component={TouchableOpacity}><BackButton source={require('../../assets/images/arrows/arrow_noBG_yellow.png')}/></Link>
        </BackButtonContainer>

        <ToolbarWrapper>
          <Toolbar />
        </ToolbarWrapper>
      </TexturedContainer>
    );
  }
}

const StoryKeyWord = gql`query
  QueryStoryKey{
    allCodeWordses(filter:{
      isUsed:false
    }){
      theme
      codeWord
      id
    }
  }
`;

const QueryEntryStarter = gql `query{
  allEntries(filter:{
    starter_not:Blank
  }){
    id
    starter
  }
}
`;

const createStory = gql`mutation($theme:STORY_THEME, $storyKey:String!, $entriesIds:[ID!], $codeWordId:ID!, $userId:[ID!]){
  createStory(theme:$theme, storyKey:$storyKey, entriesIds:$entriesIds, usersIds:$userId){
    id
  }
  updateCodeWords(id:$codeWordId, isUsed:true){
    id
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

export default withRouter(compose(
  graphql(StoryKeyWord, {name: 'QueryStoryKey', options: { fetchPolicy: 'network-only' }}),
  graphql(QueryEntryStarter, {name : 'QueryEntryStarter'}),
  graphql(createStory, {name: 'createStory'}),
  graphql(userQuery, { options: { fetchPolicy: 'network-only' }})
)
(ChooseTheme));
