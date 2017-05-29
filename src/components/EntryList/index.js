/* @flow */

import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import SwipeableViews from 'react-swipeable-views-native';
import Entry from '../Entry';
import AddEntry from '../AddEntry';
import EndOfStory from '../EndOfStory';

const SwipeContainer = Animated.createAnimatedComponent(SwipeableViews);
const MainContainer = styled.View`
  flex:1;
  background-color:rgba(0, 18, 32, .4);
`;
const Container = styled.View`
  flex: 1;
`;
const Slide = styled(Entry)`
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

class EntryList extends Component {
  props: {
    entries: Array<Object>,
    swipeIndex: number,
    firstPlayer: boolean,
    storyId: string,
    storyKey: string,
    withToolbar:boolean,
    hideSwiper:boolean,
    revealToolbar:Function,
    endStoryEarly:boolean,
    storyInitialized:boolean
  };

  state: {
    currentIndex: number,
    cameraSlide: boolean,
    cameraSlideLoaded: boolean,
    updateEndScreen: boolean,
    animateIn: Object,
  };

  highlightDot: Function;
  onUpdateEndScreen: Function;
  animationEnd: Function;
  scaleUpView: Function;
  scaleDownView: Function;
  animatedValue: Object;
  animatedValue2: Object;

  constructor() {
    super();

    this.state = {
      currentIndex: 0,
      cameraSlide:false,
      cameraSlideLoaded:false,
      updateEndScreen:false,
      animateIn: new Animated.Value(50),
    };

    this.highlightDot = this.highlightDot.bind(this);
    this.onUpdateEndScreen = this.onUpdateEndScreen.bind(this);
    this.animationEnd = this.animationEnd.bind(this);
    this.scaleUpView = this.scaleUpView.bind(this);
    this.scaleDownView = this.scaleDownView.bind(this);
    this.animatedValue = new Animated.Value(0);
    this.animatedValue2 = new Animated.Value(0);
  }

  componentDidMount(){
    this.scaleDownView();
  }

  componentWillReceiveProps(nextProps: Object){
    if(nextProps.swipeIndex != this.props.swipeIndex && nextProps.swipeIndex != this.state.currentIndex){
      this.setState({
        currentIndex: nextProps.swipeIndex,
        cameraSlideLoaded:false
      });
    }
    if(nextProps.withToolbar != this.props.withToolbar) {
      if(nextProps.withToolbar){
        this.scaleDownView();
      } else{
        this.scaleUpView();
      }
    }
  }

  scaleUpView(){
    this.animatedValue.setValue(50);
    Animated.timing(
      this.animatedValue,
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
        toValue: 50,
        duration: 200,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();
  }

  highlightDot(index: number){
    this.setState({
      currentIndex: index,
    });
    if(index == this.props.entries.length){
      this.setState({
        cameraSlide:true
      });
    }else{
      this.setState({
        cameraSlide:false
      });
    }
  }

  onUpdateEndScreen(){
    this.setState({updateEndScreen:true});
  }

  animationEnd(){
    if(this.state.cameraSlide){
      this.setState({
        cameraSlideLoaded:true,
      });
    } else {
      this.setState({
        cameraSlideLoaded:false,
      });
    }

    //if slided with toolbar visible - hide the toolbar at the end of the slide
    if(this.props.withToolbar){
      this.props.revealToolbar();
    }
  }

  render() {
    const { entries, swipeIndex, storyId, firstPlayer, storyKey, endStoryEarly, revealToolbar, hideSwiper, withToolbar, storyInitialized }  = this.props;
    const { cameraSlideLoaded, updateEndScreen, currentIndex } = this.state;
    const isOdd = entries.length % 2;
    let thisPlayersTurn;
    //toggle player's turn
    if(!endStoryEarly) {
      thisPlayersTurn = firstPlayer && isOdd == 1 || !firstPlayer && isOdd == 0;
    } else {
      thisPlayersTurn = true;
    }

    let dots = [];
    //ingame progress bar
    for (let i=0; i < 11; i++) {
      if(i == currentIndex ) {
        dots.push(<Container  key={i}><PreviuosDot style={{marginBottom:4, marginTop:4}} key={i}/><CurrentDot key={i+1}/></Container>);
      } else if (i < entries.length) {
        dots.push(<PreviuosDot key={i} />);
      } else {
        dots.push(<Dot key={i} />);
      }
    }

    return (
      <MainContainer>
        <SwipeContainer onChangeIndex={this.highlightDot}
                        index={swipeIndex}
                        onTransitionEnd={this.animationEnd}
                        hysteresis={0.4}
                        style={{paddingBottom:this.animatedValue}}
        >
          {entries.map(entry => (
            <Slide
              id={ entry.id }
              src={ entry.file.url }
              description={ entry.description }
              key={entry.id}
              noOfEntries={entries.length}
              currentIndex={ currentIndex }
              revealToolbar={ revealToolbar }
              hideSwiper = { hideSwiper }
              withToolbar={ withToolbar }
              storyInitialized={storyInitialized}
            />
          ))}

          {(entries.length < 11 && cameraSlideLoaded && thisPlayersTurn && !updateEndScreen) ? (
              <AddEntry noOfEntries={entries.length}
                        currentIndex={currentIndex}
                        storyId={storyId}
                        previousEntryText={entries[entries.length-1].description}
                        endStoryEarly={endStoryEarly}
                        updateEndScreen={this.onUpdateEndScreen}
              />
            ) : (
              <EndOfStory withToolbar={withToolbar} noOfEntries={entries.length} isCameraSlide={cameraSlideLoaded} storyKey={storyKey} storyId={storyId} shouldEndStoryEarly={updateEndScreen}  revealToolbar={revealToolbar}
              />
            )}
        </SwipeContainer>
        {currentIndex != entries.length &&
          <Dots>
          {dots}
          </Dots>
        }
      </MainContainer>
    );
  }
}

export default EntryList;
