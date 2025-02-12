<template>
  <div class="card">
    <br>
    <h1>Login</h1>
    <div>
      <label class="Regword">Email</label>
      <br>
      <input v-model="email" type="email" placeholder="Enter Email" required />
      <br>
      <br>

      <label class="Regword">Password</label>
      <br>
      <input type="password" v-model="password" placeholder="Enter Password" required />

      <br>

      <div v-if="errorMessage" style="color: red;">
        {{ errorMessage }}
      </div>

      <button class="loginbtn" @click="login">Login</button>
    </div>
  </div>
</template>

<script>

//switch to GraphQl
import { gql } from 'graphql-tag'; // Import gql for GraphQL queries/mutations
import { ApolloClient, InMemoryCache } from '@apollo/client/core'; // Import Apollo Client

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql', // Your GraphQL endpoint
  cache: new InMemoryCache(),
});

export default {
  name: 'LoginView',
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "" // To show error messages
    };
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        this.errorMessage = "Email and password are required.";
        return;
      }

      try {
        // Define the GraphQL mutation for login
        const LOGIN_MUTATION = gql`
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password)
          }
        `;

        // Execute the mutation
        const { data } = await client.mutate({
          mutation: LOGIN_MUTATION,
          variables: {
            email: this.email,
            password: this.password,
          },
        });

        // Store the JWT token in localStorage
        localStorage.setItem('token', data.login);

        alert("Login successful!");

        // Optionally redirect the user after successful login
        this.$router.push("/dashboard"); // Assuming you use Vue Router for navigation
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  }
};







//#region
//old code
// export default {
//   name: 'LoginView',
//   data() {
//     return {
//       email: "",
//       password: "",
//       errorMessage: "" // To show error messages
//     };
//   },
//   methods: {
//     async login() {
//       if (!this.email || !this.password) {
//         this.errorMessage = "Email and password are required.";
//         return;
//       }

//       try {
//         const response = await fetch("http://localhost:3000/api/login", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ email: this.email, password: this.password }),
//         });

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.error || "Login failed");
//         }

//         // Store the JWT token in localStorage
//         localStorage.setItem('token', data.token);

//         alert("Login successful!");

//         // Optionally redirect the user after successful login
//         this.$router.push("/dashboard"); // Assuming you use Vue Router for navigation
//       } catch (error) {
//         this.errorMessage = error.message;
//       }
//     }
//   }
// };
//#endregion
</script>


<style>
.loginbtn {
  background-color: #1974cf;
  color: white;
  border-radius: 25px;
  border: solid 5px white;
}

.card {
  height: 460px;
}
</style>
