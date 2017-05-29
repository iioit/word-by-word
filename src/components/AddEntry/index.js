/* @flow */

import { FILE_ENDPOINT } from 'react-native-dotenv';
import React, { Component } from 'react';
import { TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import styled from 'styled-components/native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Camera from '../Camera';
import EntryPreview from '../EntryPreview';
import LoaderWithBackground from '../LoaderWithBackground';

const Container = styled.View`
  flex: 1;
`;
const CustomAlertContainer = styled.TouchableOpacity`
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  justify-content: center;
  align-items: center;
  background-color: rgba(255,255,255,0.7);
  padding:10;
  flex-direction:column;
`;
const CustomAlertContent = styled.Text`
  font-family: Montserrat-Light;
  font-size:16;
  background-color:#fff;
  flex:90;
  border-radius:8;
  padding:20;
  color:#354259;
`;
const Tip = styled.View`
  height:10;
  flex:1;
  top:20;
  margin-top:-10;
  border-left-color:#fff;
  border-bottom-color: transparent;
  border-right-color: transparent;
  border-top-color: transparent;
  border-width:10;
`;
const CustomAlertContentWrapper = styled.View`
  flex-direction:row;
  justify-content: space-around;
`;
const CustomAlertContentInnerWrapper = styled.View`
  flex-direction:row;
  flex:2;
  align-items: flex-start;
`;
const Icon = styled.Image`
  flex:1;
  border-radius:8;
  height:120;
  resize-mode:cover;
  justify-content:center;
  align-self:flex-start;
`;
const ButtonContainer = styled.View`
  flex-direction:row;
  background-color:#354259;
  border-radius:8;
  width: 200;
  justify-content:center;
  align-items:center;
  position: absolute;
  bottom:20;
`;
const LinkText = styled.Text`
  padding:15;
  font-size:16;
  text-align:center;
  color:#fff;
  font-family: Montserrat-Light;
`;

class AddEntry extends Component {
  props: {
    storyId: string,
    noOfEntries: number,
    currentIndex: number,
    previousEntryText: string,
    createEntryMutation: Function,
    endStoryEarly:boolean,
    updateEndScreen:Function
  };
  state: {
    inputValues: {
      firstInput: string,
      lastInput: string,
    },
    photoPreview: ?{
      uri: string,
    },
    photoSource: ?{
      uri: string,
      id: string,
    },
    uploading: boolean,
    sending: boolean,
    isAlertVisible: boolean,
    firstTyped:boolean,
    lastTyped:boolean,
    endStoryEarlyChecked:boolean,
    showBackground:boolean
  };

  handleSubmit: Function;
  handlePictureTaken: Function;
  handleCancelPress: Function;
  handleDescriptionChange: Function;
  hideCustomAlert: Function;

  constructor() {
    super();

    this.state = {
      photoPreview: null,
      photoSource: null,
      inputValues: { firstInput: '', lastInput: '' },
      uploading: false,
      sending: false,
      isAlertVisible: true,
      firstTyped:false,
      lastTyped:false,
      endStoryEarlyChecked:false,
      showBackground:false
    };

    this.handlePictureTaken = this.handlePictureTaken.bind(this);
    this.handleCancelPress = this.handleCancelPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.hideCustomAlert = this.hideCustomAlert.bind(this);
  }

  uploadPhoto(file: string): Object {
    const photo = {
      uri: file,
      type: 'image/jpeg',
      name: `${Date.now()}.jpg`,
    };

    const formData = new FormData();
    formData.append('data', photo);

    return new Promise((resolve, reject) => {
      this.setState(previousState => ({ uploading: true }));

      fetch(FILE_ENDPOINT, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          this.setState(
            previousState => ({ uploading: false }),
            () => {
              resolve(data);
            }
          );
        })
        .catch(error => {
          console.log('Upload error: ', error);
        });
    });
  }

  hideCustomAlert(){
    this.setState({
      isAlertVisible: false,
    });

    if(this.props.endStoryEarly){
      this.setState({
        endStoryEarlyChecked: true,
      });
    }
  }

  handleCancelPress() {
    this.setState(previousState => ({
      photoPreview: null,
      photoSource: null,
      uploading: false,
      sending: false,
      inputValues: { firstInput: '', lastInput: '',},
      firstTyped:false,
      lastTyped:false
    }));
  }

  handlePictureTaken(file: string) {
    const photoPreview = { uri: file };
    this.setState(() => ({ photoPreview }));

    this.uploadPhoto(file).then(data => {
      const photoSource = { uri: data.url, id: data.id };
      this.setState(() => ({ photoSource }));
    });
  }

  handleSubmit(event: Object) {
    this.setState(() => ({ sending: true }));

    if (this.state.uploading) {
      this.setState(() => ({ sending: false }));
      setTimeout(this.handleSubmit, 300);

      return;
    } else {
      const { createEntryMutation, noOfEntries, updateEndScreen, storyId } = this.props;
      const { inputValues, photoSource, endStoryEarlyChecked } = this.state;
      if(inputValues.firstInput != '' && (inputValues.lastInput != '' && inputValues.lastInput != undefined)) {
        const descriptions = Object.keys(inputValues).map(
          key => inputValues[key]
        );
        const assignedPhotoSource = photoSource;

        this.setState(previousState => ({
          photoPreview: null,
          photoSource: null,
          uploading: false,
          sending: false,
          inputValues: { firstInput: '', lastInput: '',},
          firstTyped:false,
          lastTyped:false
        }));

        this.setState({
          isAlertVisible: true,
          showBackground:true,
        });

        createEntryMutation({
            variables: {
              fileId: assignedPhotoSource && assignedPhotoSource.id,
              description: descriptions.join(' '),
              storyId: storyId,
            },
          }).then(()=> {
            switch(noOfEntries){
              case 1:
              case 2:
                ToastAndroid.show('Good start!', ToastAndroid.LONG);
                break;
              case 3:
              case 4:
                ToastAndroid.show('Nice! Have you done this before?', ToastAndroid.LONG);
                break;
              case 5:
              case 6:
                ToastAndroid.show('And WHOOSH it goes off to your friend...', ToastAndroid.LONG);
                break;
              case 7:
              case 8:
                ToastAndroid.show('Most excellent! I smell a Pulitzer...', ToastAndroid.LONG);
                break;
              case 9:
              case 10:
                ToastAndroid.show("Supah! That's just a hell of a story!", ToastAndroid.LONG);
                break;
            }

            if(endStoryEarlyChecked){
              updateEndScreen(true);
            }
        });


      } else {
        Alert.alert(
          'Hey there,',
          'please, complete your story line.',
        );
        this.setState(() => ({ sending: false }));
      }
    }
  }

  handleDescriptionChange(ref, input) {

    if (ref === 'firstInput') {
      if(!this.state.firstTyped){
        this.setState(previousState => ({
          inputValues: {
            ...previousState.inputValues,
            firstInput: '...' + input,
          },
          firstTyped: true,
        }));
      }else{
        this.setState(previousState => ({
          inputValues: {
            ...previousState.inputValues,
            firstInput:  input,
          },
        }));
      }
    } else if (ref === 'lastInput') {
      if(!this.state.lastTyped) {
        this.setState(previousState => ({
          inputValues: {
            ...previousState.inputValues,
            lastInput: input + (this.props.noOfEntries != 10 ? '...' : '.'),
          },
          lastTyped:true,
        }));
      }else{
        this.setState(previousState => ({
        inputValues: {
          ...previousState.inputValues,
          lastInput: input,
        },
      }));
      }
    }
  }

  render() {
    const { noOfEntries, currentIndex, previousEntryText, endStoryEarly } = this.props;
    const {
      photoPreview,
      photoSource,
      inputValues,
      sending,
      isAlertVisible,
      showBackground
    } = this.state;

    const shouldAlert = (noOfEntries == 1 || noOfEntries == 5 || noOfEntries == 8 || noOfEntries == 9 ||noOfEntries == 10 || endStoryEarly) && isAlertVisible;

    let alertText = ['Any ideas of what happened there?', '', '', '',
      'Hey there, you’re half way through. Something big has to happen now!', '', '',
      "Umm… you're almost at the end. Try wrapping this up.",
      'Darling, this is your last one. Give your partner some inspiration for the end.',
      '…and here comes the grand finale…'];

    let alertSpecial = "Your partner just bailed on you, so it's up to you to find the perfect ending to this story... now";

    if (!photoPreview) {
      if(!showBackground) {
        return (
          <Container>
            <Camera onPictureTaken={this.handlePictureTaken} noOfEntries={noOfEntries} currentIndex={currentIndex} isAlertVisible={shouldAlert}/>

            {shouldAlert &&
            <CustomAlertContainer onPress={this.hideCustomAlert}>
              <CustomAlertContentWrapper>
                <CustomAlertContentInnerWrapper>
                  <CustomAlertContent>{!endStoryEarly ? alertText[noOfEntries - 1] : alertSpecial}</CustomAlertContent>
                  <Tip />
                </CustomAlertContentInnerWrapper>
                <Icon source={require('../../assets/images/head.png')}/>
              </CustomAlertContentWrapper>
              <ButtonContainer>
                <TouchableOpacity onPress={this.hideCustomAlert}><LinkText>GOT IT!</LinkText></TouchableOpacity>
              </ButtonContainer>
            </CustomAlertContainer>
            }
          </Container>
        );
      }else{
        return (
          <LoaderWithBackground/>
        );
      }
    }

    return (
      <EntryPreview
        photoPreview={photoPreview}
        photoSource={photoSource}
        inputValues={inputValues}
        sending={sending}
        handleSubmit={this.handleSubmit}
        previousEntryText={previousEntryText}
        handleCancelPress={this.handleCancelPress}
        handleTextChange={this.handleDescriptionChange}
      />
    );
  }
}

const createEntry = gql`mutation
  createEntry($fileId: ID!, $description: String!, $storyId:[ID!]) {
    createEntry(fileId: $fileId, description: $description, storiesIds: $storyId, starter: Blank) {
      id
      description
      file {
        url
      }
    }
  }
`;

export default graphql(createEntry, { name: 'createEntryMutation' })(AddEntry);
