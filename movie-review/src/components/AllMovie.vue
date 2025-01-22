<template>
  <div id="app">
    <div class="container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="search">
          <input type="text" v-model="searchQuery" placeholder="Enter Movie Title Here" @input="filterMovies" />
        </div>
        <div class="filters">
          <h3>Genre</h3>
          <ul>
            <li v-for="genre in genres" :key="genre">
              <input
                type="checkbox"
                :value="genre"
                v-model="selectedGenres"
                @change="filterMovies"
              />
              {{ genre }}
            </li>
          </ul>
          <h3>Rating</h3>
          <ul>
            <li v-for="rating in ratings" :key="rating">
              <input
                type="checkbox"
                :value="rating"
                v-model="selectedRatings"
                @change="filterMovies"
              />
              {{ rating }}
            </li>
          </ul>
        </div>
      </aside>
      <!-- Movie Grid -->
      <main class="movie-grid">
        <div class="movie-card" v-for="movie in filteredMovies" :key="movie.id">
          <img :src="movie.image" :alt="movie.title" />
          <h4>{{ movie.title }}</h4>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      selectedGenres: [],
      selectedRatings: [],
      movies: [
        { id: 1, title: "Fantastic 4", genre: "Action", rating: "PG-13", image: "fantastic4.jpg" },
        { id: 2, title: "Deadpool", genre: "Action", rating: "R", image: "deadpool.jpg" },
        { id: 3, title: "Shrek", genre: "Animation", rating: "PG", image: "shrek.jpg" },
        // Add more movies here...
      ],
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
  },
  mounted() {
    this.filteredMovies = this.movies; // Show all movies by default
  },
};
</script>
