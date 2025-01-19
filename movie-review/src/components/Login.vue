<template>
    <div class="card">
     <h1>Register</h1>
     <div>
      <h4>Email</h4>
      <input v-model="Text" type="email" placeholder="Enter Email"/>
      <h4>Password</h4>
      <input type="password" v-model="password" placeholder="Enter Password"/>
      <h4>Confirm Password</h4>
      <input type="password" v-model="password" placeholder="Confirm Password"/>
      <br>
      <button class="loginbtn" @click="register">Register</button>
     </div>

    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginView',
    data(){
      return{
        password: ""
      }
    }
};

  
  
  </script>
  