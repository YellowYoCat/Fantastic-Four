<script>
import './css/main.css';

export default {
  name: "App",
};
</script>

<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fuzzy+Bubbles:wght@400;700&family=Jolly+Lodger&family=Luckiest+Guy&display=swap" rel="stylesheet">

  <div id="app">
    <nav class="nav">
      <img src="@/assets/logo.png" alt="Logo" class="logoPic">
      <RouterLink to="/"> <button class="nav-button">Home</button> </RouterLink>
      <RouterLink to="/movie"> <button class="nav-button">Movies</button> </RouterLink>
      <RouterLink to="/login"> <button class="nav-button">Login</button> </RouterLink>
      <RouterLink to="/register"> <button class="nav-button">Register</button> </RouterLink>
      <RouterLink to="/about"> <button class="nav-button">About Us</button> </RouterLink>
    </nav>

    <!-- Dynamically display the component based on current route -->
    <RouterView />
  </div>
</template>
