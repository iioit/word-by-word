/* @flow */

import React, { Component } from 'react';
import { ListView, AsyncStorage, Alert, Animated, Easing, View} from 'react-native';
import { withRouter, Redirect } from 'react-router-native';
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
  margin-bottom:50;
`;
const ToolbarWrapper = styled(Animated.View)`
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  height:50;
`;

class StoriesGallery extends Component {
  props: {
    StoriesQuery:{
      id:string,
      theme:string,
      entries:{
        id:string,
        file:{
          url:string,
        },
        description:string,
      },
      allStories: Array<Object>,
      refetch:Function
    },
    updateStoryId:Function,
    history:Object,
    data:Object
  };

  state: {
    dataSource:Object,
    firstTime:boolean,
    animateIn:Object
  };

  renderStories:Function;
  toolbarIn:Function;

  constructor() {
    super();

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['']),
      firstTime:false,
      animateIn: new Animated.Value(100),
    };

    this.renderStories = this.renderStories.bind(this);
    this.toolbarIn = this.toolbarIn.bind(this);
  }

  componentDidMount(){
    setTimeout(()=>{this.toolbarIn()}, 500);

    //check if it's first time user opened the app
    AsyncStorage.getAllKeys((err, keys) => {
      if (keys.length == 0) {
        this.setState({firstTime: true});
      }
    });

    //refresh the list of stories
    this.props.StoriesQuery.refetch();
  }

  componentWillReceiveProps(nextProps: Object){
    if(nextProps.data.user !== this.props.data.user) {
      if(nextProps.data.user != null) {
        //check if there is an unfinished game
        AsyncStorage.getAllKeys((err, keys) => {
          keys.map(key => {
            if (key !== 'auth0IdToken' && key !== 'checkedIn') {
              Alert.alert(
                'Hey,',
                'It seems there is a game you have not finished playing. Would you like to though?',
                [
                  {
                    text: 'Yes, please', onPress: () => {
                    this.props.history.push(`/load/${key}`);
                  }
                  },
                  {
                    text: "No, thank you", onPress: () => {
                    //remove the game from local storage
                    AsyncStorage.removeItem(key);
                  }
                  },
                ],
                {cancelable: false}
              )
            }
          });
        });
      }
    }
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

  renderStories(){
    const { StoriesQuery, updateStoryId } = this.props;

    //sort stories according to the amount of votes
    let sortedStories = StoriesQuery.allStories.slice(0);
    sortedStories.sort((a, b) =>{
      return a.reactions.length < b.reactions.length ? 1 : a.reactions.length > b.reactions.length ? -1 : 0;
    });

    return(
      <View>
        {sortedStories.map(story => (
          <Story
            key={story.id}
            entries={story.entries}
            reactions={story.reactions}
            theme={story.theme}
            storyId={story.id}
            updateStoryId={updateStoryId}
            fromMyStories = {false}
          />
        ))}
      </View>
    )
  }


  render(){
    const { StoriesQuery, data } = this.props;
    const { firstTime, dataSource, animateIn } = this.state;

    if(firstTime){
      return (<Redirect to="/mmfirsttime" />);
    }

    if (StoriesQuery.loading || data.loading) {
      return (
        <LoaderWithBackground />
      );
    }

    if (StoriesQuery.error || data.error) {
      return (
        <ErrorScreen />
      );
    }

    return(
      <TexturedContainer source={require('../../assets/images/texture_9.png')} style={{height:undefined, width:undefined}} >
        <Headline>
          Hall of Stories
        </Headline>
        <ScrollContainer
          dataSource={dataSource}
          renderRow={this.renderStories}
        />
        <ToolbarWrapper style={{transform:[{translateY:animateIn}]}}>
          <Toolbar  />
        </ToolbarWrapper>
      </TexturedContainer>
    );
  }
}

//query only 'published' stories
const queryStories = gql`query{
  allStories(filter:{
    publisheds_none:{
      id:"cj1zcw0hp2d9o0191ef12axch"
    }
    publisheds_some:{
      id:"cj1zcwee62dl80191rmlvmznp"
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

export default graphql(userQuery, { options: { fetchPolicy: 'network-only' }})(graphql(queryStories, { name: 'StoriesQuery', options: { fetchPolicy: 'network-only' } })(withRouter(StoriesGallery)));
