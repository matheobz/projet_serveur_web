<template>
  <nav class="navbar">

    <img src="../assets/images/Ubeer.png" alt="Logo" class="navbar-logo">


    <h1 class="navbar-title"></h1>


    <ul class="navbar-links">
      <li v-for="link in links" :key="link.text">
        <a :href="link.href">{{ link.text }}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      // Liste des liens modifiables
      links: [
        { text: 'Accueil', href: '/' },
        { text: 'À propos', href: '/about' },
        { text: 'Services', href: '/services' },
        // Ajoutez ou modifiez les liens ici selon vos besoins
      ]
    }
  }
}
</script>

<style>
/* Style global de la navbar */
.navbar {
  display: flex;
  align-items: center;
  padding: 10px 250px;
}

.navbar-logo {
  width: 110px;
  height: auto;
  margin-right: 20px;
}

.navbar-title {
  margin-right: auto;
}

.navbar-links {
  list-style-type: none;
  display: flex;
}

.navbar-links li {
  margin-left: 20px;
}

.navbar-links a {
  text-decoration: none;
}

.navbar-links a:hover {
  text-decoration: underline;
}
</style>
