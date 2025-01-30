<template>
  <div class="card">
    <br>
    <h1>Login</h1>
    <div>
      <h4 class="Regword">Email</h4>
      <input v-model="email" type="email" placeholder="Enter Email" required />
      
      <h4 class="Regword">Password</h4>
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
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        alert("Login successful!");
        // Redirect or handle successful login
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  }
};
</script>

<style>
.loginbtn {
  background-color: #1974cf;
  color: white;
  border-radius: 25px;
  border: solid 5px white;
}

.card{
  
}
</style>
