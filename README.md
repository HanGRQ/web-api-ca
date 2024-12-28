# Assignment 2 - Web API

Name: Sihan Ma

## Features

### Additional Features Implemented Beyond Labs

- **Implemented Movie Endpoints**:
  - `/api/movies` - Fetch all movies with pagination support.
  - `/api/movies/{id}` - Fetch movie details by ID.
  - `/api/movies/{id}/reviews` - Fetch all reviews for a specific movie.
  - `/api/movies/{id}/recommendations` - Fetch movie recommendations.
  - `/api/movies/{id}/similar` - Fetch similar movies.
  - `/api/movies/{id}/credits` - Fetch cast and crew credits for a movie.
  - `/api/movies/{id}/images` - Fetch movie images.
  - `/api/movies/tmdb/upcoming` - Fetch upcoming movies from TMDB.
  - `/api/movies/tmdb/now-playing` - Fetch currently playing movies from TMDB.
  - `/api/movies/tmdb/trending` - Fetch trending movies from TMDB.
  - `/api/movies/tmdb/genres` - Fetch movie genres from TMDB.
- **Implemented Actor Endpoints**:
  - `/api/actors` - Fetch all actors.
  - `/api/actors/{id}` - Fetch actor details by ID.
  - `/api/actors/{id}/movies` - Fetch movies associated with a specific actor.
- **Implemented User Management Endpoints**:
  - `/api/users/register` - User registration with validation.
  - `/api/users/login` - User login with JWT token generation.
  - `/api/users/google-auth` - Google Authentication integration.
  - `/api/users/me` - Retrieve authenticated user details.
  - `/api/users/favorites/{movieId}` - Add or remove movies from user favorites.
  - `/api/users/watchlist/{movieId}` - Add or remove movies from user watchlist.
  - `/api/users/check/{email}` - Check if a user exists by email.

## Setup Requirements

### Pre-requisites:

1. **Node.js** (v20.x recommended)
2. **MongoDB Database** - Ensure MongoDB is running locally or remotely.

### Steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/HanGRQ/web-api-ca.git
   ```

2. Navigate to the project directory:

   ```bash
   cd movies-api
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up the 

   ```
   .env
   ```

    file in the project root directory with the following variables:

   ```env
   NODE_ENV=development
   PORT=8080
   HOST=localhost
   mongoDB=YourMongoDBConnectionURL
   seedDb=true
   secret=YourJWTSecretKey
   ```

## API Configuration

After setting up `.env`, start the server using:

```bash
npm start
```

API will be accessible at: `http://localhost:8080`

## API Design

| Endpoint                           | Method   | Description                            |
| ---------------------------------- | -------- | -------------------------------------- |
| `/api/movies`                      | `GET`    | Fetch all movies.                      |
| `/api/movies/{id}`                 | `GET`    | Fetch movie details by ID.             |
| `/api/movies/{id}/reviews`         | `GET`    | Fetch reviews for a movie.             |
| `/api/movies/{id}/recommendations` | `GET`    | Fetch recommendations for a movie.     |
| `/api/movies/{id}/similar`         | `GET`    | Fetch similar movies.                  |
| `/api/movies/{id}/credits`         | `GET`    | Fetch credits for a movie.             |
| `/api/movies/{id}/images`          | `GET`    | Fetch images for a movie.              |
| `/api/actors`                      | `GET`    | Fetch all actors.                      |
| `/api/actors/{id}`                 | `GET`    | Fetch actor details by ID.             |
| `/api/actors/{id}/movies`          | `GET`    | Fetch movies associated with an actor. |
| `/api/users/register`              | `POST`   | Register a new user.                   |
| `/api/users/login`                 | `POST`   | Login a user and generate a token.     |
| `/api/users/google-auth`           | `POST`   | Authenticate user with Google OAuth.   |
| `/api/users/me`                    | `GET`    | Retrieve authenticated user details.   |
| `/api/users/favorites/{movieId}`   | `POST`   | Add a movie to favorites.              |
| `/api/users/favorites/{movieId}`   | `DELETE` | Remove a movie from favorites.         |
| `/api/users/watchlist/{movieId}`   | `POST`   | Add a movie to watchlist.              |
| `/api/users/watchlist/{movieId}`   | `DELETE` | Remove a movie from watchlist.         |

Full API Documentation available at: `http://localhost:8080/api-docs`

## Security and Authentication

- **JWT Authentication**:
  - Routes such as `/users/me`, `/users/favorites`, and `/users/watchlist` are protected and require a valid JWT token in the `Authorization` header.
  - Tokens are generated during login and registration processes.
- **Password Encryption**:
  - User passwords are hashed and securely stored using `bcrypt`.
- **Google OAuth**:
  - Google authentication allows users to sign up or login using their Google account.

## Integration with React App

The following views in the React app utilize the web API:

- **Home Page**: Displays movies using `/api/movies`.
- **Movie Details Page**: Fetches movie details, reviews, and recommendations.
- **Actor Details Page**: Fetches actor details and associated movies.
- **Favorites/Watchlist Pages**: Displays user-specific data fetched from `/users/favorites` and `/users/watchlist`.

Additional updates:

- Authentication Integration:
  - Integrated with backend for user registration, login, and Google OAuth.
- Pagination Support:
  - Implemented paginated endpoints for better performance.

## Independent Learning

- Swagger Documentation:
  - API documentation is generated using `swagger-jsdoc` and served via `swagger-ui-express`.
- Enhanced Validation:
  - Added comprehensive validation for user inputs during registration and login.
- Improved Error Handling:
  - Implemented centralized error handling middleware for better API reliability.

