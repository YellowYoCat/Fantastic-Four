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

    <!-- Modal for email confirmation -->
    <div v-if="showConfirm" class="modal" @click.self="showConfirm = false">
      <div class="modal-content">
        <p>Is this your email: {{ email }}?</p>
        <button class="loginbtn" @click="confirmEmail(true)">Yes</button>
        <button class="loginbtn" @click="confirmEmail(false)">No</button>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'; 
import { ApolloClient, InMemoryCache } from '@apollo/client/core';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

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
      this.errorMessage = ""; 
      this.showConfirm = true; 
    },
    async confirmEmail(isConfirmed) {
      if (isConfirmed) {
        try {
          const SIGNUP_MUTATION = gql`
            mutation Signup($email: String!, $username: String!, $password: String!) {
              signup(email: $email, username: $username, password: $password)
            }
          `;

          const { data } = await client.mutate({
            mutation: SIGNUP_MUTATION,
            variables: {
              email: this.email,
              username: this.username,
              password: this.password,
            },
          });

          if (data.signup) {
            alert("User registered successfully!");
            this.$router.push("/login");
          } else {
            this.errorMessage = "Registration failed. Please try again.";
          }

          this.showConfirm = false;
        } catch (error) {
          console.error("Error during registration:", error);
          this.errorMessage = error.message || "Failed to register user.";
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

<!-- //#region
//old code
// export default {
//   data() {
//     return {
//       email: "",
//       username: "",
//       password: "",
//       confirmPassword: "",
//       showConfirm: false, // Flag to show the email confirmation modal
//       errorMessage: "",
//     };
//   },
//   methods: {
//     handleSubmit() {
//       // Check if passwords match
//       if (this.password !== this.confirmPassword) {
//         this.errorMessage = "Passwords do not match.";
//         return; // Stop submission
//       }

//       this.errorMessage = ""; // Clear any previous error messages
//       this.showConfirm = true; // Show the email confirmation modal
//     },
//     confirmEmail(isConfirmed) {
//       if (isConfirmed) {
//         const user = {
//           email: this.email,
//           username: this.username,
//           password: this.password,
//         };
//         fetch("http://localhost:3000/api/signup", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(user),
//         })
//           .then((response) => response.json())
//           .then((data) => {
//             alert(data.message);
//             this.showConfirm = false;
//           })
//           .catch((error) => console.error(error));
//       } else {
//         this.showConfirm = false; // Close the modal if the user clicks "No"
//       }
//     },
//   },
// };
//#endregion
</script>

<style>
/* Style for the modal */
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

.card{
  height: 380px;
}
</style> -->
