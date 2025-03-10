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

    
      <div v-if="reviews.length > 0">
        <h2>Reviews</h2>
        <div v-for="review in reviews" :key="review.id" class="review">
          <p><strong>Rating:</strong> {{ review.rating }} / 5</p>
          <p>{{ review.review }}</p>
         
          <button
            v-if="isAdmin"
            class="delete-btn"
            @click="deleteReview(review.id)"
          >
            Delete Review
          </button>
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
import jwtDecode from 'jwt-decode'; 

export default {
  name: 'SingleMovie',
  data() {
    return {
      movie: {}, 
      posterUrl: '', 
      genres: '',
      reviews: [], 
      isAdmin: false, 
    };
  },
  created() {
    const movieId = this.$route.params.id;

    if (!movieId) {
      console.error("Error: Movie ID is undefined");
      return;
    }

    this.fetchMovieData(movieId);
    this.fetchMovieReviews(movieId); 
    this.checkAdminStatus(); 
  },

  methods: {
    async fetchMovieData(movieId) {
      const apiKey = '320b4a81527cb06be689a396ecc7be50'; 
      const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;

      try {
        const response = await axios.get(url); 
        this.movie = response.data; 
        this.posterUrl = `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`; 
        this.genres = this.movie.genres.map(genre => genre.name).join(', ');
      } catch (error) {
        console.error('Error fetching movie data:', error); 
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

        console.log(response);  
        this.reviews = response.data.data.reviews;  
      } catch (error) {
        console.error('Error fetching movie reviews:', error.response || error.message);
      }
    },

    async deleteReview(reviewId) {
      const mutation = `
        mutation DeleteReview($reviewId: ID!) {
          deleteReview(reviewId: $reviewId)
        }
      `;

      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.post(
          'http://localhost:5000/graphql',
          {
            query: mutation,
            variables: {
              reviewId,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.data.deleteReview) {
          alert('Review deleted successfully!');
         
          this.fetchMovieReviews(this.$route.params.id);
        } else {
          alert('Failed to delete review.');
        }
      } catch (error) {
        console.error('Error deleting review:', error.response || error.message);
        alert('Failed to delete review.');
      }
    },

    checkAdminStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token); 
          this.isAdmin = decoded.isAdmin; 
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    },

    goToReviewPage() {
      this.$router.push({
        name: 'ReviewForm',
        params: {
          id: this.movie.id, 
          movieTitle: encodeURIComponent(this.movie.title), 
        },
      });
    },
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

.delete-btn {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.delete-btn:hover {
  background-color: #cc0000;
}
</style>