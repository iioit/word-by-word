/* @flow */

import React, { Component } from 'react';
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

  constructor() {
    super();

    this.state = {
      useFlash: false,
      shutterOpacity: 1,
    };

    this.takePicture = this.takePicture.bind(this);
    this.handleFlashPress = this.handleFlashPress.bind(this);
  }

  componentDidMount() {
    if(this.props.isAlertVisible){
      this.setState({shutterOpacity: 0,})
    } else {
      this.setState({shutterOpacity: 1,})
    }
  }
  componentWillReceiveProps(nextProps: Object) {
    if(nextProps.isAlertVisible){
      this.setState({shutterOpacity: 0,})
    } else {
      this.setState({shutterOpacity: 1,})
    }
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
    const { useFlash, shutterOpacity } = this.state;

    return (
      <Container>
        {(noOfEntries == currentIndex) &&
        <StyledCamera
          innerRef={camera => {
            this.camera = camera;
          }}
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

          <ShutterButton onPress={this.takePicture} opacity={shutterOpacity} />

        </StyledCamera>
        }
      </Container>
    );
  }
}

export default CameraView;
