import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Alert,
  Button,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { GET_STAR_WARS_FILMS } from '../graphql/queries';

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

const sortFilms = (films, order) =>
  [...films].sort((a, b) =>
    order === 'episode'
      ? a.episodeID - b.episodeID
      : a.releaseDate.localeCompare(b.releaseDate)
  );

const FilmCard = ({ film }) => {
  // The API returns the crawl with hard line breaks; join them into prose.
  const crawl = film.openingCrawl.replace(/\s+/g, ' ').trim();
  const titleId = `film-${film.id}-title`;

  return (
    <Card
      component="article"
      aria-labelledby={titleId}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="overline" color="text.secondary">
          Episode {ROMAN[film.episodeID] || film.episodeID}
        </Typography>
        <Typography id={titleId} variant="h5" component="h2" gutterBottom>
          {film.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Directed by {film.director} · Released {film.releaseDate.slice(0, 4)}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            my: 2,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {crawl}
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Chip size="small" label={`${film.characterConnection.totalCount} characters`} />
          <Chip size="small" label={`${film.planetConnection.totalCount} planets`} />
          <Chip size="small" label={`${film.speciesConnection.totalCount} species`} />
          <Chip size="small" label={`${film.starshipConnection.totalCount} starships`} />
        </Stack>
      </CardContent>
    </Card>
  );
};

const StarWarsPage = () => {
  const { data, loading, error, refetch } = useQuery(GET_STAR_WARS_FILMS);
  const [order, setOrder] = useState('episode');

  const films = useMemo(
    () => sortFilms(data?.allFilms?.films ?? [], order),
    [data, order]
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Star Wars Saga
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Loaded with a single GraphQL query to the public Star Wars API, including
          each film's cast, planet, species and starship counts.
        </Typography>

        <ToggleButtonGroup
          value={order}
          exclusive
          onChange={(_, value) => value && setOrder(value)}
          aria-label="Sort films"
          size="small"
          sx={{ mb: 3 }}
        >
          <ToggleButton value="episode">Episode order</ToggleButton>
          <ToggleButton value="release">Release order</ToggleButton>
        </ToggleButtonGroup>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }} role="status">
            <CircularProgress aria-label="Loading films" />
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            Could not load the Star Wars films. Please try again.
          </Alert>
        )}

        {!loading && !error && (
          <Grid container spacing={3}>
            {films.map((film) => (
              <Grid key={film.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <FilmCard film={film} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default StarWarsPage;
