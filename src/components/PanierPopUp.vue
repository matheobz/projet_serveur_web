<!-- <template>
  <h1>Catalogue</h1>
</template>

<script>
</script>

<style scoped>
</style> -->

<template>
  <div>
    <div class="boutton" @click="togglePopup">
      <span class="material-symbols-outlined">shopping_cart</span>
    </div>

    <div v-if="showPopup" class="popup-overlay" @click="togglePopup">
      <div class="popup-content" @click.stop>
        <h2>Votre panier</h2>
        <ul>
          <li v-for="beer in beers" :key="beer.name">
            {{ beer.name }} - {{ beer.price }}€
          </li>
        </ul>
        <p>Total : {{ total }}€</p>
        <button @click="checkout">Passer à la caisse</button>
        <button @click="togglePopup">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      beers: [],
      showPopup: false,
    };
  },
  computed: {
    total() {
      return this.beers.reduce((acc, beer) => acc + beer.price, 0);
    },
  },
  methods: {
    addToCart(beer) {
      console.log("Ajout de la bière au panier :", beer);
      // Logique pour ajouter à `beers`...
    },
    togglePopup() {
      this.showPopup = !this.showPopup;
    },
    checkout() {
      console.log("Passer à la caisse");
      // Logique pour la caisse...
    },
  },
};
</script>


<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* S'assure que le pop-up est au-dessus des autres contenus */
}

.popup-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}


.boutton {
  padding: 27px;
  border-radius: 50px;
  transition: 0.2s;
  background-color: rgb(17, 138, 67);
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: fixed; /* Changez la position à fixed */
  right: 200px; /* Position depuis le côté droit de l'écran */
  bottom: 50px; /* Position depuis le bas de l'écran */
  z-index: 1500; /* S'assure qu'il est au-dessus de la plupart des autres éléments */
}

.boutton .material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
  font-size: 1.7rem;
  color: #ffffff;
  top: 2px;
  position: relative;
}


.boutton:hover {
  transform: scale(1.05);
}
</style>