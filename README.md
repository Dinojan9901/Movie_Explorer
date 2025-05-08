# 🎬 Movie Explorer – Discover Your Favorite Films

A modern, responsive web application for discovering and exploring movies using the TMDb (The Movie Database) API.

![Movie Explorer Screenshot](https://api.lorem.space/image/movie?w=1200&h=600)

## 📋 Features

- **User Authentication**: Simple login functionality with username/password
- **Movie Discovery**: Browse trending movies and search for specific titles
- **Detailed Movie Information**: View comprehensive details including synopsis, cast, ratings, and trailers
- **Responsive Design**: Mobile-first approach that works across all devices
- **Dark/Light Mode**: Toggle between light and dark themes for better user experience
- **Favorites**: Save your favorite movies for quick access (requires login)
- **Infinite Scrolling**: Load more content as you scroll for a seamless experience

## 🚀 Technology Stack

- **React**: Frontend library for building the user interface
- **Redux**: State management with Redux Toolkit for efficient data handling
- **React Router**: Navigation and routing between different views
- **Material UI**: Modern, responsive component library for consistent design
- **Axios**: HTTP client for API requests
- **TMDb API**: External API for fetching movie data

## ⚙️ Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TMDb API Key ([Get one here](https://www.themoviedb.org/documentation/api))

### Installation Steps

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd movie-explorer
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   - Rename the `.env` file to `.env.local`
   - Replace `YOUR_TMDB_API_KEY_HERE` with your actual TMDb API key

4. Start the development server
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
├── public/                 # Public assets
├── src/                    # Source files
│   ├── assets/             # Static assets
│   ├── components/         # Reusable components
│   │   ├── common/         # Common UI components
│   │   └── movie/          # Movie-specific components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── redux/              # Redux state management
│   │   └── slices/         # Redux toolkit slices
│   ├── services/           # API and other services
│   └── utils/              # Utility functions
├── .env                    # Environment variables
└── README.md              # Project documentation
```

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects the app from Create React App

## 📱 Deployment

The application can be deployed using any static site hosting service like Vercel, Netlify, or GitHub Pages.

### Deployment Steps (Vercel example)

1. Create a production build:
   ```bash
   npm run build
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

## 🧩 API Usage

This project uses the TMDb API v3. The main endpoints used are:

- `/trending/movie/week` - Get trending movies
- `/search/movie` - Search for movies
- `/movie/{id}` - Get detailed movie information
- `/movie/{id}/videos` - Get movie trailers
- `/movie/{id}/credits` - Get movie cast information

## ✨ Future Enhancements

- User registration and profile management
- Social sharing functionality
- Advanced filtering options by genre, year, and rating
- Related movie recommendations
- Reviews and ratings system
- Watchlist functionality

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [TMDb](https://www.themoviedb.org/) for providing the movie data API
- [Material UI](https://mui.com/) for the component library
- [React](https://reactjs.org/) and its community for the amazing tools and libraries
