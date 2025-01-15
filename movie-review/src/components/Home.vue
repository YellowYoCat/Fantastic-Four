<template>
  <div class="hello">
    
    <h3>This will be the nav</h3>
    <ul>
      <router-link to="/Login">Login</router-link>

    </ul>
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

