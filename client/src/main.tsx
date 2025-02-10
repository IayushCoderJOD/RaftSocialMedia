import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as ReactDOM from 'react-dom/client';
import App from './App';

import ThemeProvider from './context/theme';

const httpLink = createHttpLink({
  uri: 'https://merng.fly.dev/',
});

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ApolloProvider>
);
