<template>
  <nav>
    <router-link to="/"> Home </router-link>
    <router-link to="/feed"> Feed </router-link>
    <router-link to="/register"> Register </router-link>
    <router-link to="/sign-in"> Login </router-link>
    <button @click="handleSignOut" v-if="isLoggedIn">Se déconnecter</button>
  </nav>
  <router-view />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const isLoggedIn = ref(false);
const auth = getAuth();  // Initialize Firebase Auth
const router = useRouter();  // This ensures you have access to `router`

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = user ? true : false;
  });
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push("/");  // Corrected from `route` to `router`
  }).catch((error) => {
    console.error("Error signing out: ", error);
  });
};

</script>

<style>

</style>