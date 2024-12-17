# Assignment 1 - ReactJS app.

Name: Sihan Ma

## Overview.

This repository contains a ReactJS application developed as part of Assignment 1. The app leverages the TMDB API to display various movie-related features. It incorporates advanced functionality such as filtering, sorting, pagination, responsive design, and third-party authentication using Firebase. The application meets all 12 requirements outlined in the assignment specification.

---

## Features.

#### **1. Extend the App**

- **Static TMDB Endpoints**:
  - Added `/watchlist` to displays movies the user has added to their watchlist, helping them keep track of movies they want to see.
  - Added `/trending` endpoints to display trending movies.
  - Added `/upcoming` to show movies scheduled for future release.
  - Added ` /now_playing ` to show currently playing movies.
- **Parameterized TMDB Endpoints**:
  - Added `/movie/:id/recommendations` to suggest similar movies.
  - Added `/movie/:id/credits` to display cast and crew details.
  - Added `/movie/:id/similar` to display similar movies.
- **Extensive Linking**:
  - From movie details, users can navigate to related content like actor profiles or movie recommendations.
  - Actor pages link back to the movies they have been part of, creating a networked browsing experience.

#### **2. Extend the Functionality**

- **Caching with React Query**:
  - After modifying and checking, all API endpoints (static and parameterized) are cached.
- **Advanced Filtering Options**:
  - New options, like language, star rating, and release year are added to the filter.
- **Sorting and Searching**:
  - Users can sort movies by title, release date, or rating in ascending/descending order.
  - Integrated a search bar to find movies.

#### **3. Additional Features**

- **Responsive UI Design**:
  - Fully responsive layouts optimized for various screen sizes using Material-UI Grid.
- **Pagination**:
  - Added pagination function to movie lists for smoother browsing experience.
- **Third-party Authentication**:
  - Added Firebase Authentication login and logout, including common email with password and Google Sign-In.
  - Added social sharing buttons to allow users to share movies to platforms such as Twitter or Facebook.
- **New Material-UI Components**:
  - **Pagination** for movie lists navigation.
  - **Tooltip** for display prompt information when the user hovers the mouse over the target element.
  - **Paper** for enhanced visual hierarchy in layouts.
  - **Avatar** for user profile display after login.

---

## Setup requirements.

1. Clone the repository:
   ```bash
   git clone https://github.com/HanGRQ/react-movie-labs.git
   ```
2. Navigate to the project directory:
   ```bash
   cd movies
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory and add your TMDB API key:
     ```bash
     REACT_APP_TMDB_KEY=[Your TMDB API Key]
     ```
5. Start the development server:
   ```bash
   npm start
   ```

---

## API endpoints.

+ **New Static Endpoints**:
  - `/login` - Login and register page.
  - `/movies/trending` - Trending movies.
  - `/movies/now_playing` - Currently playing movies.
  - `/movies/upcoming` - Upcoming movies.
  - `/watchlist` - Add movies into watchlist.
+ **New Parameterized Endpoints**:
  - `/movie/:id/recommendations` - Movie recommendations.
  - `/movie/:id/credits` - Cast and crew details.
  - `/movie/:id/similar` - Similar movies.
  - `/actor/:id` - Actor and actor movie details.

---

## Routing.

**New routes that added to the project as below:**

+ **/login** - Displays the login page for user authentication.
+ **/movies/upcoming** - Displays a list of upcoming movies (requires authentication).
+ **/movies/trending** - Displays a list of trending movies (requires authentication).
+ **/movies/now_playing** - Displays a list of movies currently playing in theatres (requires authentication).
+ **/watchlist** - Displays the user's watchlist of movies to be watched (requires authentication).
+ **/movie/:id/recommendations**\- Displays recommended movies based on a specific movie (requires authentication).
+ **/movie/:id/credits** \- Displays the cast and crew information of a specific movie (requires authentication).
+ **/actor/:id**\- Displays detailed information about a specific actor, including their associated movies (requires authentication).

### Authentication

- **Protected Routes:**
  - The following routes require the user to be authenticated:
    - `/`, `/movies/favorites`, `/movies/:id`, `/movie/:id/recommendations`, `/movie/:id/credits`, `/reviews/:movieId/:reviewId`, `/reviews/form`, `/movies/upcoming`, `/movies/trending`, `/movies/now_playing`, `/watchlist`, `/actor/:id`.
- **Public Routes:**
  - `/login` is the only public route available for unauthenticated users.

---

## Independent learning.

1. **Firebase Authentication**:
   - Implemented Google login and logout functionality using Firebase.
   - Files: `contexts/authContext.js`, `loginPage.js`
   - References:
     - [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
2. **React-Share**: 
   - Added Facebook and Twitter social sharing buttons on the movie details page.
3. **Material-UI Components**:
   - Added advanced components like Accordion, Tabs, and Paper for better UI/UX.
   - Files: `filterMoviesCard.js`, `templateMovieListPage.js`
   - References:
     - [Material-UI Documentation](https://mui.com/)
4. **Dynamic Layout Management**:
   - Added logic to handle dynamic empty slot management for pages like favorites.
   - Files: `templateMoviePage.js`, `favoriteMoviesPage.js`
   - References:
     - [CSS Flexbox and Grid Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

