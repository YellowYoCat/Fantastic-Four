<template>
  <div v-if="movie" class="movie-container">
    <div class="Imgholder">
      <img :src="getMovieImage(movie.poster_path)" alt="Movie Poster" class="movie-poster" />
    </div>
    <div class="moviereview">
      <h1 class="over">{{ movie.title }}</h1>
      <h5 class="over">ESRB Rating: {{ movie.vote_average }}</h5>
      <h5 class="over">Genre: {{ getGenres(movie.genres) }}</h5>
      <h5 class="over">Duration: {{ formatRuntime(movie.runtime) }}</h5>
      <h5 class="over">Ratings: {{ movie.vote_average }} / 10</h5>
      <p class="over">Summary: {{ movie.overview }}</p>
      <br />
      <router-link :to="'/reviewform/' + movie.id">
        <button class="formbtn">Review Movie</button>
      </router-link>
    </div>
  </div>
  <div v-else class="loading">Loading...</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SingleMovie',
  props: {
    movieId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      movie: null,
    };
  },
  watch: {
    movieId(newId) {
      this.fetchMovieDetails(newId); // Fetch new movie details when the prop changes
    },
  },
  methods: {
    async fetchMovieDetails(movieId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/movie/${movieId}`);
        this.movie = response.data;
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    },
    getMovieImage(path) {
      return path ? `https://image.tmdb.org/t/p/w500${path}` : 'default-movie.jpg';
    },
    getGenres(genres) {
      return genres?.map(genre => genre.name).join(', ') || 'N/A';
    },
    formatRuntime(minutes) {
      if (!minutes) return 'N/A';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    },
  },
  created() {
    this.fetchMovieDetails(this.movieId); // Fetch movie details when the component is created
  },
};
</script>


<style scoped>
.movie-container {
  display: flex;
  gap: 20px;
}
.Imgholder {
  width: 30%;
}
.movie-poster {
  width: 100%;
  border-radius: 10px;
}
.moviereview {
  flex: 1;
}
.loading {
  text-align: center;
  font-size: 20px;
}
</style>
