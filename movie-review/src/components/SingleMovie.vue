<template>
  <div class="movie-container">
    <div class="Imgholder">
      <img class="poster" :src="posterUrl" alt="Movie Poster" v-if="posterUrl">
    </div>

    <div class="moviereview">
      
    <div>
      <br>
      <h1 class="over">{{ movie.title }}</h1>
      <br>
      <h5 class="over">ESRB rating: {{ movie.adult ? 'R' : 'PG' }}</h5>
      <h5 class="over">Genre: {{ genres }}</h5>
      <h5 class="over">Duration: {{ movie.runtime }} minutes</h5>
      <h5 class="over">Ratings: {{ movie.vote_average }} ({{ movie.vote_count }} votes)</h5>
      <h5 class="over">Summary: {{ movie.overview }}</h5>
      <br>
      <a href="#/reviewform">
        <button class="formbtn">Review Movie</button>
      </a>
    </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SingleMovie',
  data() {
    return {
      movie: {}, // Store movie details
      posterUrl: '', // Movie poster URL
      genres: '', // List of genres
    };
  },
  created() {
  console.log("Route params:", this.$route.params); // Debug route params
  const movieId = this.$route.params.id;

  if (!movieId) {
    console.error("Error: Movie ID is undefined");
    return;
  }

  this.fetchMovieData(movieId);
}
,
  methods: {
    async fetchMovieData(movieId) {
      const apiKey = '320b4a81527cb06be689a396ecc7be50'; // Replace with your TMDB API key
      const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;

      try {
        const response = await axios.get(url); // Fetch movie data from TMDB API
        this.movie = response.data; // Store movie data
        this.posterUrl = `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`; // Set poster URL
        this.genres = this.movie.genres.map(genre => genre.name).join(', '); // Format genres
      } catch (error) {
        console.error('Error fetching movie data:', error); // Handle errors
      }
    },
  },
};
</script>

<style scoped>

.poster{
  margin-top: 20px;
  border-radius: 10px;
}
.movie-container {
  display: flex;
  flex: wrap;
  /* gap: 20px; */
}
.Imgholder {
  width: 30%;
  margin-left: 100px;
  margin-top: 20px;
}

.moviereview{
  margin-top: 30px;
}

.loading {
  text-align: center;
  font-size: 20px;
}
</style>
