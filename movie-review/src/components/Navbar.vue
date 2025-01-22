<template>
    <nav class="bg-blue-900 flex items-center justify-between p-4 shadow-lg">

      <div class="flex items-center">
        <div class="bg-white rounded-full p-2">
          <img src="../assets/logo.png" alt="Logo" class="h-8 w-8">
        </div>
      </div>
  
      
      <div class="flex space-x-5">
        <button class="nav-button">Home</button>
        <button class="nav-button">Movies</button>
        <button class="nav-button">Sign Up</button>
        <button class="nav-button">Login</button>
        <button class="nav-button">About</button>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'NavBar',
  };
  </script>
  
  
  