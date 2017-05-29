/* @flow */

import React, { Component } from 'react';
import { Alert, AsyncStorage, TouchableOpacity, Keyboard, Animated, Easing } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import styled from 'styled-components/native';
import Toolbar from '../ToolBar';

const TexturedContainer = styled.Image`
  flex:1;
  background-color:transparent;
  justify-content: center;
  align-items: center;
  resize-mode:cover;
  padding:40;
`;
const Container = styled.View`
  flex: 1;
`;
const ButtonContainer = styled.View`
  flex-direction:row;
  margin-bottom:0;
  background-color:#354259;
  border-radius:8;
  width: 200;
  justify-content:center;
  align-items:center;
`;
const LinkText = styled.Text`
  padding:15;
  font-size:16;
  text-align:center;
  color:#fff;
  font-family: Montserrat-Light;
`;
const BackButtonContainer = styled.View`
  position:absolute;
  top:0;
  left:0;
`;
const BackButton = styled.Image`
  transform: scale(0.8, 0.8) rotate(180deg);
  margin-top:-20;
`;
const Description = styled.Text`
    color: #354259;
    font-size:20;
    text-align:center;
    font-family: Montserrat-Light;
`;
const ErrorDescription = styled(Description)`
    font-size:16;
    font-family: LibreBaskerville-Regular;
    padding: 20 0;
    color:#720328;
`;
const CodeInput = styled.TextInput`
  align-self:stretch;
  border: 2 solid #354259;
  padding-right: 10;
  padding-left: 10;
  border-radius:8;
  font-family: Montserrat-Light;
  margin:20 0;
  text-align:center;
  font-size:16;
  color:#354259;
  background-color:#fff;
`;
const ToolbarWrapper = styled(Animated.View)`
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  height:50;
`;

class JoinStory extends Component {
  props: {
    onError: boolean,
    history: Object,
    updateStoryKey: Function,
    location: Object
  };

  state: {
    storyKeyInput: string,
    isError:boolean,
    animateIn:Object
  };

  handleSubmit: Function;
  keyboardDidShow: Function;
  keyboardDidHide: Function;
  keyboardDidHideListener: Function;
  keyboardDidShowListener: Function;

  constructor(){
    super();

    this.state = {
      storyKeyInput:'',
      isError:false,
      animateIn: new Animated.Value(0),
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  componentDidMount(){
    //if user entered incorrect story key
    if(this.props.location.state != undefined){
      if(this.props.location.state.isError) {
        this.setState({isError: true});
      }
    }
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  //if keyboard is visible, animate out the toolbar
  keyboardDidShow () {
    Animated.timing(
      this.state.animateIn,
      {
        toValue: 100,
        duration: 500,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();
  }

  //if keyboard is not active, show the toolbar
  keyboardDidHide () {
    Animated.timing(
      this.state.animateIn,
      {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();
  }

  handleSubmit(){
    const { history } = this.props;
    const { storyKeyInput } = this.state;
    const storyKey = storyKeyInput.toLowerCase();

    //check if user entered a code word
    if(storyKey.length != 0) {
      AsyncStorage.getItem(storyKey, (err, result) => {
        if( result == null ) {
          //if the story key is not set in local storage yet, set value to false - this player's turn is second
          AsyncStorage.setItem(storyKey, JSON.stringify(false));
        }
      });

      history.push(`/load/${storyKey}`);

    } else {
      Alert.alert("Please enter a valid code word");
    }
  }

  render() {
    return (
      <Container>
        <TexturedContainer source={require('../../assets/images/texture_9.png')} style={{height:undefined, width:undefined}} >
            {(this.state.isError )?(
              <ErrorDescription>Game was not found. Are you sure you entered the right code word?</ErrorDescription>
              ):(
              <Description>Enter the code word that&#39;s showing on your partner&#39;s phone</Description>
              )
            }
            <CodeInput
              placeholder="CODE WORD"
              placeholderTextColor={'#354259'}
              autoFocus = {true}
              onChangeText={(storyKeyInput) => this.setState({storyKeyInput})}
              value={this.state.storyKeyInput}
              onSubmitEditing={this.handleSubmit}
              autoCapitalize="characters"
              returnKeyType="send"
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity onPress={this.handleSubmit}>
              <ButtonContainer>
                <LinkText>LET&#39;S PLAY</LinkText>
              </ButtonContainer>
            </TouchableOpacity>
            <BackButtonContainer>
              <Link to="/chooseaction" component={TouchableOpacity}><BackButton source={require('../../assets/images/arrows/arrow_noBG_yellow.png')}/></Link>
            </BackButtonContainer>
            <ToolbarWrapper style={{transform:[{translateY:this.state.animateIn}]}}>
              <Toolbar />
            </ToolbarWrapper>
        </TexturedContainer>
      </Container>
    );
  }
}

export default withRouter(JoinStory);

