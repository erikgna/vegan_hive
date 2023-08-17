import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client'

import { BASE_URL } from './constants/Url.ts';
import { auth } from '../firebase/index.ts';

import '../firebase/index.ts'
import './styles/global.css'

const authLink = setContext(async (_, { headers }) => {
  let token = localStorage.getItem('idToken');

  auth.onAuthStateChanged(async function (user) {
    if (user) {
      const idToken = await user.getIdToken()
      if (idToken !== token) {
        token = idToken;
        localStorage.setItem('idToken', idToken);
      }
    }
  });

  return {
    headers: {
      ...headers,
      authorization: token ?? '',
    }
  }
});

const formatDateLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    if (response.errors && response.errors[0].message.includes('Token is expired')) {
      localStorage.removeItem('idToken');
      localStorage.removeItem('user');
      auth.signOut();
      window.location.reload();
    }

    return response;
  });
});

const client = new ApolloClient({
  uri: `${BASE_URL}graphql`,
  cache: new InMemoryCache(),
  link: formatDateLink.concat(authLink.concat(createUploadLink({ uri: `${BASE_URL}graphql` })))
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
