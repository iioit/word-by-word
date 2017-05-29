/* @flow */

import React, { Component } from 'react';
import { AsyncStorage, TouchableOpacity, Alert, Share, TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import { withRouter } from 'react-router-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components/native';
import Loader from '../Loader';
import LoaderQuick from '../LoaderQuick';

const TexturedContainer = styled(Animated.Image)`
  flex:1;
  background-color:transparent;
  justify-content: center;
  align-items: center;
  resize-mode:cover;
  border-color:#354259;
`;
const ContainerPadded = styled.View`
  flex:1;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  align-self:stretch;
  padding:30;
`;
const Message = styled.Text`
  color: #354259;
  font-family: Montserrat-Light;
  font-size:18;
  padding-top:20;
  text-align:center;
`;
const Headline = styled(Message)`
  font-size:40;
  font-family: LibreBaskerville-Regular;
  padding-bottom:20;
`;
const ButtonContainer = styled.View`
  flex-direction:row;
  margin-bottom:0;
  background-color:#354259;
  border-radius:8;
  width: 200;
  justify-content:center;
  align-items:center;
  margin-top:10;
`;
const ButtonContainer2 = styled(ButtonContainer)`
  background-color:#fff;
  border: 1 solid #354259; 
`;
const LinkText = styled.Text`
  padding:15;
  font-size:16;
  text-align:center;
  color:#fff;
  font-family: Montserrat-Light;
`;
const LinkText2 = styled(LinkText)`
  color:#354259;
`;

class EndOfStory extends Component {
  props: {
    noOfEntries: number,
    isCameraSlide: boolean,
    history: { push: Function},
    storyKey: string,
    endStoryEarly: {
      id: string
    },
    publishStory: Function,
    doNotPublishStory:Function,
    revealToolbar:boolean,
    shouldEndStoryEarly:boolean,
    storyId:string,
    withToolbar:boolean
  };

  state: {
    goBack: boolean,
    result:string,
  };

  onBackButtonPressed: Function;
  onPublishButtonPressed: Function;
  onDoNotPublishButtonPressed: Function;
  shareText:Function;
  showShareResult:Function;
  animatedValue:Object;
  animatedValue2:Object;
  animatedValue3:Object;

  constructor(){
    super();

    this.state = {
      goBack:false,
      result: '',
    };

    this.shareText = this.shareText.bind(this);
    this.showShareResult = this.showShareResult.bind(this);
    this.onBackButtonPressed = this.onBackButtonPressed.bind(this);
    this.onPublishButtonPressed = this.onPublishButtonPressed.bind(this);
    this.onDoNotPublishButtonPressed = this.onDoNotPublishButtonPressed.bind(this);
    this.animatedValue = new Animated.Value(0);
    this.animatedValue2 = new Animated.Value(0);
    this.animatedValue3 = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps: Object){
    if(nextProps.withToolbar != this.props.withToolbar) {
      if(nextProps.withToolbar){
        this.scaleDownView();
      } else{
        this.scaleUpView();
      }
    }
  }

  scaleUpView(){
    this.animatedValue.setValue(30);
    Animated.timing(
      this.animatedValue,
      {
        toValue: 0,
        duration: 200,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();

    this.animatedValue2.setValue(-30);
    Animated.timing(
      this.animatedValue2,
      {
        toValue: 0,
        duration: 200,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();

    this.animatedValue3.setValue(8);
    Animated.timing(
      this.animatedValue3,
      {
        toValue: 0,
        duration: 200,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();
  }

  scaleDownView(){
    this.animatedValue.setValue(0);
    Animated.timing(
      this.animatedValue,
      {
        toValue: 30,
        duration: 200,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();

    this.animatedValue2.setValue(0);
    Animated.timing(
      this.animatedValue2,
      {
        toValue: -30,
        duration: 200,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();

    this.animatedValue3.setValue(0);
    Animated.timing(
      this.animatedValue3,
      {
        toValue: 8,
        duration: 200,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();
  }

  onBackButtonPressed() {
    AsyncStorage.removeItem(this.props.storyKey);
    this.props.history.push('/');
  }

  onPublishButtonPressed(){
    this.props.publishStory({
      variables: {
        id: this.props.storyId
      },
    });

    Alert.alert(
      'By the way,',
      'Would you like to share this with your friends?',
      [
        {text: 'Yes, please', onPress: () => {
          this.shareText();
        }},
        {text: "No, thank you", onPress: () => {
          this.onBackButtonPressed();
        }},
      ],
      { cancelable: false }
    )
  }

  shareText() {
    Share.share({
      message: `Grab a friend and make stories together: http://word-by-word.herokuapp.com/${this.props.storyId}`,
      url: `http://word-by-word.herokuapp.com/${this.props.storyId}`,
      title: 'Word by Word'
    })
      .then(this.showShareResult)
      .catch((error) => this.setState({result: 'error: ' + error.message}));
  }

  showShareResult(result: Object) {
    //cfeedback after sharing
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        this.setState({result: 'shared with an activityType: ' + result.activityType});
      } else {
        this.setState({result: 'shared'});
      }
    } else if (result.action === Share.dismissedAction) {
      this.setState({result: 'dismissed'});
    }
    this.onBackButtonPressed();
  }

  onDoNotPublishButtonPressed(){
    this.props.doNotPublishStory({
      variables: {
        id: this.props.storyId
      },
    })
    this.onBackButtonPressed();
  }

  render() {
    const { noOfEntries, isCameraSlide, shouldEndStoryEarly, revealToolbar } = this.props;
      let view;

      if(noOfEntries < 11 && !isCameraSlide){
        view = <LoaderQuick />
      } else if (noOfEntries < 11 && isCameraSlide && !shouldEndStoryEarly){
        view =  (
          <TouchableWithoutFeedback onPress={revealToolbar} >
            <ContainerPadded>
              <Headline>Hang on</Headline>
              <Loader />
              <Message>Your partner hasn&#39;t replied yet.</Message>
              <Message>You&#39;ll get a notification once it&#39;s your turn.</Message>
            </ContainerPadded>
          </TouchableWithoutFeedback>);
      } else {
        view = (
          <ContainerPadded>
            <Headline>The End!</Headline>
            <Message>If both you and your partner choose to publish this story, other people will be able to read it and get inspired.</Message>
            <TouchableOpacity onPress={this.onPublishButtonPressed}><ButtonContainer><LinkText>PUBLISH IT</LinkText></ButtonContainer></TouchableOpacity>
            <TouchableOpacity onPress={this.onDoNotPublishButtonPressed}><ButtonContainer2><LinkText2>NO, THANK YOU</LinkText2></ButtonContainer2></TouchableOpacity>
          </ContainerPadded>
        );
      }

      return (
        <TexturedContainer source={require('../../assets/images/texture_9.png')} style={{height:undefined, width:undefined, marginLeft:this.animatedValue2, paddingLeft:this.animatedValue, borderWidth:this.animatedValue3}} >
            {view}
        </TexturedContainer>
      );
  }
}

const endStoryEarly = gql`
  mutation($id:ID!){
    updateStory(id:$id, endEarly:true){
      id
    }
  }
`;

const publishStory = gql`
  mutation($id:ID!){
  addToStoryOnPublished(storiesStoryId:$id, publishedsPublishedId:"cj1zcwee62dl80191rmlvmznp"){
      storiesStory{
        id
      }
    }
  }
`;

const doNotPublishStory = gql`
  mutation($id:ID!){
  addToStoryOnPublished(storiesStoryId:$id, publishedsPublishedId:"cj1zcw0hp2d9o0191ef12axch"){
      storiesStory{
        id
      }
    }
  }
`;

export default withRouter(graphql(endStoryEarly, { name: 'endStoryEarly' })
(graphql(publishStory, { name: 'publishStory' })
(graphql(doNotPublishStory, { name: 'doNotPublishStory' })
(EndOfStory))));
