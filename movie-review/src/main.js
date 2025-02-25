
import { createApp, ref } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);


const isLoggedIn = ref(false);


app.provide('isLoggedIn', isLoggedIn);

app.use(router);
app.mount('#app');