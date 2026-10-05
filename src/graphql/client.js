import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Public Star Wars API (SWAPI) exposed over GraphQL. It allows cross-origin
// requests, so the browser can call it directly without a proxy.
export const SWAPI_GRAPHQL_URL = 'https://swapi-graphql.netlify.app/graphql';

export const createApolloClient = () =>
  new ApolloClient({
    link: new HttpLink({ uri: SWAPI_GRAPHQL_URL }),
    // Normalised cache: revisiting the page reuses the stored result
    // instead of sending the query again.
    cache: new InMemoryCache(),
  });

const client = createApolloClient();

export default client;
