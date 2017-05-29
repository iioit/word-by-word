/* @flow */

import React, { Component } from 'react';
import { withRouter, Redirect} from 'react-router-native';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Story from '../Story';
import ErrorScreen from '../ErrorScreen';
import LoaderWithBackground from '../LoaderWithBackground';

class LoadStory extends Component {
  props: {
    storyKey: string,
    location: Object,
    isError:Function,
    FindStoryQuery: {
      loading: boolean,
      allStories: {
        id: string,
      },
    },
    connectUserToStory: Function,
    data:Object
  };

  connectUserToStory:Function;

  constructor(){
    super();

    this.connectUserToStory = this.connectUserToStory.bind(this);
  }

  connectUserToStory(){
    const { FindStoryQuery, storyKey, connectUserToStory, data } = this.props;
    connectUserToStory({
      variables: {
        id:FindStoryQuery.allStories[0].id,
        userId:data.user.id
      }
    });

    return <Story id={FindStoryQuery.allStories[0].id} storyKey={ storyKey }/>
  }

  render() {
    const { FindStoryQuery, data } = this.props;
    const location = {
      pathname: '/join',
      state: { isError: true }
    };

    if (FindStoryQuery.loading || data.loading) {
      return (
        <LoaderWithBackground />
      );
    }

    if (FindStoryQuery.error || data.error) {
      return (
        <ErrorScreen />
      );
    }

    if(FindStoryQuery.allStories.length != 0) {
      return this.connectUserToStory();
    }else{
      //if user entered an invalid code word, redirect to join screen
      return (
        <Redirect to={location}/>
      );
    }
  }
}

const FindStoryQuery = gql`query 
FindStoryQuery($storyKey: String!) {
  allStories(filter: {storyKey: $storyKey}) {
    id
  }
}
`;

const connectUserToStory = gql`
mutation($id:ID!, $userId:ID!){
  addToUserOnStory(storiesStoryId:$id, usersUserId:$userId){
    storiesStory{
      id
    }
    usersUser{
      id
    }
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
  graphql(FindStoryQuery, { name: 'FindStoryQuery'}),
  graphql(connectUserToStory, { name: 'connectUserToStory'}),
  graphql(userQuery, { options: { fetchPolicy: 'network-only' }})
)(LoadStory));