/* @flow */

import React, { Component } from 'react';
import { Platform, BackAndroid, AsyncStorage, Alert } from 'react-native';
import styled from 'styled-components/native';
import { NativeRouter, Route } from 'react-router-native';
import SplashScreen from 'react-native-splash-screen';
import ChooseAction from '../ChooseAction';
import ChooseTheme from '../ChooseTheme';
import CreateStory from '../CreateStory';
import JoinStory from '../JoinStory';
import LoadStory from '../LoadStory';
import StoryInGallerySingle from '../StoryInGallerySingle';
import OnboardingStory from '../OnboardingStory';
import MainMenuNotLoggedInScreen from '../MainMenuNotLoggedInScreen';
import StoriesGallery from '../StoriesGallery';
import LoginScreen from '../LoginScreen';
import Profile from '../Profile';
import MyStoriesGallery from '../MyStoriesGallery';
import FirstTimeMenu from '../FirstTimeMenu';

const AppContainer = styled.View`
  flex: 1;
`;

class App extends Component {
  state: {
    newStoryKey: string,
    storyId: string,
    storyTheme: string,
    userId: string
  };

  updateStoryKey: Function;
  updateStoryId: Function;
  updateUserId: Function;

  constructor(){
    super();

    this.state = {newStoryKey:'', storyId:'', storyTheme:'', userId:''};

    this.updateStoryKey = this.updateStoryKey.bind(this);
    this.updateStoryId = this.updateStoryId.bind(this);
    this.updateUserId = this.updateUserId.bind(this);
  }

  componentDidMount() {
    setTimeout(()=>{SplashScreen.hide()}, 2000);

    // disable default android navigation 'back'
    if (Platform.OS == "android") {
      BackAndroid.addEventListener("hardwareBackPress", () => {
        return true;
      })
    }
  }

  updateStoryKey(newKey: string){
    this.setState({newStoryKey:newKey});
  }

  updateStoryId(newId: string){
    this.setState({storyId:newId});
  }

  updateUserId(newUser: string){
    this.setState({userId:newUser})
  }

  render() {
      return (
        <NativeRouter>
          <AppContainer>
            <Route exact path="/" component={() => (<StoriesGallery updateStoryId={this.updateStoryId} />)}/>
            <Route path="/mmnotlogged" component={MainMenuNotLoggedInScreen}/>
            <Route path="/login" component={LoginScreen}/>
            <Route path="/mmfirsttime" component={FirstTimeMenu}/>
            <Route path="/profile" component={() => (<Profile updateUserId={this.updateUserId} />)}/>
            <Route path="/onboard" component={() => (<OnboardingStory id="cj14psd9p0s5w0109iitai1d6" />)}/>
            <Route path="/mystories" component={() => (<MyStoriesGallery userId={this.state.userId} updateStoryId={this.updateStoryId} />)}/>
            <Route path="/chooseaction" component={ChooseAction}/>
            <Route path="/join" component={JoinStory}/>
            <Route path="/theme" component={() => (<ChooseTheme updateStoryKey={this.updateStoryKey} updateStoryId={this.updateStoryId} />)}/>
            <Route path="/create/:storyKey" component={() => (<CreateStory storyId={this.state.storyId} codeWord={this.state.newStoryKey} />)}/>
            <Route path="/load/:storyKey" component={({ match }) => (<LoadStory storyKey={match.params.storyKey} updateStoryId={this.updateStoryId} />)}/>
            <Route path="/story/:id" component={() => (<StoryInGallerySingle id={this.state.storyId} />)}/>
          </AppContainer>
        </NativeRouter>
      );
    }
}

export default App;
