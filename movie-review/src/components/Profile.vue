<template>
  <div class="profile-container">
    <br/>
    <h1>Profile</h1>
    <div v-if="user">
      <p><strong>Email:</strong> {{ user.email }}</p>
    </div>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import { request } from "graphql-request";

export default {
  name: "UserProfile",
  data() {
    return {
      user: null, 
      message: "",
    };
  },
  mounted() {
    this.fetchUserProfile();
  },
  methods: {
    async fetchUserProfile() {
      const query = `
        query GetUser {
          getUser {
            email
          }
        }
      `;

      const token = localStorage.getItem("token");

      try {
        const data = await request(
          "http://localhost:5000/graphql",
          query,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.user = data.getUser; 
      } catch (error) {
        console.error("Error fetching user profile:", error);
        this.message = "Failed to fetch user profile. Please try again.";
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
  padding: 20px;
  text-align: center;
}

p {
  font-size: 20px;
  margin-top: 10px;
}
</style>