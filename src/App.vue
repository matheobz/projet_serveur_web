<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">

      <router-link to="/" class="navbar-brand">
        <img src="./assets/images/Ubeer.png" alt="Logo" class="navbar-logo">
        <h1 class="navbar-title">Ubeer</h1>
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/"> Accueil </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/CatalogueView.vue"> Catalogue </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/catalogueAdmin"> Admin BDD </router-link>
          </li>
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="btn btn-dark" to="/register"> S'inscrire </router-link>
          </li>
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="btn btn-success" to="/sign-in"> Connexion </router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <button @click="handleSignOut" class="btn btn-danger">Se déconnecter</button>
          </li>
        </ul>
      </div>

    </div>
  </nav>
<div style="height: 70px;"></div>
  <router-view />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const isLoggedIn = ref(false);
const auth = getAuth();
const router = useRouter();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = user ? true : false;
  });
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push("/");
  }).catch((error) => {
    console.error("Erreur lors de la déconnexion : ", error);
  });
};
</script>

<style scoped>
.navbar{
  position: fixed;
  width: 100%;
  z-index: 2;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.navbar-logo {
  width: 40px;
  margin-right: 10px;
}

.btn-dark {
  margin: 0 5px 0 15px;
}

.btn-danger {
  margin: 0 5px 0 15px;
}
</style>
