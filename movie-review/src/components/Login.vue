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
import { request, gql } from 'graphql-request'; 

// GraphQL endpoint
const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql'; 

export default {
  name: 'LoginView',
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "" 
    };
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        this.errorMessage = "Email and password are required.";
        return;
      }

      try {
        
        const LOGIN_MUTATION = gql`
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password)
          }
        `;

        
        const data = await request(GRAPHQL_ENDPOINT, LOGIN_MUTATION, {
          email: this.email,
          password: this.password,
        });

       
        localStorage.setItem('token', data.login);

        alert("Login successful!");

       
        // this.$router.push("/dashboard"); 
        window.location.hash = '/dashboard';
      } catch (error) {
        console.error("Login error:", error);

       
        if (error.response && error.response.errors && error.response.errors.length > 0) {
          this.errorMessage = error.response.errors[0].message;
        } else if (error.message) {
          
          this.errorMessage = error.message;
        } else {
          this.errorMessage = "Login failed. Please try again.";
        }
      }
    }
  }
};


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
