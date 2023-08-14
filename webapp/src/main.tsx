import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client'

import { auth } from '../firebase/index.ts'

import '../firebase/index.ts'
import './styles/global.css'

const authLink = setContext(async (_, { headers }) => {
  const token = await auth.currentUser?.getIdToken()

  return {
    headers: {
      ...headers,
      authorization: token ?? '',
    }
  }
});

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  link: authLink.concat(createUploadLink({ uri: 'http://localhost:4000/graphql' }))
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
