// router.js
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import AboutUs from './components/AboutUs.vue';
import AllMovie from './components/AllMovie.vue';
import Register from './components/UserRegister.vue';
import ReviewForm from './components/ReviewForm.vue';
import SingleMovie from '@/components/SingleMovie.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: AboutUs },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/movie', component: AllMovie },
  { path: '/reviewform', component: ReviewForm },
  {
    path: '/singlemovie/:id',
    name: 'SingleMovie',
    component: SingleMovie,
    props: true, // Pass route params as props to the component
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
