<template>
  <div class="card">
    <br>
    <h1>Register</h1>
    <div>
      <h4 class="Regword">Email</h4>
      <input v-model="Text" type="email" placeholder="Enter Email" />
      <h4 class="Regword">Password</h4>
      <input type="password" v-model="password" placeholder="Enter Password" />
      <h4 class="Regword">Confirm Password</h4>
      <input type="password" v-model="password" placeholder="Confirm Password" />
      <br>
      <br>
      <button class="loginbtn" @click="register">Register</button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      password: ""
    }
  }
};
</script>