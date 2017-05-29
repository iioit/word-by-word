/* @flow */

import React, { Component } from 'react';
import { StatusBar, Platform, AppState, AsyncStorage, Animated, Easing } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components/native';
import EntryList from '../EntryList/index';
import PushNotification from 'react-native-push-notification';
import LoaderWithBackground from '../LoaderWithBackground';
import ToolBarInGame from '../ToolBarInGame';
import ErrorScreen from '../ErrorScreen';

const StoryContainer = styled.View`
  flex: 1;
`;
const ToolbarWrapper = styled(Animated.View)`
  position:absolute;
  bottom:0;
  right:0;
  left:0;
  height:60;
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
      },
      subscribeToMore: Function,
    },
  };
  state: {
    swipeIndex: number,
    isFirstPlayer: boolean,
    endStoryEarly: boolean,
    hideSwiper:boolean,
    revealToolbar:boolean,
    firstTime:boolean,
    storyInitialized:boolean
  };

  storySubscription: Function;
  entrySubscription: Function;
  handlePush: Function;
  onRevealToolbar:Function;
  animatedValue:Object;

  constructor() {
    super();

    this.state = {
      swipeIndex: 0,
      isFirstPlayer: false,
      endStoryEarly: false,
      revealToolbar:true,
      hideSwiper:false,
      firstTime:true,
      storyInitialized:false,
    };

    this.handlePush = this.handlePush.bind(this);
    this.onRevealToolbar = this.onRevealToolbar.bind(this);
    this.animatedValue = new Animated.Value(0);
  }

  componentDidMount() {
    setTimeout(()=>{this.onRevealToolbar()}, 2000);

    //do not remove, serves as AppState initialization
    console.log(AppState.currentState);
    //check players turn
    AsyncStorage.getItem(this.props.storyKey).then((value) => {
      this.setState({isFirstPlayer: JSON.parse(value)});
    });

    this.storySubscription = this.props.StoryQuery.subscribeToMore({
      document:gql`        
      subscription {
        Story(filter:{
            node:{
              id:"${this.props.id}",
              endEarly:true
            }
            mutation_in:[UPDATED]
          }){
            mutation
            node{
              id
              endEarly
            }
          }
        }
    `,
      variables: null,
      updateQuery: (previousState, { subscriptionData }) => {
        this.setState({endStoryEarly:true})
      }
    });

    this.entrySubscription = this.props.StoryQuery.subscribeToMore({
      document: gql`
        subscription {
          Entry(filter: {
            node: {
              stories_some: {
                id: "${this.props.id}"
              }
            }
            mutation_in: [CREATED, UPDATED]
          }) {
            mutation
            node {
              id
              description
              file {
                url
              }
            }
          }
        }
      `,
      variables: null,
      updateQuery: (previousState, { subscriptionData }) => {
        if (subscriptionData.data.Entry.mutation === 'CREATED') {
          const newEntry = subscriptionData.data.Entry.node;
          const entries = previousState.Story.entries.concat([newEntry]);
          this.handlePush();
          this.setState({ swipeIndex: entries.length - 1 });

          return {
            Story: {
              entries,
              id:previousState.Story.id,
              __typename:previousState.Story.__typename
            },
          };
        } else if (subscriptionData.data.Entry.mutation === 'UPDATED') {
          const entries = previousState.Story.entries.slice();
          const updatedEntry = subscriptionData.data.Entry.node;
          const entryIndex = entries.findIndex(
            entry => updatedEntry.id === entry.id
          );
          entries[entryIndex] = updatedEntry;

          return {
            Story: {
              entries,
              id:previousState.Story.id,
              __typename:previousState.Story.__typename
            },
          };
        }
        return previousState;
      },
    });
  }

  componentWillUnmount(){
    this.storySubscription();
    this.entrySubscription();
  }

  handlePush() {
    if((Platform.OS === 'android' && AppState.currentState === 'background') || Platform.OS === 'ios' ) {
      PushNotification.localNotification({
        largeIcon: 'wbw',
        smallIcon: 'wbw',
        message: 'Your partner has just replied!',
        playSound: true,
        soundName: 'default',
        vibrate: true,
        ongoing: false,
      });
    }
  }

  onRevealToolbar(){
    if(!this.state.firstTime) {
      if (!this.state.hideSwiper) {
        this.setState({hideSwiper: true});
      }
    } else {
      this.setState({firstTime:false})
    }

    if(this.state.revealToolbar) {
      this.animatedValue.setValue(0);
      Animated.timing(
        this.animatedValue,
        {
          toValue: 100,
          duration: 200,
          easing: Easing.inOut(Easing.cubic)
        }
      ).start();

      this.setState({revealToolbar:false});
    } else {
      this.animatedValue.setValue(100);
      Animated.timing(
        this.animatedValue,
        {
          toValue: 0,
          duration: 200,
          easing: Easing.inOut(Easing.cubic)
        }
      ).start();

      this.setState({ revealToolbar:true });
    }

    //in order to offset the entries position only for the first load of the story
    if(!this.state.storyInitialized){
      this.setState({storyInitialized:true});
    }
  }


  render() {
    const { StoryQuery, storyKey } = this.props;
    const { swipeIndex, isFirstPlayer, revealToolbar, endStoryEarly, hideSwiper, storyInitialized } = this.state;

    if (StoryQuery.loading) {
      return (
        <LoaderWithBackground />
      );
    }

    if (StoryQuery.error) {
      return (
        <ErrorScreen />
      );
    }

    return (
      <StoryContainer >
        <StatusBar hidden />
        <EntryList storyInitialized={storyInitialized} withToolbar={revealToolbar} entries={StoryQuery.Story.entries} storyId={StoryQuery.Story.id} storyKey={storyKey} swipeIndex={swipeIndex} firstPlayer={isFirstPlayer} endStoryEarly={endStoryEarly} revealToolbar={this.onRevealToolbar} hideSwiper={hideSwiper} />
          <ToolbarWrapper style={{ transform:[{translateY:this.animatedValue}]}}>
            <ToolBarInGame storyId={StoryQuery.Story.id}/>
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

export default graphql(StoryForId, { name: 'StoryQuery' })(Story);
