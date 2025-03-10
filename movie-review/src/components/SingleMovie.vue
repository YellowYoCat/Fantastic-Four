<template>
  <div class="movie-container">
    <div class="Imgholder">
      <img class="poster" :src="posterUrl" alt="Movie Poster" v-if="posterUrl">
    </div>

    <div class="moviereview">
      <div>
        <br>
        <h1 class="title">{{ movie.title }}</h1>
        <div>
          <img class="line" src="@/assets/line.png" alt="Line">

        </div>
        <br>
        <h5 class="over">ESRB rating: {{ movie.adult ? 'R' : 'PG' }}</h5>
        <h5 class="over">Genre: {{ genres }}</h5>
        <h5 class="over">Duration: {{ movie.runtime }} minutes</h5>
        <h5 class="over">Ratings: {{ movie.vote_average }} ({{ movie.vote_count }} votes)</h5>
        <h5 class="over">Summary: {{ movie.overview }}</h5>
        <br>
        <button class="formbtn" @click="goToReviewPage">Review Movie</button>
      </div>

      <!-- Reviews Section -->
      <div v-if="reviews.length > 0">
        <h2>Reviews</h2>
        <div v-for="review in reviews" :key="review.id" class="review">
          <!-- <h3>Posted by: Anonoymous</h3> -->
          <p><strong>Rating:</strong> {{ review.rating }} / 5</p>
          <p>{{ review.review }}</p>
        </div>
      </div>
      <div v-else>
        <p>No reviews available yet. Be the first to review this movie!</p>
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
      reviews: [],
    };
  },
  created() {
    const movieId = this.$route.params.id;

    if (!movieId) {
      console.error("Error: Movie ID is undefined");
      return;
    }

    this.fetchMovieData(movieId);
    this.fetchMovieReviews(movieId); // Call this function to load reviews
  },

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
    async fetchMovieReviews(movieId) {
      const query = `
    query GetReviews($movieId: ID!) {
      reviews(movieId: $movieId) {
        id
        movieId
        userId
        rating
        review
      }
    }
  `;

      try {
        const response = await axios.post('http://localhost:5000/graphql', {
          query,
          variables: {
            movieId,
          },
        });

        console.log(response);  // Log the response to see if it contains any useful information
        this.reviews = response.data.data.reviews;  // Store reviews if query is successful
      } catch (error) {
        console.error('Error fetching movie reviews:', error.response || error.message);
      }
    },

    goToReviewPage() {
      this.$router.push({
        name: 'ReviewForm',
        params: {
          id: this.movie.id, // Make sure this matches the route definition
          movieTitle: encodeURIComponent(this.movie.title), // Proper encoding
        }
      });
    }

  },
};
</script>

<style scoped>
.line {
  width: 600px;
}

.title {
  font-size: 50px;
}

.poster {
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
  margin-top: 50px;
}

.moviereview {
  margin-top: 30px;
}

.loading {
  text-align: center;
  font-size: 20px;
}
</style>
