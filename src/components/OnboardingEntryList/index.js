import React, { Component } from 'react';
import { Animated, Easing, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Link } from 'react-router-native';
import styled from 'styled-components/native';
import SwipeableViews from 'react-swipeable-views-native';
import EndOfStory from '../EndOfStory';
import Swiper from '../Swiper';
import OnboardingCamera from '../OnboardingCamera';
import OnboardingEntryPreview from '../OnboardingEntryPreview';

const SwipeContainer = styled(SwipeableViews)`
  flex: 1;
  padding-bottom:50;
`;
const Container = styled.View`
  flex: 1;
  flex-direction:column;
`;
const OuterContainer = styled.View`
  flex: 1;
  padding-bottom:0;
  background-color:#E0D8C6;
`;
const Dots = styled.View`
  flex:1;
  position:absolute;
  top:0;
  right:0;
  left:0;
  height:30;
  padding:8 5;
  flex-direction:row;
  justify-content:center;
  align-items:center;
  background-color:  rgba(0, 18, 32, 0.7);
`;
const Dot = styled.View`
  flex:1;
  background-color:rgba(255,255,255,0.3);
  border:0;
  border-radius:0;
  height:6;
`;
const CurrentDot = styled.View`
  width:7;
  background-color:#AE6C00;
  align-self:center;
  height:10;
  position:absolute;
  bottom:0;
`;
const PreviuosDot = styled(Dot)`
  background-color:rgba(255,255,255,.7);
  border:0;
`;
const Description = styled.Text`
  color: #354259;
  text-align:center;
  font-size:18;
  font-family: Montserrat-Light;
  padding:15 20 5;
`;
const DescriptionFinal = styled(Description)`
  font-size:24;
`;
const InnerContainer = styled.View`
  flex: 5;  
  justify-content:center;
  align-items:stretch;
  margin:30;
`;
const Photo = styled.Image`
  resize-mode:cover;
  flex:1;
`;
const EntryDescription = styled.Text`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 18;
  color: #fff;
  font-family: Montserrat-ExtraLight;
  background-color: rgba(0, 18, 32, 0.7);
  padding:10 15 20;
`;
const TopBar = styled(Animated.View)`
  position: absolute;
  top: 0;
  right: -60;
  bottom:0;
  justify-content:center;
  align-items:center;
`;
const ButtonContainer = styled.View`
  background-color:#354259;
  border-radius:8;
  width: 200;
  position:absolute;
  bottom:20;
  align-self:center;
`;
const LinkText = styled.Text`
  padding:15;
  font-size:16;
  text-align:center;
  color:#fff;
  font-family: Montserrat-Light;
`;

class OnboardingEntryList extends Component {
  props: {
    entries: Array<Object>,
  };
  state: {
    currentIndex: number,
    cameraSlide: boolean,
    cameraSlideLoaded: boolean,
    photoPreview: ?{
      uri: string,
    },
    showLastSlide:boolean,
    stopFirstSwiper:boolean,
    swipeIndex:number
  };

  highlightDot: Function;
  animationEnd: Function;
  cancelSwiper: Function;
  handlePictureTaken: Function;
  handleSubmit: Function;
  handleCancelPress: Function;
  animatedValue1: Object;
  animatedValue2: Object;
  keepSwiping: Function;

  constructor() {
    super();

    this.state = {
      currentIndex: 0,
      cameraSlide:false,
      cameraSlideLoaded:false,
      photoPreview: null,
      showLastSlide:false,
      stopFirstSwiper:false,
      swipeIndex:0
    };

    this.highlightDot = this.highlightDot.bind(this);
    this.animationEnd = this.animationEnd.bind(this);
    this.animatedValue1 = new Animated.Value(0);
    this.animatedValue2 = new Animated.Value(0);
    this.handlePictureTaken = this.handlePictureTaken.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancelPress = this.handleCancelPress.bind(this);
    this.cancelSwiper = this.cancelSwiper.bind(this);
  }

  componentDidMount(){
    setTimeout(()=>{this.keepSwiping()}, 3000);
  }

  cancelSwiper(){
    this.setState({stopFirstSwiper:true});
  }

  keepSwiping(){
    this.animatedValue1.setValue(0);
    this.animatedValue2.setValue(0);
    const createAnimation = function (value, duration, easing, delay = 0) {
      return Animated.timing(
        value,
        {
          toValue: 1,
          duration,
          easing,
          delay
        }
      )
    };
    Animated.parallel([
      createAnimation(this.animatedValue1, 1000, Easing.ease),
      createAnimation(this.animatedValue2, 700, Easing.ease, 300),
    ]).start(() => {
      if(!this.state.stopFirstSwiper) {
        setTimeout(()=>{this.keepSwiping()}, 400);
      } });
  }

