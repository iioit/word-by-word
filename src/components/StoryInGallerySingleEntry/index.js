/* @flow */

import React, { Component } from 'react';
import styled from 'styled-components/native';
import { TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import Swiper from '../Swiper';

const Container = styled(Animated.View)`
  flex:1;
`;
const Photo = styled.Image`
  flex: 1;
`;
const Description = styled(Animated.Text)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 18;
  color: #fff;
  font-family: Montserrat-ExtraLight;
  background-color: rgba(0, 18, 32, 0.7);
  padding:10 25 20;
`;
const TopBar = styled(Animated.View)`
  position: absolute;
  top: 0;
  right: 0;
  bottom:0;
  justify-content:center;
  align-items:center;
`;

class StoryInGallerySingleEntry extends Component {
  props: {
    src: string,
    description: string,
    revealToolbar:boolean,
    noOfEntries:number,
    hideSwiper:boolean,
  };

  state: {
    loaded:boolean
  };

  animatedValue1:Object;
  animatedValue2:Object;
  keepSwiping:Function;
  onPress:Function;
  onLoad:Function;

  constructor() {
    super();

    this.state = {loaded:false};

    this.animatedValue1 = new Animated.Value(0);
    this.animatedValue2 = new Animated.Value(0);
  }

  componentDidMount(){
    setTimeout(()=>{this.keepSwiping()}, 2000);
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
        setTimeout(()=>{this.keepSwiping()}, 400);
      } );
  }

  render() {
    const { src, description, revealToolbar, noOfEntries, hideSwiper } = this.props;
    const move = this.animatedValue1.interpolate({
      inputRange: [0, .1, 1],
      outputRange: [0, 0, -250]
    });
    const fade = this.animatedValue2.interpolate({
      inputRange: [0, .1, 1],
      outputRange: [0, 1, 0]
    });

    return (
      <TouchableWithoutFeedback onPress={revealToolbar}>
        <Container>
          <Photo source={this.state.loaded ? { uri: src } : require('../../assets/images/texture_9.png')} onLoad={(e) => this.setState({loaded: true})} />
          <Description>{description}</Description>

          {(noOfEntries == 1 && !hideSwiper) &&
            <TopBar style={{ opacity:fade, transform:[{translateX:move}]}}>
              <Swiper />
            </TopBar>
          }
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

export default StoryInGallerySingleEntry;
