
<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fuzzy+Bubbles:wght@400;700&family=Jolly+Lodger&family=Luckiest+Guy&display=swap" rel="stylesheet">
  <div id="app">
    <nav class="nav">
      <img src="@/assets/logo.png" alt="Logo" class="logoPic">
      <RouterLink to="/"> <button class="nav-button">Home</button> </RouterLink>
      <RouterLink to="/movie"> <button class="nav-button">Movies</button> </RouterLink>

      <!-- Show login/register buttons if not logged in -->
      <template v-if="!isLoggedIn">
        <RouterLink to="/login"> <button class="nav-button">Login</button> </RouterLink>
        <RouterLink to="/register"> <button class="nav-button">Register</button> </RouterLink>
      </template>

      <!-- Show profile and logout button if logged in -->
      <template v-else>
        <RouterLink to="/profile"> <button class="nav-button">Profile ({{ username }})</button> </RouterLink>
        <button class="nav-button" @click="logout">Logout</button>
      </template>

      <RouterLink to="/about"> <button class="nav-button">About Us</button> </RouterLink>
    </nav>

    <!-- Dynamically display the component based on current route -->
    <RouterView @login="login" />
  </div>
</template>

<script>
import './css/main.css';

export default {
  name: "App",
  data() {
    return {
      isLoggedIn: false, // Local state to track login status
      username: '', // Store the username if needed
    };
  },
  created() {
    // Check localStorage for login state when the component is created
    const savedLoginState = localStorage.getItem('isLoggedIn');
    if (savedLoginState === 'true') {
      this.isLoggedIn = true;
      this.username = localStorage.getItem('username') || '';
    }
  },
  methods: {
    login(username) {
      this.isLoggedIn = true;
      this.username = username;
      // Save login state to localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
    },
    logout() {
      this.isLoggedIn = false;
      this.username = '';
      // Clear login state from localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
    },
  },
};
</script>