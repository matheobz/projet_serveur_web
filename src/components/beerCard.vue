<template>
  <div>
    <div class="grid">
      <div class="column">
        <h1>Notre sélection de Bières</h1>
      </div>
      <div class="column">
        <div class="boutton">
          <span class="material-symbols-outlined"> shopping_cart</span>
          <span class="Panier"> Panier</span>
        </div>
      </div>
    </div>

    <div class="beer-container">
      <div v-for="beer in beers" :key="beer.id" class="beer-card">
        <h2>{{ beer.name }}</h2>
        <p class="desc">{{ beer.description }}</p>
        <button @click="addToCart(beer)">Ajouter au panier</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      beers: [], // Initialiser un tableau pour stocker les données des bières
    };
  },
  mounted() {
    // Faire une requête GET à l'API backend pour récupérer les données de la base de données beer
    axios
      .get("http://localhost:3000/api/beers")
      .then((response) => {
        this.beers = response.data; // Mettre à jour le tableau de bières avec les données reçues
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données de bière:",
          error
        );
      });
  },
  methods: {
    addToCart(beer) {
      // Ajouter la bière au panier
      console.log("Ajout de la bière au panier :", beer);
      // Vous pouvez implémenter ici la logique pour ajouter la bière au panier
    },
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
}

.beer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.beer-card {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  width: 400px; /* Pour afficher trois cartes par ligne */
  box-sizing: border-box;
}

.beer-card h2 {
  margin-bottom: 10px;
}

.beer-card .desc {
  margin-bottom: 10px;
}

.beer-card button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.boutton {
  padding: 6px;
  border-radius: 6px;
  transition: 0.2s;
  background-color: rgb(24, 24, 223);
  width: 110px;
  display: flex; /* Utilisez flex pour centrer le contenu du bouton */
  justify-content: center; /* Centre horizontalement */
  align-items: center; /* Centre verticalement */
  margin: 0 auto; /* Centre le bouton dans le conteneur .column */
    cursor: pointer;
}

.boutton .material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
  font-size: 1.5rem;
  color: #ffffff;
  top: 2px;
  position: relative;
}

.boutton .Panier {
  font-size: 1.5rem;
  background-color: rgb(24, 24, 223);
  color: #ffffff;
  margin: 0 0 0 5px;
}

.boutton:hover {
  transform: scale(1.05)
}

.grid {
  display: flex;
  justify-content: center; /* Centre horizontalement */
  align-items: center; /* Centre verticalement (si vos colonnes ont la même hauteur) */
  margin: 40px auto 50px auto;
}

.grid .column {
  flex: 1; /* Assure que les colonnes prennent une largeur égale */
  display: flex;
  justify-content: center; /* Centre horizontalement les éléments à l'intérieur de la colonne */
  align-items: center; /* Centre verticalement */
  text-align: center;
}
</style>