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
      genres: [], // Fetch full genre list from API
      ratings: ["G", "PG", "PG-13", "R"],
      filteredMovies: [],
      genreMap: {} // Store genre ID to name mapping
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
            genres: movie.genre_ids.map(id => this.genreMap[id] || "Unknown"),
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

          return axios.get(`https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=320b4a81527cb06be689a396ecc7be50`);
        })
        .then((response) => {
          if (!response) return;

          this.movies = response.data.cast.map((movie) => ({
            ...movie,
            image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            genres: movie.genre_ids.map(id => this.genreMap[id] || "Unknown"),
          }));
          this.filterMovies();
        })
        .catch((error) => console.error("Error fetching actor movies:", error));
    },

    // Fetch movies based on selected genres
    fetchMoviesByGenre() {
      if (this.selectedGenres.length === 0) {
        this.fetchPopularMovies();
        return;
      }

      const genreIds = this.selectedGenres.map(genre => Object.keys(this.genreMap).find(key => this.genreMap[key] === genre)).join(',');

      const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=320b4a81527cb06be689a396ecc7be50&with_genres=${genreIds}`;

      axios.get(apiUrl)
        .then((response) => {
          this.movies = response.data.results.map((movie) => ({
            ...movie,
            image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            genres: movie.genre_ids.map(id => this.genreMap[id] || "Unknown"),
          }));
          this.filteredMovies = this.movies;
        })
        .catch((error) => console.error("Error fetching genre movies:", error));
    },

    // Fetch all available genres from MovieDB
    fetchGenres() {
      const apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=320b4a81527cb06be689a396ecc7be50`;

      axios.get(apiUrl)
        .then((response) => {
          this.genres = response.data.genres.map(genre => genre.name);
          this.genreMap = Object.fromEntries(response.data.genres.map(genre => [genre.id, genre.name]));
        })
        .catch((error) => console.error("Error fetching genres:", error));
    },

    // Fetch popular movies as the default
    fetchPopularMovies() {
      const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=320b4a81527cb06be689a396ecc7be50`;

      axios.get(apiUrl)
        .then((response) => {
          this.movies = response.data.results.map((movie) => ({
            ...movie,
            image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            genres: movie.genre_ids.map(id => this.genreMap[id] || "Unknown"),
          }));
          this.filteredMovies = this.movies;
        })
        .catch((error) => console.error("Error fetching popular movies:", error));
    },
  },
  watch: {
    selectedGenres: "fetchMoviesByGenre", // Automatically fetch when genre changes
  },
  mounted() {
    this.fetchGenres(); // Fetch genres when component is mounted
    this.fetchPopularMovies(); // Fetch movies when component is mounted
  },
};
</script>
