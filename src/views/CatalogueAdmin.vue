<template>
  <div class="container mt-5">
    <h1 class="mb-4">Brasseries</h1>
    <ul class="list-group">
      <li v-for="brasserie in brasseries" :key="brasserie.id" class="list-group-item">
        <strong>{{ brasserie.nom }}</strong> - {{ brasserie.localisation }}
        <button @click="deleteBrasserie(brasserie.id)" class="btn btn-danger btn-sm mx-2">Supprimer</button>
        <button @click="toggleBiereView(brasserie.id)" class="btn btn-info btn-sm">Voir les bières</button>

        <div v-if="brasserie.id === currentBrasserieId" class="mt-3">
          <h2>Bières de {{ brasserie.nom }}</h2>
          <ul class="list-group">
            <li v-for="biere in bieres" :key="biere.id" class="list-group-item">
              {{ biere.nom }} - {{ biere.type }} - {{ biere.degreAlcool }}% - {{ biere.prix }}€
              <button @click="deleteBiere(biere.id)" class="btn btn-danger btn-sm float-right">Supprimer</button>
            </li>
          </ul>
          <div class="form-inline mt-3">
            <input v-model="newBiere.nom" class="form-control mb-2 mr-sm-2" placeholder="Nom de la Bière">
            <input v-model="newBiere.type" class="form-control mb-2 mr-sm-2" placeholder="Type">
            <input v-model="newBiere.degreAlcool" type="number" step="0.01" class="form-control mb-2 mr-sm-2"
              placeholder="Degré d'Alcool">
            <input v-model="newBiere.prix" type="number" step="0.01" class="form-control mb-2 mr-sm-2"
              placeholder="Prix">
            <button @click="addBiere(brasserie.id)" class="btn btn-primary mb-2">Ajouter</button>
          </div>
        </div>

      </li>
    </ul>
    <div class="form-inline mt-4">
      <input v-model="newBrasserie.nom" class="form-control mb-2 mr-sm-2" placeholder="Nom de la Brasserie">
      <input v-model="newBrasserie.localisation" class="form-control mb-2 mr-sm-2" placeholder="Localisation">
      <button @click="addBrasserie" class="btn btn-success mb-2">Ajouter</button>
    </div>
  </div>
</template>


<script>
import { getFirestore, collection, addDoc, doc, deleteDoc, onSnapshot } from "firebase/firestore";

export default {
  data() {
    return {
      brasseries: [],
      bieres: [],
      newBrasserie: { nom: "", localisation: "" },
      newBiere: { nom: "", type: "", degreAlcool: "", prix: "" }, // Ajout du champ prix
      currentBrasserieId: null
    };
  },
  mounted() {
    const db = getFirestore();
    const brasserieCollection = collection(db, "brasseries");

    // Écouter les changements en temps réel pour les brasseries
    onSnapshot(brasserieCollection, (snapshot) => {
      this.brasseries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    });
  },
  methods: {
    async addBrasserie() {
      const db = getFirestore();
      const brasserieCollection = collection(db, "brasseries");

      // Ajouter une nouvelle brasserie
      await addDoc(brasserieCollection, this.newBrasserie);
      this.newBrasserie = { nom: "", localisation: "" };
    },
    async deleteBrasserie(id) {
      const db = getFirestore();
      const brasserieDoc = doc(db, "brasseries", id);

      // Supprimer la brasserie
      await deleteDoc(brasserieDoc);
      this.currentBrasserieId = null;
      this.bieres = [];
    },
    toggleBiereView(brasserieId) {
      if (this.currentBrasserieId === brasserieId) {
        this.currentBrasserieId = null;
        this.bieres = [];
      } else {
        this.currentBrasserieId = brasserieId;
        this.loadBieres(brasserieId);
      }
    },
    async loadBieres(brasserieId) {
      const db = getFirestore();
      const biereCollection = collection(db, "brasseries", brasserieId, "bieres");

      // Écouter les changements en temps réel pour les bières
      onSnapshot(biereCollection, (snapshot) => {
        this.bieres = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      });
    },
    async addBiere(brasserieId) {
      const db = getFirestore();
      const biereCollection = collection(db, "brasseries", brasserieId, "bieres");

      // Ajouter une nouvelle bière
      await addDoc(biereCollection, {
        nom: this.newBiere.nom,
        type: this.newBiere.type,
        degreAlcool: this.newBiere.degreAlcool,
        prix: this.newBiere.prix // Ajout du prix
      });
      this.newBiere = { nom: "", type: "", degreAlcool: "", prix: "" }; // Réinitialiser le formulaire
    },
    async deleteBiere(id) {
      const db = getFirestore();
      const biereDoc = doc(db, "brasseries", this.currentBrasserieId, "bieres", id);

      // Supprimer la bière
      await deleteDoc(biereDoc);
    }
  }
};
</script>