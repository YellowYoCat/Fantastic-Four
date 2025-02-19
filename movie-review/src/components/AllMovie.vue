<template>
  <div id="app">
    <div class="container">
      
      <aside class="sidebar">
        <div class="search">
          <input type="text" v-model="searchQuery" placeholder="Enter Movie Title Here" @input="filterMovies" />
        </div>
        <div class="filters">
          <h3>Genre</h3>
          <ul>
            <li v-for="genre in genres" :key="genre">
              <input type="checkbox" :value="genre" v-model="selectedGenres" @change="filterMovies" />
              {{ genre }}
            </li>
          </ul>
          <h3>Rating</h3>
          <ul>
            <li v-for="rating in ratings" :key="rating">
              <input type="checkbox" :value="rating" v-model="selectedRatings" @change="filterMovies" />
              {{ rating }}
            </li>
          </ul>
        </div>
      </aside>
     
      <main class="movie-grid">
        <div class="movie-card" v-for="movie in filteredMovies" :key="movie.id">
          <a :href="'#/singlemovie'" class="movie-button">   <!--+ movie.id-->
            <img :src="movie.image" :alt="movie.title" class="movie-image" />
          </a>
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
      searchQuery: "",
      selectedGenres: [],
      selectedRatings: [],
      movies: [],
      genres: ["Action", "Animation", "Drama", "Comedy"],
      ratings: ["G", "PG", "PG-13", "R"],
      filteredMovies: [],
    };
  },
  methods: {
    filterMovies() {
      this.filteredMovies = this.movies.filter((movie) => {
        const matchesSearch =
          movie.title.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesGenre =
          this.selectedGenres.length === 0 ||
          this.selectedGenres.includes(movie.genre);
        const matchesRating =
          this.selectedRatings.length === 0 ||
          this.selectedRatings.includes(movie.rating);

        return matchesSearch && matchesGenre && matchesRating;
      });
    },

    // Fetch movies from your backend API or popular movies if no search query is entered
    fetchMovies() {
  let apiUrl;
  if (this.searchQuery.trim()) {
    // Use TMDB's search endpoint instead of local API
    apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=320b4a81527cb06be689a396ecc7be50&query=${encodeURIComponent(this.searchQuery)}`;
  } else {
    // Default to fetching popular movies
    apiUrl = 'https://api.themoviedb.org/3/movie/popular?api_key=320b4a81527cb06be689a396ecc7be50';
  }

  axios.get(apiUrl)
    .then((response) => {
      let moviesData = response.data.results || response.data;
      this.movies = moviesData.map((movie) => ({
        ...movie,
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      }));
      this.filterMovies();
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
    });
}

  },
  watch: {
    // Automatically call fetchMovies when searchQuery changes
    searchQuery() {
      this.fetchMovies(); // Refetch the movies every time the search query is modified
    }
  },
  mounted() {
    this.fetchMovies(); // Fetch movies when the component is mounted
  },
};
</script>
