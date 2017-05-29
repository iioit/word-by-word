/* @flow */
import { Auth0_clientId, Auth0_domain } from 'react-native-dotenv';
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter, Redirect } from 'react-router-native';
import styled from 'styled-components/native';
import Auth0Lock from 'react-native-lock';
import LoginScreenCheckUser from '../LoginScreenCheckUser';
import LoaderWithBackground from '../LoaderWithBackground';
import ErrorScreen from '../ErrorScreen';

const Container = styled.View`
  flex: 1;
`;

class LoginScreen extends Component {
  state: {
    shouldCreateUser:boolean,
    receivedToken: ?Object,
    goBackTo:string,
    userName:string
  };

  lock: {
    clientId:string,
    domain:string,
    useBrowser:boolean,
    show:Function,
  };

  constructor() {
    super();

    this.state = { shouldCreateUser:false, receivedToken:null, userName:'', goBackTo:'' }

    this.lock = new Auth0Lock({
      clientId: Auth0_clientId,
      domain: Auth0_domain,
      useBrowser: true,
    });
  }

  componentDidMount(){
    let listOfLocations= this.props.history.entries;
    let previousLocation = listOfLocations[listOfLocations.length-2].pathname;
    this.setState({goBackTo: (previousLocation!= "/mmfirsttime") ? previousLocation : "/"})
  }

  render() {
    const { shouldCreateUser, receivedToken, userName, goBackTo } = this.state;

    if (this.props.data.loading) {
      return (
        <LoaderWithBackground />
      );
    }

    if (this.props.data.error) {
      return (
        <ErrorScreen />
      );
    }

    // redirect if user is logged in or did not complete the authentication
    if (this.props.data.user || AsyncStorage.getItem('auth0IdToken') === null) {
      return (
        <Redirect to={goBackTo} />
      );
    }

    //log in the user
    if (!shouldCreateUser) {
      return (
        <Container>
          {this.lock.show({}, (err, profile, token) => {
            if (err) {
              console.log(err);
              return;
            }
            AsyncStorage.setItem('auth0IdToken', token.idToken);
            this.setState({receivedToken: token, userName:profile.name, shouldCreateUser:true})
          })}
        </Container>
      );
    }

    //check if there is a need to create a new user in the database
    if (shouldCreateUser) {
      return(
        <LoginScreenCheckUser token={receivedToken} userName={userName} goBackTo={goBackTo} />
      )
    }
  }
}

const userQuery = gql`
  query {
    user {
      id
    }
  }
`;

export default graphql(userQuery, { options: { fetchPolicy: 'network-only' }})(withRouter(LoginScreen));

