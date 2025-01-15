<!-- 

<script>
import Home from './components/Home.vue'
import Login from './components/Login.vue';
import AboutUs from './components/AboutUs.vue';
import AllMovie from './components/AllMovie.vue';
import Register from './components/Register.vue';
import ReviewForm from './components/ReviewForm.vue';
import SingleMovie from './components/SingleMovie.vue';

import './css/main.css'


const routes = {
  '/': Home,
  '  /about': AboutUs,
  '  /login': Login,
  '  /register': Register,
  '  /movie': AllMovie,
  '  /reviewform': ReviewForm,
  '  /singlemovie': SingleMovie
}


// export default {
//   name: 'App',
//   components: {
  

//   }
// }
</script>

<template>
  <a href="#/">Home</a> 
  <a href="#/about">About</a> 
  <a href="#/login">Login</a>
  <a href="#/register">About</a>
  <a href="#/movie">About</a>
  <a href="#/reviewform">About</a>
  <a href="#/singlemovie">About</a>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style> -->

<script>
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import AboutUs from './components/AboutUs.vue';
import AllMovie from './components/AllMovie.vue';
import Register from './components/Register.vue';
import ReviewForm from './components/ReviewForm.vue';
import SingleMovie from './components/SingleMovie.vue';

import './css/main.css';

const routes = {
  '/': Home,
  '/about': AboutUs,
  '/login': Login,
  '/register': Register,
  '/movie': AllMovie,
  '/reviewform': ReviewForm,
  '/singlemovie': SingleMovie,
};

export default {
  data() {
    return {
      currentRoute: window.location.hash.slice(1) || '/',
    };
  },
  computed: {
    CurrentComponent() {
      return routes[this.currentRoute] || Home;
    },
  },
  created() {
    window.addEventListener('hashchange', () => {
      this.currentRoute = window.location.hash.slice(1);
    });
  },
};
</script>

<template>
  <div id="app">
    <nav>
      <a href="#/">Home</a>
      <a href="#/about">About</a>
      <a href="#/login">Login</a>
      <a href="#/register">Register</a>
      <a href="#/movie">Movies</a>
      <a href="#/reviewform">Review Form</a>
      <a href="#/singlemovie">Single Movie</a>
    </nav>
    <component :is="CurrentComponent" />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #42b983;
}

nav a:hover {
  text-decoration: underline;
}
</style>