  handleSubmit() {
      this.setState({showLastSlide:true, swipeIndex:3});
  }

  highlightDot(index: number){
    if(index == 1){
      setTimeout(()=>{
        this.keepSwiping();
        this.setState({stopFirstSwiper:false});
      }, 3000);
    }

    this.setState({
      currentIndex: index,
    })
    if(index == this.props.entries.length){
      this.setState({
        cameraSlide:true
      })
    }else{
      this.setState({
        cameraSlide:false
      })
    }
  }

  handlePictureTaken(file: string) {
    const photoPreview = { uri: file };
    this.setState(() => ({ photoPreview }));
  }

  animationEnd(){
    if(this.state.cameraSlide){
      this.setState({
        cameraSlideLoaded:true
      })
    } else {
      this.setState({
        cameraSlideLoaded:false
      })
    }
  }

  handleCancelPress() {
    this.setState(previousState => ({
      photoPreview: null,
      sending: false,
    }));
  }

  render() {
    const { entries } = this.props;
    const { currentIndex, photoPreview, showLastSlide, swipeIndex } = this.state;
    const move = this.animatedValue1.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -250]
    });
    const fade = this.animatedValue2.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    });

    let dots = [];
    for (let i=0; i < 11; i++) {
      if(i == currentIndex ){
        dots.push(<Container  key={i}><PreviuosDot style={{marginBottom:4, marginTop:4}} key={i}/><CurrentDot key={i+1}/></Container>);
      }else if (i < entries.length){
        dots.push(<PreviuosDot key={i} />);
      } else {
        dots.push(<Dot key={i} />);
      }
    }

    let childrenMinusOne= [];
    childrenMinusOne.push(
      <TouchableWithoutFeedback onPressIn={this.cancelSwiper} key={1}>
        <Container>
          <Description >Every game begins a story such as this one, that you and your partner take turns continuing.</Description>
          <InnerContainer>
            <Photo source={{uri: entries[0].file.url}} />
            <EntryDescription>{entries[0].description}</EntryDescription>
            <Dots>
              {dots}
            </Dots>
          </InnerContainer>
          <TopBar style={{ opacity:fade, transform:[{translateX:move}] }}>
            <Swiper />
          </TopBar>
        </Container>
      </TouchableWithoutFeedback>
    );
    childrenMinusOne.push(
      <TouchableWithoutFeedback onPressIn={this.cancelSwiper} key={2} >
        <Container>
          <Description >To navigate back and forth in the story swipe left and right.</Description>
          <InnerContainer>
            <Photo source={{uri: entries[0].file.url}} />
            <EntryDescription>{entries[0].description}</EntryDescription>
            <Dots>
              {dots}
            </Dots>
            <TopBar style={{ opacity:fade, transform:[{translateX:move}] }}>
              <Swiper />
            </TopBar>
          </InnerContainer>
        </Container>
      </TouchableWithoutFeedback>
    );
    {(!photoPreview) ? (
      childrenMinusOne.push(
        <Container key={3}>
          <Description >When it&#39;s your turn, the camera is placed furthest to the right on the storyline. Try taking a picture!</Description>
          <InnerContainer>
            <OnboardingCamera onPictureTaken={this.handlePictureTaken} />
          </InnerContainer>
        </Container>
      )
    ):(
      childrenMinusOne.push(
        <Container key={3}>
          <Description >Then you have to write something to continue the story and when you&#39;re done send it off to your partner.</Description>
          <InnerContainer>
            <OnboardingEntryPreview
              photoPreview={photoPreview}
              sending={true}
              handleSubmit={this.handleSubmit}
              previousEntryText={entries[0].description}
              handleCancelPress={this.handleCancelPress}
            />
          </InnerContainer>
        </Container>
      )
    )}
    {showLastSlide &&
      childrenMinusOne.push(
        <Container key={4}>
          <DescriptionFinal>{`And now you're\nready to play!`}</DescriptionFinal>
          <InnerContainer>
            <EndOfStory noOfEntries={6} isCameraSlide={true} storyKey={'onboard'} />
          </InnerContainer>
          <Link to="/chooseaction" component={TouchableOpacity}><ButtonContainer><LinkText>AWESOME, LET&#39;S GO!</LinkText></ButtonContainer></Link>
        </Container>
      );
    }

    return (
      <OuterContainer>
        <SwipeContainer onChangeIndex={this.highlightDot}
                        onTransitionEnd={this.animationEnd}
                        children = {childrenMinusOne}
                        index={swipeIndex}
        >
        </SwipeContainer>
      </OuterContainer>
    );
  }
}

export default OnboardingEntryList;

