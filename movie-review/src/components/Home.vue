
<template>

  
  <div class="Body">
    <div class="card">
      <h1>Welcome!</h1>
      <img alt="logo" class="logo" src="../assets/logo.png">
      <h3>To Our Movie Review Website</h3>
      <br/>
      <h3>Navigate to {insert page link here}. <br/>To view all the movies we have to offer!</h3>
      <br>
      <p> - The Fantastic Four Team</p>
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

