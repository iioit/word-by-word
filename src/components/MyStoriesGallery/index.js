/* @flow */

import React, { Component } from 'react';
import { TouchableOpacity, ListView, View } from 'react-native';
import { withRouter } from 'react-router-native';
import styled from 'styled-components/native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import StoryInGallery from '../StoryInGallery';
import Toolbar from '../ToolBar';
import LoaderWithBackground from '../LoaderWithBackground';
import ErrorScreen from '../ErrorScreen';

const TexturedContainer = styled.Image`
  flex:1;
  background-color:transparent;
  justify-content: center;
  align-items: center;
  resize-mode:cover;
  padding:0;
`;
const Headline = styled.Text`
  padding: 20;
  font-family: LibreBaskerville-Bold;  
  font-size:24;
  text-align:center;
  padding-bottom:20;
  color:#354259;
`;
const Story = styled(StoryInGallery)`
  flex:1;
`;
const ScrollContainer = styled.ListView`
  flex: 1;
  align-self:stretch;
  flex-direction:column;
  margin-bottom:0;
`;
const MetaDataWrapper = styled.View`
  flex:1;
  margin-bottom:30;
`;
const MetaDataDate = styled.Text`
  margin-top:-10;
  padding: 0 10 0;
  font-family:Montserrat-Light;  
  font-size:14;
  text-align:left;
  color:#354259;
`;
const MetaDataPartner = styled(MetaDataDate)`
  padding: 5 10 10;
  margin-top:0;
`;
class MyStoriesGallery extends Component {
  props:{
    StoriesQuery:{
      id:string,
      theme:string,
      reactions: {
        funny:boolean,
        love:boolean,
        shocked:boolean
      },
      entries:{
        id:string,
        file:{
          url:string,
        },
        description:string,
      },
      allStories:Array<Object>,
      refetch:Function
    },
    updateStoryId:Function;
  };

  state: {
    dataSource:Object
  };

  renderStories:Function;

  constructor() {
    super();

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['']),
    };

    this.renderStories = this.renderStories.bind(this);
  }

  componentDidMount(){
    this.props.StoriesQuery.refetch();
  }

  renderStories(){
    const { StoriesQuery, updateStoryId } = this.props;
    return(
      <View>
        {StoriesQuery.allStories.map(story => (
          <MetaDataWrapper key={story.id}>
            <Story
            entries={story.entries}
            reactions={story.reactions}
            theme={story.theme}
            storyId={story.id}
            updateStoryId={updateStoryId}
            fromMyStories = {true}
            />
            <MetaDataDate>Played on: {story.createdAt.substr(0, 10)}</MetaDataDate>
            <MetaDataPartner>Played with: {(story.users[0]!=undefined) ? (story.users[0].name).toUpperCase() : 'Anonymous'}</MetaDataPartner>
          </MetaDataWrapper>
        ))}
      </View>
    )
  }

  render(){
    const { StoriesQuery } = this.props;

    if (StoriesQuery.loading) {
      return (
        <LoaderWithBackground/>
      );
    }
    if (StoriesQuery.error) {
      return (
        <ErrorScreen />
      );
    }

    return(
      <TexturedContainer source={require('../../assets/images/texture_9.png')} style={{height:undefined, width:undefined}} >
        <Headline>
          My Stories
        </Headline>
        <ScrollContainer
          dataSource={this.state.dataSource}
          renderRow={this.renderStories}
        />
        <Toolbar />
      </TexturedContainer>
    );
  }
}

const queryStories = gql`query($userId:ID){
  allStories(filter:{
		users_some:{
      id:$userId
    }
  }){
    id
    theme
    reactions{
      funny
      shocked
      love
    }
    entries{
      id
      file{
        url
      }
      description
    }
    users(filter:{
      id_not:$userId
    }){
      name
    }
    createdAt
  }
}
`;

export default graphql(queryStories, { name: 'StoriesQuery', options: { fetchPolicy: 'network-only' } })(withRouter(MyStoriesGallery));
