<template>
  <div class="container mt-5">
    <h1 class="mb-4">Catalogue de Bières</h1>

    <div class="form-group mb-3 ">
      <label for="tri">Trier par :</label>
      <select v-model="critereTri" class="form-control" @change="trierBieres">
        <option value="brasserie">Brasserie (Ordre Alphabétique)</option>
        <option value="degreAlcoolDesc">Degré d'Alcool (Ordre Décroissant)</option>
        <option value="degreAlcoolAsc">Degré d'Alcool (Ordre Croissant)</option>
      </select>
    </div>

    <div class="row">
      <div v-for="biere in bieres" :key="biere.id" class="col-md-4 mb-4">
        <div class="card">
          <img class="card-img-top" :src="biere.imageUrl || 'https://www.shutterstock.com/image-photo/cold-glasses-beer-bar-600nw-2173861113.jpg'" alt="Image de la bière">
          <div class="card-body">
            <h5 class="card-title">{{ biere.nom }}</h5>
            <p class="card-text">Type : {{ biere.type }}</p>
            <p class="card-text">Degré d'alcool : {{ biere.degreAlcool }}%</p>
            <p class="card-text">Prix : {{ biere.prix }} €</p>
            <p class="card-text"><strong>Brasserie :</strong> {{ biere.brasserieNom }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, collectionGroup, onSnapshot, getDoc } from "firebase/firestore";

export default {
  data() {
    return {
      bieres: [],
      critereTri: "brasserie"
    };
  },
  mounted() {
    const db = getFirestore();
    const biereCollectionGroup = collectionGroup(db, "bieres");

    // Écouter les changements en temps réel pour toutes les bières
    onSnapshot(biereCollectionGroup, async (snapshot) => {
      const biereData = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const brasserieDoc = await getDoc(doc.ref.parent.parent);
        const brasserieNom = brasserieDoc.exists() ? brasserieDoc.data().nom : "Inconnue";
        return { id: doc.id, ...data, brasserieNom };
      }));
      this.bieres = biereData;
      this.trierBieres();
    });
  },
  methods: {
    trierBieres() {
      if (this.critereTri === "brasserie") {
        this.bieres.sort((a, b) => a.brasserieNom.localeCompare(b.brasserieNom));
      } else if (this.critereTri === "degreAlcoolDesc") {
        this.bieres.sort((a, b) => b.degreAlcool - a.degreAlcool);
      } else if (this.critereTri === "degreAlcoolAsc") {
        this.bieres.sort((a, b) => a.degreAlcool - b.degreAlcool);
      }
    }
  }
};
</script>
