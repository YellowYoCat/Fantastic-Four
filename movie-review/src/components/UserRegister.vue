<template>
  <div class="card">
    <h2>Register</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <br>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
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
      password: "",
      showConfirm: false,
    };
  },
  methods: {
    handleSubmit() {
      this.showConfirm = true;
    },
    confirmEmail(isConfirmed) {
      if (isConfirmed) {
        const user = { email: this.email, password: this.password };
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