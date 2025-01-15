<template>
  <div class="hello">
    <ul>
      <img alt="logo" class="logo" src="../assets/Logo.png">
      <router-link to="/Login"><button>Login</button></router-link>
      <a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener"><button>babel</button></a>
      <a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener"><button>eslint</button></a>
    </ul>
  </div>
  
  <div class="Body">
    <div class="WelcomeMessage">
      <h1>Welcome!</h1>
      <h3>To Our Movie Review Website</h3>
      <br/>
      <h3>Navigate to {insert page link here}. <br/>To view all the movies we have to offer!</h3>
      <img alt="logo" class="WelcomeMessageLogo" src="../assets/Logo.png">
      <br>
      <p>The Fantastic Four Team</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

