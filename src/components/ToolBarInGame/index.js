/* @flow */

import React, { Component } from 'react';
import { TouchableOpacity, View, Alert, AsyncStorage } from 'react-native';
import styled from 'styled-components/native';
import { Link, withRouter } from 'react-router-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const ToolbarWrapper = styled.View`
  background-color:rgb(0, 18, 32);
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  flex-direction:row;
  justify-content:space-around;
  align-items:center;
  border-top-width:2;
  border-top-color:#720328;
  border-style:solid;
`;
const ToolbarItem = styled.View`
  flex-direction:column;
  align-items:center;
  justify-content:center;
  align-self:stretch;
  padding:5;
  flex:0.5;
`;
const ToolbarItemText = styled.Text`
  color:white;
`;
const ToolbarItemIcon = styled.Image`
  align-self:center;
  height:20;
  width:20;
`;

class ToolBarInGame extends Component {
  props: {
    endStoryEarly: Function,
    storyId:string,
    history:Object,
    doNotPublishStory:Function
  };

  onEndStoryEarly:Function;
  onPress:Function;

  constructor(){
    super();

    this.onEndStoryEarly = this.onEndStoryEarly.bind(this);
  }

  onEndStoryEarly(){
    Alert.alert(
      'Hey there,',
      'You are about to end this story early, are you sure? You wont be able to come back to finish it.',
      [
        {text: 'Nope', onPress: () => console.log('Cancel Pressed')},
        {text: "Yup, I'm bored", onPress: () => {
          this.props.endStoryEarly({
            variables: {
              id: this.props.storyId
            },
          });
          this.props.doNotPublishStory({
            variables: {
              id: this.props.storyId
            },
          });
          AsyncStorage.getAllKeys((err, keys) => {
            keys.map(key => {
              if (key !== 'auth0IdToken') {
                AsyncStorage.removeItem(key)
              }
            });
            this.props.history.push('/');
          });
        }},
      ],
      { cancelable: false }
    )
  }

  render(){

    return(
      <ToolbarWrapper>
        <ToolbarItem>
          <Link to="/onboard" component={ TouchableOpacity }>
            <View>
              <ToolbarItemIcon source={require('../../assets/images/menu/help2.png')} />
              <ToolbarItemText>Help</ToolbarItemText>
            </View>
          </Link>
        </ToolbarItem>
        <ToolbarItem>
          <TouchableOpacity onPress={this.onEndStoryEarly}>
            <View>
              <ToolbarItemIcon source={require('../../assets/images/menu/quit2.png')} />
              <ToolbarItemText>Quit</ToolbarItemText>
            </View>
          </TouchableOpacity>
        </ToolbarItem>
      </ToolbarWrapper>
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

const doNotPublishStory = gql`
  mutation($id:ID!){
  addToStoryOnPublished(storiesStoryId:$id, publishedsPublishedId:"cj1zcw0hp2d9o0191ef12axch"){
      storiesStory{
        id
      }
    }
  }
`;


export default withRouter(graphql(endStoryEarly, { name: 'endStoryEarly' })(graphql(doNotPublishStory, { name: 'doNotPublishStory' })(ToolBarInGame)));

