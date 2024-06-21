<template>
  <div v-if="accessGranted" class="container mt-5">
    <h1 class="mb-4">Brasseries</h1>
    <ul class="list-group">
      <li v-for="brasserie in brasseries" :key="brasserie.id" class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>{{ brasserie.nom }}</strong> - {{ brasserie.localisation }}
          </div>
          <div class="d-flex align-items-center">
            <img :src="brasserie.imageUrl || 'https://www.lejuke-box.fr/wp-content/uploads/2019/10/abendbrot-939435_1920-1080x675.jpg'" alt="Image de la brasserie" class="img-thumbnail" width="100">
            <div class="ml-3 d-flex align-items-center">
              <label class="custom-file-upload mr-3">
                <input type="file" @change="uploadBrasserieImage($event, brasserie.id)">
                Choisir un fichier
              </label>
              <button @click="deleteBrasserie(brasserie.id)" class="btn btn-danger btn-sm mr-3">Supprimer</button>
              <button @click="toggleBiereView(brasserie.id)" class="btn btn-info btn-sm">Voir les bières</button>
            </div>
          </div>
        </div>

        <div v-if="brasserie.id === currentBrasserieId" class="mt-3">
          <h2>Bières de {{ brasserie.nom }}</h2>
          <ul class="list-group">
            <li v-for="biere in bieres" :key="biere.id" class="list-group-item">
              <div class="d-flex justify-content-between align-items-center">
                {{ biere.nom }} - {{ biere.type }} - {{ biere.degreAlcool }}% - {{ biere.prix }}€
                <div class="d-flex align-items-center">
                  <img :src="biere.imageUrl || 'https://www.1001cocktails.com/wp-content/uploads/1001cocktails/2023/07/shutterstock_2173861113-scaled.jpg'" alt="Image de la bière" class="img-thumbnail" width="100">
                  <label class="custom-file-upload ml-3 mr-3">
                    <input type="file" @change="uploadBiereImage($event, biere.id)">
                    Choisir un fichier
                  </label>
                  <button @click="deleteBiere(biere.id)" class="btn btn-danger btn-sm">Supprimer</button>
                </div>
              </div>
            </li>
          </ul>
          <div class="form-inline mt-3">
            <input v-model="newBiere.nom" class="form-control mb-2 mr-sm-2" placeholder="Nom de la Bière">
            <input v-model="newBiere.type" class="form-control mb-2 mr-sm-2" placeholder="Type">
            <input v-model="newBiere.degreAlcool" type="number" step="0.01" class="form-control mb-2 mr-sm-2" placeholder="Degré d'Alcool">
            <input v-model="newBiere.prix" type="number" step="0.01" class="form-control mb-2 mr-sm-2" placeholder="Prix">
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
  <div v-else>
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="text-center">
        <h2>Entrez le code d'accès</h2>
        <input v-model="accessCodeInput" class="form-control mb-2" placeholder="Code d'accès" type="password">
        <button @click="verifyAccessCode" class="btn btn-primary">Vérifier</button>
        <p v-if="accessDenied" class="text-danger mt-2">Code incorrect. Veuillez réessayer.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, addDoc, doc, deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
  data() {
    return {
      brasseries: [],
      bieres: [],
      newBrasserie: { nom: "", localisation: "" },
      newBiere: { nom: "", type: "", degreAlcool: "", prix: "" },
      currentBrasserieId: null,
      accessCodeInput: "",
      accessGranted: false,
      accessDenied: false,
      correctAccessCode: "usopp" // Le code
    };
  },
  created() {
    if (this.accessGranted) {
      this.loadBrasseries();
    }
  },
  methods: {
    verifyAccessCode() {
      if (this.accessCodeInput === this.correctAccessCode) {
        this.accessGranted = true;
        this.accessDenied = false;
        this.loadBrasseries();
      } else {
        this.accessDenied = true;
      }
    },
    loadBrasseries() {
      const db = getFirestore();
      const brasserieCollection = collection(db, "brasseries");

      onSnapshot(brasserieCollection, (snapshot) => {
        this.brasseries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      });
    },
    async addBrasserie() {
      const db = getFirestore();
      const brasserieCollection = collection(db, "brasseries");

      await addDoc(brasserieCollection, this.newBrasserie);
      this.newBrasserie = { nom: "", localisation: "" };
    },
    async deleteBrasserie(id) {
      const db = getFirestore();
      const brasserieDoc = doc(db, "brasseries", id);

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

      onSnapshot(biereCollection, (snapshot) => {
        this.bieres = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      });
    },
    async addBiere(brasserieId) {
      const db = getFirestore();
      const biereCollection = collection(db, "brasseries", brasserieId, "bieres");

      await addDoc(biereCollection, {
        nom: this.newBiere.nom,
        type: this.newBiere.type,
        degreAlcool: this.newBiere.degreAlcool,
        prix: this.newBiere.prix
      });
      this.newBiere = { nom: "", type: "", degreAlcool: "", prix: "" };
    },
    async deleteBiere(id) {
      const db = getFirestore();
      const biereDoc = doc(db, "brasseries", this.currentBrasserieId, "bieres", id);

      await deleteDoc(biereDoc);
    },
    async uploadBrasserieImage(event, brasserieId) {
  const file = event.target.files[0];
  if (file) {
    const storage = getStorage();
    const storageRef = ref(storage, `brasseries/${brasserieId}/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      const db = getFirestore();
      const brasserieDoc = doc(db, "brasseries", brasserieId);
      await updateDoc(brasserieDoc, { imageUrl });
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image : ", error);
    }
  }
},
    async uploadBiereImage(event, biereId) {
      const file = event.target.files[0];
      if (file) {
        const storage = getStorage();
        const storageRef = ref(storage, `bieres/${biereId}/${file.name}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        const db = getFirestore();
        const biereDoc = doc(db, "brasseries", this.currentBrasserieId, "bieres", biereId);
        await updateDoc(biereDoc, { imageUrl });
      }
    }
  }
};
</script>

<style scoped>
.img-thumbnail {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  background-color: #f7f7f7;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.custom-file-upload {
  border: 1px solid #ddd;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  background-color: #f7f7f7;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.custom-file-upload input[type="file"] {
  display: none;
}

.mr-3 {
  margin-right: 1rem !important;
}

.ml-3 {
  margin-left: 1rem !important;
}

.vh-100 {
  height: 100vh;
}
</style>
