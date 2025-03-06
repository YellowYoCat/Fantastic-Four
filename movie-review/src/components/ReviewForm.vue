<template>

  <br>
  <div class="card">
    <h1>Review Movie</h1>

    <div>
      <!-- Display the movie title -->
      <h4 class="formword">Movie Title</h4>
      <p class="forminput">{{ movieTitle }}</p>

      <!-- User rating input -->
      <h4 class="formword">Your Rating</h4>
      <input class="forminput" v-model.number="rating" type="number" min="1" max="5" placeholder="1-5" />

      <!-- User review input -->
      <h4 class="formword">Review</h4>
      <textarea class="forminput" v-model="review" placeholder="Review the movie"></textarea>

      <button class="formbtn" @click="submitReview">Rate Movie</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ReviewForm',
  props: ['movieId', 'movieTitle'],
  data() {
    return {
      rating: null,
      review: '',
    };
  },
  methods: {
    async submitReview() {
  if (!this.rating || !this.review) {
    alert('Please fill out all fields.');
    return;
  }
  if (this.rating < 1 || this.rating > 5) {
    alert('Rating must be between 1 and 5.');
    return;
  }

  try {
    const authToken = localStorage.getItem('authToken');

    const mutation = `
      mutation SubmitReview($movieId: ID!, $rating: Int!, $review: String!) {
        submitReview(movieId: $movieId, rating: $rating, review: $review)
      }
    `;

    const response = await axios.post(
      'http://localhost:5000/graphql',
      {
        query: mutation,
        variables: {
          movieId: this.movieId,
          rating: this.rating,
          review: this.review,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log('Review submitted:', response.data);
    alert('Review submitted successfully!');
    this.rating = null;
    this.review = '';
    this.$router.push(`/singlemovie/${this.movieId}`); // Redirect to the single movie page

  } catch (error) {
    console.error('Error submitting review:', error.response?.data || error.message);
    alert('Failed to submit review.');
  }
}
  },
};
</script>



<style scoped>
.card {
  max-width: 500px;
  margin: auto;
  padding: 35px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.formword {
  margin: 10px 0;
}

.forminput {
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
}

.formbtn {
  padding: 10px 15px;
  background: #18275b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 27px;
}
</style>
