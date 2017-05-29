/* @flow */

import { WS_ENDPOINT, GRAPHQL_ENDPOINT } from 'react-native-dotenv';
import React from 'react';
import { AsyncStorage } from 'react-native';
import App from './components/App';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

const wsClient = new SubscriptionClient(WS_ENDPOINT, {
  reconnect: true,
});

const networkInterface = createNetworkInterface({
  uri: GRAPHQL_ENDPOINT,
});

networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }

    AsyncStorage.getItem('auth0IdToken').then(
      token => {
        req.options.headers['authorization'] = `Bearer ${token}`;
        next()
      },
      failure => {
        console.error('ERROR: no token', failure)
        next()
      }
    );
  },
}]);

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
});

const WordByWord = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

export default WordByWord;
