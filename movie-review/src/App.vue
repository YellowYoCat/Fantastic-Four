
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
    <nav class="nav">
<!--       
      <a href="#/about">About</a>
      <a href="#/reviewform">Review Form</a>
      <a href="#/singlemovie">Single Movie</a>  -->


      <a href="#/"> <button class="nav-button">  Home </button> </a>
      <a href="#/movie">  <button class="nav-button"> Movies</button> </a>
      <a href="#/login"> <button class="nav-button">Login</button> </a>
      <a href="#/register">  <button class="nav-button"> Register</button> </a>
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

.nav{
  background-color: #172139;
}

.nav-button{
  background-color: #1974cf;
  color: white;
  border-radius: 25px;
  border: solid 5px white;
  
}
</style>
