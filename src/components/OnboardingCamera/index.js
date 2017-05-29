/* @flow */

import React, { Component } from 'react';
import { Animated, Easing, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import Camera from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';
import FlashButton from '../FlashButton';
import ShutterButton from '../ShutterButton';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
`;
const StyledCamera = styled(Camera)`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;
const TopBar = styled.View`
  background-color: black;
  flex-direction: row;
  padding: 10;
  justify-content: space-between;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 11;
`;
const ShutterBubble = styled(Animated.View)`
  border-radius: 50;
  height: 90;
  width: 90;
  background-color:rgba(255, 255, 255, 0.7);
  position:absolute;
  bottom:30;
  align-self:center;
`;

class CameraView extends Component {
  props: {
    onPictureTaken: Function,
    noOfEntries: number,
    currentIndex: number,
    isAlertVisible: boolean
  };
  state: {
    useFlash: boolean,
    shutterOpacity: number,
  };

  camera: ?Object;
  takePicture: Function;
  handleFlashPress: Function;
  blinkShutter: Function;
  animatedValue: Object;

  constructor() {
    super();

    this.state = {
      useFlash: false,
      shutterOpacity: 1,
    };

    this.takePicture = this.takePicture.bind(this);
    this.handleFlashPress = this.handleFlashPress.bind(this);
    this.animatedValue = new Animated.Value(0);
    this.blinkShutter = this.blinkShutter.bind(this);
  }

  componentDidMount() {
    setTimeout(()=>{this.blinkShutter()}, 3000);
  }

  blinkShutter(){
    this.animatedValue.setValue(0);
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.cubic)
      },
    ).start(() => {
      setTimeout(()=>{this.blinkShutter()}, 50);
    });
  }

  takePicture() {
    if (this.camera) {
      this.camera
        .capture()
        .then(data => {
          ImageResizer.createResizedImage(
            data.path,
            1500,
            1500,
            'JPEG',
            60
          ).then(resizedImageUri => {
            this.props.onPictureTaken(resizedImageUri);
          });
        })
        .catch(err => console.error(err));
    }
  }

  handleFlashPress() {
    this.setState(previousState => ({
      useFlash: !previousState.useFlash,
    }));
  }

  render() {
    const { noOfEntries, currentIndex } = this.props;
    const { useFlash } = this.state;
    const blink = this.animatedValue.interpolate({
      inputRange:[0, 0.5, 1],
      outputRange:[0,1.1, 1.6]
    });
    const opacityBlink = this.animatedValue.interpolate({
      inputRange:[0, 0.2, 0.8, 1],
      outputRange:[0, 1, 1, 0]
    });

    return (
      <Container>
        {(noOfEntries == currentIndex) &&
          <StyledCamera innerRef={camera => { this.camera = camera; }}
            aspect={Camera.constants.Aspect.fill}
            orientation={Camera.constants.Orientation.portrait}
            captureQuality={Camera.constants.CaptureQuality.medium}
            captureTarget={Camera.constants.CaptureTarget.disk}
            flashMode={
              useFlash
                ? Camera.constants.FlashMode.auto
                : Camera.constants.FlashMode.off
            }
          >

          <TopBar>
            <FlashButton onPress={this.handleFlashPress} useFlash={useFlash}/>
          </TopBar>

          <ShutterButton onPress={this.takePicture} opacity={this.state.shutterOpacity} />

          <TouchableWithoutFeedback  onPress={this.takePicture}>
            <ShutterBubble
               style={{
                  opacity:opacityBlink,
                  transform:[{scale:blink}]
               }}
            />
          </TouchableWithoutFeedback>
        </StyledCamera>
      }
      </Container>
    );
  }
}

export default CameraView;
