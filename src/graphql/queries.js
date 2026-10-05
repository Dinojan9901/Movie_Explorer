import { gql } from '@apollo/client';

// One request returns every film plus nested counts (characters, planets,
// species, starships). Over a REST API such as SWAPI's own, the same page
// would need a request per film and per related resource.
export const GET_STAR_WARS_FILMS = gql`
  query GetStarWarsFilms {
    allFilms {
      films {
        id
        title
        episodeID
        releaseDate
        director
        openingCrawl
        characterConnection {
          totalCount
        }
        planetConnection {
          totalCount
        }
        speciesConnection {
          totalCount
        }
        starshipConnection {
          totalCount
        }
      }
    }
  }
`;
