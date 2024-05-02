<template>
  <div class="container mt-5">
    <h1 class="mb-4">Catalogue de Bières</h1>

    <div class="form-group mb-3">
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
          <img class="card-img-top img-beer" :src="biere.imageUrl || 'https://www.shutterstock.com/image-photo/cold-glasses-beer-bar-600nw-2173861113.jpg'" alt="Image de la bière">
          <div class="card-body">
            <h5 class="card-title">{{ biere.nom }}</h5>
            <p class="card-text">Type : {{ biere.type }}</p>
            <p class="card-text">Degré d'alcool : {{ biere.degreAlcool }}%</p>
            <p class="card-text">Prix : {{ biere.prix }} €</p>
            <p class="card-text"><strong>Brasserie :</strong> {{ biere.brasserieNom }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <button @click="modifierQuantite(biere, -1)" class="btn btn-danger btn-sm">-</button>
              <span>{{ getQuantite(biere) }}</span>
              <button @click="modifierQuantite(biere, 1)" class="btn btn-success btn-sm">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button @click="ouvrirPanier" class="btn btn-primary mt-3">
      Voir le Panier
    </button>

    <div v-if="panierOuvert" class="modal" @click.self="fermerPanier">
      <div class="modal-content">
        <h5>Panier</h5>
        <ul class="list-group mb-3">
          <li v-for="(item, index) in panier" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
            {{ item.biere.nom }} - {{ item.biere.prix }} €
            <div>
              <button @click="modifierQuantite(item.biere, -1)" class="btn btn-danger btn-sm mx-1">-</button>
              <span>{{ item.quantite }}</span>
              <button @click="modifierQuantite(item.biere, 1)" class="btn btn-success btn-sm mx-1">+</button>
            </div>
          </li>
        </ul>
        <p><strong>Total : </strong>{{ totalCommande }} €</p>
        <button @click="fermerPanier" class="btn btn-secondary">Fermer</button>
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
      panier: [],
      panierOuvert: false,
      critereTri: "brasserie"
    };
  },
  computed: {
    totalCommande() {
      return this.panier.reduce((total, item) => total + item.biere.prix * item.quantite, 0).toFixed(2);
    }
  },
  mounted() {
    const db = getFirestore();
    const biereCollectionGroup = collectionGroup(db, "bieres");

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
    },
    ajouterAuPanier(biere) {
      const index = this.panier.findIndex(item => item.biere.id === biere.id);
      if (index !== -1) {
        this.panier[index].quantite += 1;
      } else {
        this.panier.push({ biere, quantite: 1 });
      }
    },
    modifierQuantite(biere, quantite) {
      const index = this.panier.findIndex(item => item.biere.id === biere.id);
      if (index !== -1) {
        this.panier[index].quantite += quantite;
        if (this.panier[index].quantite <= 0) {
          this.panier.splice(index, 1);
        }
      } else if (quantite > 0) {
        this.panier.push({ biere, quantite });
      }
    },
    getQuantite(biere) {
      const item = this.panier.find(item => item.biere.id === biere.id);
      return item ? item.quantite : 0;
    },
    ouvrirPanier() {
      this.panierOuvert = true;
    },
    fermerPanier() {
      this.panierOuvert = false;
    }
  }
};
</script>

<style scoped>
.img-beer {
  height: 277px;
  width: auto;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
}
</style>
