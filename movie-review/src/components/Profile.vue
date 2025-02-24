<template>
    <div class="profile-container">
      <h1>Profile</h1>
      <form @submit.prevent="updateProfile">
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  </template>

<script>
export default {
  data() {
    return {
      email: '', 
      password: '', 
    };
  },
  methods: {
    updateProfile() {
      
      console.log('Updating profile with:', {
        email: this.email,
        password: this.password,
      });

      
      this.email = '';
      this.password = '';
    },
  },
};
</script>