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
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import { request } from "graphql-request";

export default {
  data() {
    return {
      email: "", // Initialize with user's current email
      password: "", // Initialize with user's current password
      message: "", // To display success/error messages
    };
  },
  methods: {
    async updateProfile() {
      const mutation = `
        mutation UpdateUser($email: String!, $password: String!) {
          updateUser(email: $email, password: $password)
        }
      `;

      const variables = {
        email: this.email,
        password: this.password,
      };

      try {
        const data = await request("http://localhost:4000/graphql", mutation, variables);
        this.message = "Profile updated successfully!";
      } catch (error) {
        console.error("Error updating profile:", error);
        this.message = "Failed to update profile. Please try again.";
      }
    },
  },
};
</script>

<style scoped>

</style>