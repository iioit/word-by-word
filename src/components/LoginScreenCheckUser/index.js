/* @flow */
import { Auth0_clientId, Auth0_domain } from 'react-native-dotenv';
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter, Redirect } from 'react-router-native';
import Auth0Lock from 'react-native-lock';
import LoaderWithBackground from '../LoaderWithBackground';
import ErrorScreen from '../ErrorScreen';

class LoginScreenCheckUser extends Component {
  props: {
    createUser: Function,
    history:Object,
    data:Object,
    goBackTo:string,
    token:string,
    userName:string
  };

  createUser:Function;

  constructor() {
    super();

    this.createUser = this.createUser.bind(this);
  }

  createUser(token) {
    const variables = {
      idToken: token.idToken,
      userName: this.props.userName
    };

    this.props.createUser({ variables })
      .then((response) => {
        this.props.history.push(`${this.props.goBackTo}`)
      }).catch((e) => {
      console.error(e);
      this.props.history.push('/login')
    })
  }

  render() {
    const { data, token, goBackTo} = this.props;

    if (data.loading) {
      return (
        <LoaderWithBackground />
      );
    }

    if (data.error) {
      return (
        <ErrorScreen />
      );
    }

    if (data.user) {
      return (
        //redirect if user already exists in the database
        <Redirect to={goBackTo} />
      );
    } else {
      //create a new user in the database
      this.createUser(token);
    }

    return (
      <Redirect to={goBackTo} />
    );
  }
}

const createUser = gql`
  mutation ($idToken: String!, $userName: String){
    createUser(authProvider: {auth0: {idToken: $idToken}}, name:$userName) {
      id
    }
  }
`;

const userQuery = gql`
  query {
    user {
      id
    }
  }
`;

export default graphql(createUser, {name: 'createUser'})(
  graphql(userQuery, { options: { fetchPolicy: 'network-only' }})
  (withRouter(LoginScreenCheckUser))
)
