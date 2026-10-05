import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { ThemeProvider, createTheme } from '@mui/material';
import StarWarsPage from './StarWarsPage';
import { GET_STAR_WARS_FILMS } from '../graphql/queries';

// MockedProvider adds __typename to every selection, so the mock data
// carries the type names that the real SWAPI schema returns.
const film = (id, title, episodeID, releaseDate) => ({
  __typename: 'Film',
  id,
  title,
  episodeID,
  releaseDate,
  director: 'George Lucas',
  openingCrawl: 'It is a period of civil war.\r\nRebel spaceships, striking',
  characterConnection: { __typename: 'FilmCharactersConnection', totalCount: 18 },
  planetConnection: { __typename: 'FilmPlanetsConnection', totalCount: 3 },
  speciesConnection: { __typename: 'FilmSpeciesConnection', totalCount: 5 },
  starshipConnection: { __typename: 'FilmStarshipsConnection', totalCount: 8 },
});

// Returned in release order, as the real API does.
const films = [
  film('1', 'A New Hope', 4, '1977-05-25'),
  film('2', 'The Empire Strikes Back', 5, '1980-05-17'),
  film('3', 'The Phantom Menace', 1, '1999-05-19'),
];

const successMock = {
  request: { query: GET_STAR_WARS_FILMS },
  result: { data: { allFilms: { __typename: 'FilmsConnection', films } } },
};

const errorMock = {
  request: { query: GET_STAR_WARS_FILMS },
  error: new Error('Network error'),
};

// The ripple animation updates state after clicks, which only adds act() noise.
const testTheme = createTheme({
  components: { MuiButtonBase: { defaultProps: { disableRipple: true } } },
});

const renderPage = (mocks) =>
  render(
    <ThemeProvider theme={testTheme}>
      <MockedProvider mocks={mocks}>
        <StarWarsPage />
      </MockedProvider>
    </ThemeProvider>
  );

const filmTitles = () =>
  screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);

test('shows a loading indicator, then the films in episode order', async () => {
  renderPage([successMock]);

  expect(screen.getByRole('status')).toBeInTheDocument();

  await screen.findByText('A New Hope');
  expect(filmTitles()).toEqual(['The Phantom Menace', 'A New Hope', 'The Empire Strikes Back']);
});

test('renders nested data returned by the single query', async () => {
  renderPage([successMock]);

  const card = await screen.findByRole('article', { name: 'A New Hope' });

  expect(within(card).getByText('Episode IV')).toBeInTheDocument();
  expect(within(card).getByText('18 characters')).toBeInTheDocument();
  expect(within(card).getByText('8 starships')).toBeInTheDocument();
  // Hard line breaks from the API are joined into one paragraph.
  expect(within(card).getByText('It is a period of civil war. Rebel spaceships, striking')).toBeInTheDocument();
});

test('switches to release order', async () => {
  renderPage([successMock]);
  await screen.findByText('A New Hope');

  await userEvent.click(screen.getByRole('button', { name: 'Release order' }));

  expect(filmTitles()).toEqual(['A New Hope', 'The Empire Strikes Back', 'The Phantom Menace']);
});

test('shows an error with a retry button when the query fails', async () => {
  renderPage([errorMock, successMock]);

  expect(await screen.findByText(/could not load the star wars films/i)).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Retry' }));

  expect(await screen.findByText('A New Hope')).toBeInTheDocument();
});
