<template>
  <div>
    <div class="grid">
      <div class="column">
    <h1>Notre sélection de Bières</h1>
</div>
<div class="column">
      <span class="material-symbols-outlined"> shopping_cart </span>
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

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
  font-size: 2.5em;
  cursor: pointer;
  right: 30px;
}

.grid {
  display: flex;
  margin: 40px auto 50px auto;

}

.grid .column {
  width: 50%;
  display: flex;
  flex-direction: column;
  text-align: center;
}
</style>