<template>
  <div class="card">
    <br>
    <h2>Register</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email:</label> 
        <br>
        <input type="email" v-model="email" required />
      </div>
      <br>

      <div>
        <label for="username">Username:</label>
        <br>
        <input v-model="username" required>
      </div>
      <br>
      
      <div>
        <label for="password">Password:</label>
        <br>
        <input type="password" v-model="password" required />
      </div>
      <br>

      <div>
        <label for="password">Confirm Password: </label>
        <br>
        <input type="password" v-model="password" required />
      </div>
      <br>

      <button class="loginbtn" @click="register">Register</button>

    </form>

    <div v-if="showConfirm">
      <p>Is this your email: {{ email }}?</p>
      <button @click="confirmEmail(true)">Yes</button>
      <button @click="confirmEmail(false)">No</button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      showConfirm: false,
      errorMessage: "",
    };
  },
  methods: {
    handleSubmit() {
      // Check if passwords match
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return; // Stop submission
      }

      this.errorMessage = ""; // Clear any previous error messages
      this.showConfirm = true;
    },
    confirmEmail(isConfirmed) {
      if (isConfirmed) {
        const user = {
          email: this.email,
          username: this.username,
          password: this.password,
        };
        fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })
          .then((response) => response.json())
          .then((data) => {
            alert(data.message);
            this.showConfirm = false;
          })
          .catch((error) => console.error(error));
      } else {
        this.showConfirm = false;
      }
    },
  },
};
</script>