/* @flow */

import React, { Component } from 'react';
import styled from 'styled-components/native';
import { TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import Swiper from '../Swiper';

const Container = styled(Animated.View)`
  flex:1;
`;
const Photo = styled(Animated.Image)`
  flex: 1;
  border-color:#354259;
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
class Entry extends Component {
  props: {
    src: string,
    description: string,
    revealToolbar:boolean,
    noOfEntries:number,
    hideSwiper:boolean,
    withToolbar:boolean,
    storyInitialized:boolean
  };

  state: {
    loaded:boolean
  };

  animatedValue1:Object;
  animatedValue2:Object;
  animatedValue3:Object;
  animatedValue4:Object;
  animatedValue5:Object;

  constructor() {
    super();

    this.state = {loaded:false};

    this.animatedValue1 = new Animated.Value(0);
    this.animatedValue2 = new Animated.Value(0);
    this.animatedValue3 = new Animated.Value(0);
    this.animatedValue4 = new Animated.Value(0);
    this.animatedValue5 = new Animated.Value(0);
  }

  componentDidMount(){
    //offset entry's position only for the initial story load
    if(!this.props.storyInitialized) {
      this.animatedValue4.setValue(-70);
      this.animatedValue3.setValue(50);
      this.animatedValue5.setValue(8);
    }

    setTimeout(()=>{this.keepSwiping()}, 2000);
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
    this.animatedValue4.setValue(-70);
    Animated.timing(
      this.animatedValue4,
      {
        toValue: 0,
        duration: 200,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();

    this.animatedValue3.setValue(50);
    Animated.timing(
      this.animatedValue3,
      {
        toValue: 0,
        duration: 200,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();

    this.animatedValue5.setValue(8);
    Animated.timing(
      this.animatedValue5,
      {
        toValue: 0,
        duration: 200,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();
  }

  scaleDownView(){
    this.animatedValue3.setValue(0);
    Animated.timing(
      this.animatedValue3,
      {
        toValue: 50,
        duration: 200,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();

    this.animatedValue4.setValue(0);
    Animated.timing(
      this.animatedValue4,
      {
        toValue: -70,
        duration: 200,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();

    this.animatedValue5.setValue(0);
    Animated.timing(
      this.animatedValue5,
      {
        toValue: 8,
        duration: 200,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();
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
      <Container style={{paddingLeft:this.animatedValue3, paddingRight:this.animatedValue3, marginLeft:this.animatedValue4}}>
        <Photo source={this.state.loaded ? { uri: src } : require('../../assets/images/texture_9.png')} onLoad={(e) => this.setState({loaded: true})} style={{ borderWidth:this.animatedValue5 }} />
        <Description style={{marginLeft:this.animatedValue3, marginRight:this.animatedValue3}}>{description}</Description>

        {(noOfEntries == 1 && !hideSwiper) &&
        <TopBar
          style={{
              opacity:fade,
              transform:[
                {translateX:move}
              ]
              }}
        >
        <Swiper />
        </TopBar>
        }

      </Container>
      </TouchableWithoutFeedback>
    );
  }
}

export default Entry;
