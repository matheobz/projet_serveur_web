<template>

  <div>
    <Panier/>
    <div class="grid">
      <div class="column">
        <h1>Notre sélection de Bières</h1>
      </div>
      <div class="column">

      </div>
    </div>


  </div>
</template>

<script>
import Panier from '../components/PanierPopUp.vue';

export default {
   components: {
    Panier
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
}

.grid {
  display: flex;
  justify-content: center; /* Centre horizontalement */
  align-items: center; /* Centre verticalement (si vos colonnes ont la même hauteur) */
  margin: 40px auto 50px auto;
}

.grid .column {
  flex: 1;
  display: flex;
  justify-content: center; /* Centre horizontalement les éléments à l'intérieur de la colonne */
  align-items: center; /* Centre verticalement */
  text-align: center;
}

</style>