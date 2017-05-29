/* @flow */

import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Link } from 'react-router-native';
import styled from 'styled-components/native';
import SwipeableViews from 'react-swipeable-views-native';
import StoryInGallerySingleEntry from '../StoryInGallerySingleEntry';
import StoryInGalleryEndOfStory from '../StoryInGalleryEndOfStory';

const SwipeContainer = styled(SwipeableViews)`
  flex: 1;
`;
const Container = styled.View`
  flex: 1;
`;
const Slide = styled(StoryInGallerySingleEntry)`
  flex: 1;
  padding:15;
  min-height:100;
  color:#fff;
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
const BackButtonContainer = styled.View`
  position:absolute;
  top:35;
  right:5;
  border-radius:50;
  background-color:rgba(174, 108, 0, .5);
  padding:5;
`;
const BackButton = styled.Image`
  width:30;
  height:30;
`;

class EntryList extends Component {
  props: {
    entries: Array<Object>,
    swipeIndex: number,
    firstPlayer: boolean,
    storyId: string,
    storyKey: string,
    reactions: Object
  };

  state: {
    currentIndex: number,
    cameraSlide: boolean,
    cameraSlideLoaded: boolean,
  };

  highlightDot: Function;
  animationEnd: Function;

  constructor() {
    super();

    this.state = {
      currentIndex: 0,
      cameraSlide:false,
      cameraSlideLoaded:false,
    };

    this.highlightDot = this.highlightDot.bind(this);
    this.animationEnd = this.animationEnd.bind(this);
  }

  componentWillReceiveProps(nextProps: Object){
    if(nextProps.swipeIndex != this.props.swipeIndex && nextProps.swipeIndex != this.state.currentIndex){
      this.setState({
        currentIndex: nextProps.swipeIndex,
        cameraSlideLoaded:false
      });
    }
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
  }

  render() {
    const { entries, swipeIndex, storyId, reactions } = this.props;
    const { currentIndex } = this.state;

    let dots = [];
    for (let i=0; i < entries.length+1; i++) {
      if(i == this.state.currentIndex ) {
        dots.push(<Container key={i}><PreviuosDot style={{marginBottom:4, marginTop:4}} key={i}/><CurrentDot key={i+1}/></Container>);
      } else {
        dots.push(<PreviuosDot key={i} />);
      }
    }

    return (
      <Container>
        <SwipeContainer onChangeIndex={this.highlightDot}
                        index={swipeIndex}
                        onTransitionEnd={this.animationEnd}
        >
          {entries.map(entry => (
            <Slide
              id={entry.id}
              src={entry.file.url}
              description={entry.description}
              key={entry.id}
              noOfEntries={entries.length}
              currentIndex={currentIndex}
            />
          ))}

          <StoryInGalleryEndOfStory storyId={storyId} reactions={reactions} noOfEntries={11} fromMyStories={false}  />
        </SwipeContainer>

        {currentIndex != entries.length &&
          <Dots>
            {dots}
          </Dots>
        }

        {currentIndex != entries.length &&
          <BackButtonContainer>
            <Link to="/" component={TouchableOpacity}><BackButton source={require('../CancelButton/CancelButton.png')}/></Link>
          </BackButtonContainer>
        }
      </Container>
    );
  }
}

export default EntryList;
