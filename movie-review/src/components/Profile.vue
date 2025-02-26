<template>
  <div class="profile-container">
    <br />
    <h1>Profile</h1>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
      </div>
      <br />
      <br />
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" required />
        <br />
        <br />
      </div>
      <button class="probtn" type="submit">Update Profile</button>
    </form>
    <br />
    <br />
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import { request } from "graphql-request";

export default {
  name: "UserProfile",
  data() {
    return {
      email: "",
      password: "",
      message: "",
    };
  },
  methods: {
    async login() {

      this.$parent.login();
      this.$router.push('/');
    },

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

      const token = localStorage.getItem("token");

      try {
        await request(
          "http://localhost:5000/graphql",
          mutation,
          variables,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
.profile-container {
  font-family: "Luckiest Guy", serif;
  letter-spacing: 4px;
  background: #8DBAD7;
  color: white;
  width: 834px;
  border-radius: 25px;
  font-size: 25px;
  justify-self: center;
  margin-top: 70px;
}

.probtn {
  background-color: #034180;
  border-radius: 25px;
  color: white;
}
</style>