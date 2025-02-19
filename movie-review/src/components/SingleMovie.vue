<template>
  <div>
    
    <div class="Imgholder">
      <img :src="posterUrl" alt="Movie Poster" v-if="posterUrl">
    </div>

    
    <div class="moviereview">
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
</template>

<script>
import axios from 'axios';

export default {
  name: 'SingleMovie',
  props: {
    movieId: {
      type: String, //pass the ID
      required: true,
    },
  },
  data() {
    return {
      movie: {}, //store movie details
      posterUrl: '', // URL movie poster
      genres: '', // list of genres
    };
  },
  created() {
    this.fetchMovieData(); // Fetch movie data 
  },
  methods: {
    async fetchMovieData() {
      const apiKey = '320b4a81527cb06be689a396ecc7be50'; // Replace with your TMDB API key
      const url = `https://api.themoviedb.org/3/movie/${this.movieId}?api_key=${apiKey}&language=en-US`;

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