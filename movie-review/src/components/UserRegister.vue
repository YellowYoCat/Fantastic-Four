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
    <div v-if="showConfirm" class="modal">
      <div class="modal-content">
        <p>Is this your email: {{ email }}?</p>
        <button class="loginbtn" @click="confirmEmail(true)">Yes</button>
        <button class="loginbtn" @click="confirmEmail(false)">No</button>
      </div>
    </div>

  </div>
</template>

<script>


import { gql } from 'graphql-tag'; // Import gql for GraphQL queries/mutations
import { ApolloClient, InMemoryCache } from '@apollo/client/core'; // Import Apollo Client

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql', // Your GraphQL endpoint
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
      // Check if passwords match
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return; 
      }

      this.errorMessage = ""; // Clear previous error messages
      this.showConfirm = true; // email confirmation 
    },
    async confirmEmail(isConfirmed) {
      if (isConfirmed) {
        try {
          // Define the GraphQL mutation for user registration
          const SIGNUP_MUTATION = gql`
            mutation Signup($email: String!, $password: String!) {
              signup(email: $email, password: $password)
            }
          `;

          // Execute the mutation
          const { data } = await client.mutate({
            mutation: SIGNUP_MUTATION,
            variables: {
              email: this.email,
              password: this.password,
            },
          });

          alert("User registered successfully!");
          this.showConfirm = false; 
        } catch (error) {
          console.error("Error during registration:", error.message);
          this.errorMessage = "Failed to register user.";
        }
      } else {
        this.showConfirm = false; 
      }
    },
  },
};

//#region
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
</style>
