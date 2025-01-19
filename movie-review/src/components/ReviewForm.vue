<!-- <template>
  <div class="card">
    <br>
  <h1>Review Movie</h1>
  <div>
    <br>
    <h4 class="formword ">Movie Title</h4>
    <input class="forminput" v-model="Text" type="email" placeholder="Enter Email" />
    <h4 class="formword ">Password</h4>
    <input class="forminput" v-model="Text" placeholder="1/5" />
    <h4 class="formword ">Confirm Password</h4>
    <input class="forminput"v-model="Text" placeholder="Review the movie" />
    <br>
    <button class="formbtn" @click="register">Rate Movie</button>
  </div>

</div>
</template>
  
  <script>
  export default {
    name: 'ReviewForm',
  };
  </script>
   -->

   <template> 
    <div class="card">
      <br>
      <h1>Review Movie</h1>
      <div>
        <br>
        <h4 class="formword">Movie Title</h4>
        <input class="forminput" v-model="Text" type="email" placeholder="Enter movie title" />
        
        <h4 class="formword">Password</h4>
        <input class="forminput" v-model="Text" placeholder="1/5" />
        
        <h4 class="formword">Confirm Password</h4>
        <input class="forminput" v-model="Text" placeholder="Review the movie" />
        
        <br>
        <button class="formbtn" @click="register">Rate Movie</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ReviewForm',
  };
  </script>
  