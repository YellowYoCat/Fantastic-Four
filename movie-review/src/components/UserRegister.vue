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
        <input v-model="username" required />
      </div>
      <br>
      
      <div>
        <label for="password">Password:</label>
        <br>
        <input type="password" v-model="password" required />
      </div>
      <br>

      <div>
        <label for="confirmPassword">Confirm Password: </label>
        <br>
        <input type="password" v-model="confirmPassword" required />
      </div>
      <br>

      <button class="loginbtn" type="submit">Register</button>
    </form>

    
    <div v-if="showConfirm" class="modal" @click.self="showConfirm = false">
      <div class="modal-content">
        <p>Is this your email: {{ email }}?</p>
        <button class="loginbtn" @click="confirmEmail(true)">Yes</button>
        <button class="loginbtn" @click="confirmEmail(false)">No</button>
      </div>
    </div>

   
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { request, gql } from 'graphql-request';

const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

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
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return;
      }

      // Val email
      const emailRegex = /^[a-zA-Z0-9_%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(this.email)) {
        this.errorMessage = "Invalid email format.";
        return;
      }

      // Val password 
      if (this.password.length < 8) {
        this.errorMessage = "Password must be at least 8 characters long.";
        return;
      }

      this.errorMessage = "";
      this.showConfirm = true;
    },
    async confirmEmail(isConfirmed) {
      if (isConfirmed) {
        try {
          
          const SIGNUP_MUTATION = gql`
            mutation Signup($user: UserSignup!) {
              signup(user: $user)
            }
          `;

          const variables = {
            user: {
              email: this.email,
              password: this.password,
            },
          };

          
          const data = await request(GRAPHQL_ENDPOINT, SIGNUP_MUTATION, variables);

          if (data.signup) {
            alert("User registered successfully!");
            this.$router.push("/login");
          } else {
            this.errorMessage = "Registration failed. Please try again.";
          }

          this.showConfirm = false;
        } catch (error) {
          console.error("Error during registration:", error);

          
          if (error.response && error.response.errors && error.response.errors.length > 0) {
            this.errorMessage = error.response.errors[0].message;
          } else if (error.message) {
            
            this.errorMessage = error.message;
          } else {
            this.errorMessage = "Failed to register user. Please try again.";
          }
        }
      } else {
        this.showConfirm = false;
      }
    },
    handleEsc(event) {
      if (event.key === "Escape") {
        this.showConfirm = false;
      }
    }
  },
  mounted() {
    window.addEventListener("keydown", this.handleEsc);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleEsc);
  }
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #8DBAD7;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  max-width: 360px;
  width: 100%;
}

.card {
  height: 380px;
}

.error-message {
  color: red;
  font-size: 14px;
}
</style>


