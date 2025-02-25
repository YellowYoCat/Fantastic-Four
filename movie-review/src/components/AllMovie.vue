<template>
  <div id="app">
    <div class="container">

      <aside class="sidebar">
        <div class="search">
          <input type="text" v-model="movieSearchQuery" placeholder="Enter Movie Title Here" @input="fetchMovies" />
        </div>
        <div class="search">
          <input type="text" v-model="actorSearchQuery" placeholder="Enter Actor/Actress Here"
            @input="fetchMoviesByActor" />
        </div>
        <div class="filters">
          <h3>Genre</h3>
          <ul>
            <li v-for="genre in genres" :key="genre">
              <input type="checkbox" :value="genre" v-model="selectedGenres" @change="filterMovies" />
              {{ genre }}
            </li>
          </ul>
        </div>
      </aside>

      <main class="movie-grid">
        <div class="movie-card" v-for="movie in filteredMovies" :key="movie.id">
          <router-link :to="`/singlemovie/${movie.id}`" class="movie-button">
            <img :src="movie.image" :alt="movie.title" class="movie-image" />
          </router-link>

          <h4 class="luckiest-guy-regular">{{ movie.title }}</h4>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      movieSearchQuery: "",
      actorSearchQuery: "",
      selectedGenres: [],
      selectedRatings: [],
      movies: [],
      genres: ["Action", "Animation", "Drama", "Comedy"],
      ratings: ["G", "PG", "PG-13", "R"],
      filteredMovies: [],
    };
  },
  methods: {
    // Fetch movies based on title
    fetchMovies() {
      if (!this.movieSearchQuery.trim()) {
        this.fetchPopularMovies();
        return;
      }

      const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=320b4a81527cb06be689a396ecc7be50&query=${encodeURIComponent(this.movieSearchQuery)}`;

      axios.get(apiUrl)
        .then((response) => {
          this.movies = response.data.results.map((movie) => ({
            ...movie,
            image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            genres: movie.genre_ids.map(id => this.getGenreName(id)), // Convert genre IDs to names
          }));
          this.filterMovies();
        })
        .catch((error) => console.error("Error fetching movies:", error));
    },

    // Fetch movies based on actor
    fetchMoviesByActor() {
      if (!this.actorSearchQuery.trim()) return;

      const apiUrl = `https://api.themoviedb.org/3/search/person?api_key=320b4a81527cb06be689a396ecc7be50&query=${encodeURIComponent(this.actorSearchQuery)}`;

      axios.get(apiUrl)
        .then((response) => {
          if (response.data.results.length === 0) {
            this.movies = [];
            return;
          }

          const actorId = response.data.results[0].id;

          // Fetch movies that the actor is in
          return axios.get(`https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=320b4a81527cb06be689a396ecc7be50`);
        })
        .then((response) => {
          if (!response) return;

          this.movies = response.data.cast.map((movie) => ({
            ...movie,
            image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            genres: movie.genre_ids.map(id => this.getGenreName(id)), // Convert genre IDs to names
          }));
          this.filterMovies();
        })
        .catch((error) => console.error("Error fetching actor movies:", error));
    },

    // Fetch popular movies by default
    fetchPopularMovies() {
      const apiUrl = 'https://api.themoviedb.org/3/movie/popular?api_key=320b4a81527cb06be689a396ecc7be50';

      axios.get(apiUrl)
        .then((response) => {
          this.movies = response.data.results.map((movie) => ({
            ...movie,
            image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            genres: movie.genre_ids.map(id => this.getGenreName(id)), // Convert genre IDs to names
          }));
          this.filterMovies();
        })
        .catch((error) => console.error("Error fetching popular movies:", error));
    },

    // Apply filters based on genres and ratings
    filterMovies() {
      this.filteredMovies = this.movies.filter((movie) => {
        const matchesGenre =
          this.selectedGenres.length === 0 ||
          this.selectedGenres.some(genre => movie.genres.includes(genre)); // Match genre name

        const matchesRating =
          this.selectedRatings.length === 0 ||
          this.selectedRatings.includes(movie.rating);

        return matchesGenre && matchesRating;
      });
    },

    getGenreName(id) {
      const genreMap = {
        28: "Action",
        16: "Animation",
        18: "Drama",
        35: "Comedy"
      };
      return genreMap[id] || "Unknown";
    },

  },
  mounted() {
    this.fetchPopularMovies(); // Fetch movies when the component is mounted
  },
};
</script>
