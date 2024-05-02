import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA5VglWqgkCsogq4L7815O6QzlB4-prlQ0",
    authDomain: "epsi-ubeer.firebaseapp.com",
    projectId: "epsi-ubeer",
    storageBucket: "epsi-ubeer.appspot.com",
    messagingSenderId: "1049650789784",
    appId: "1:1049650789784:web:b2b573351dfb8ecb613fed"
};

initializeApp(firebaseConfig);


const app = createApp(App)

app.use(router)

app.mount('#app')