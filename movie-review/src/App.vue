<script>
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import AboutUs from './components/AboutUs.vue';
import AllMovie from './components/AllMovie.vue';
import Register from './components/UserRegister.vue';
import ReviewForm from './components/ReviewForm.vue';
import SingleMovie from './components/SingleMovie.vue';
import Profile from './components/Profile.vue';

import './css/main.css';

export default {
  data() {
    return {
      currentRoute: window.location.hash.slice(1) || '/',
      movieId: null, 
    };
  },
  methods: {
    
    getCurrentComponent() {
      const [path, id] = this.currentRoute.split('/');
      
      
      if (path === 'movie' && id) {
        this.movieId = id; // Set the movie id
        return SingleMovie;
      }

      // <a href="#/about">About</a>
      // <a href="#/reviewform">Review Form</a>
      // <a href="#/singlemovie">Single Movie</a>  
      
      
      const routes = {
        '/': Home,
        '/about': AboutUs,
        '/login': Login,
        '/register': Register,
        '/movie': AllMovie,
        '/reviewform': ReviewForm,
        '/singlemovie': SingleMovie,
        '/profile': Profile,
        
      };
      return routes[this.currentRoute] || Home;
    },

   
    handleHashChange() {
      this.currentRoute = window.location.hash.slice(1) || '/';
    },
  },
  created() {
    
    this.handleHashChange();
    
    
    window.addEventListener('hashchange', this.handleHashChange);
  },
  beforeUnmount() {
   
    window.removeEventListener('hashchange', this.handleHashChange);
  },
};
</script>

<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fuzzy+Bubbles:wght@400;700&family=Jolly+Lodger&family=Luckiest+Guy&display=swap" rel="stylesheet">

  <div id="app">
    <nav class="nav">
      <img src="@/assets/logo.png" alt="Logo" class="logoPic">
      <a href="#/"> <button class="nav-button">Home</button> </a>
      <a href="#/movie"> <button class="nav-button">Movies</button> </a>
      <a href="#/login"> <button class="nav-button">Login</button> </a>
      <a href="#/register"> <button class="nav-button">Register</button> </a>
      <a href="#/about"> <button class="nav-button">About Us</button> </a>
    </nav>

    <!-- Dynamically display the component based on current route -->
    <component :is="getCurrentComponent()" :movie-id="movieId" />
  </div>
</template>
