<template>
    <section class="d-flex justify-content-center align-items-center">
        <div class="container mt-5 block">
            <h1>Se connecter</h1>
            <form @submit.prevent="register">
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" placeholder="Email" v-model="email">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Mot de passe</label>
                    <input type="password" class="form-control" id="password" placeholder="Mot de passe" v-model="password">
                </div>
                <button type="submit" class="btn btn-primary">Envoyer</button>
            </form><button @click="signInWithGoogle" class="google-button">
            <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
          alt="Google Logo"
          width="24"
          height="24"
        />
        Connexion avec Google
      </button>
            <p class="mt-3 text-danger" v-if="errorMsg">{{ errorMsg }}</p>
        </div>
    </section>
</template>

<script>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc, writeBatch, getFirestore } from "firebase/firestore"; // Make sure to import writeBatch

export default {
    setup() {
        const email = ref("");
        const password = ref("");
        const router = useRouter();
        const errorMsg = ref("");
        const auth = getAuth();
        const db = getFirestore();

        const register = () => {
            signInWithEmailAndPassword(getAuth(), email.value, password.value)
                .then(() => {
                    console.log("Successfully signed in!");
                    router.push('/CatalogueView.vue');
                })
                .catch((error) => {
                    console.error(error.code);
                    errorMsg.value = error.message;
                });
        };

        const signInWithGoogle = () => {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
                .then((result) => {
                    let pseudoGenerated = result.user.email.split('@')[0];
                    checkUsernameUnique(pseudoGenerated).then((isUnique) => {
                        if (!isUnique) {
                            pseudoGenerated += Math.floor(Math.random() * 1000); // Attempt to make a unique username
                        }
                        const batch = writeBatch(db); // Correct usage of batch
                        const userDoc = doc(db, "users", result.user.uid);
                        const usernameDoc = doc(db, "usernames", pseudoGenerated);
                        batch.set(userDoc, {
                            uid: result.user.uid,
                            email: result.user.email,
                            pseudo: pseudoGenerated,
                        });
                        batch.set(usernameDoc, { uid: result.user.uid });
                        return batch.commit();
                    })
                })
                .then(() => {
                    router.push("/CatalogueView.vue");
                })
                .catch((error) => {
                    errorMsg.value = error.message;
                    console.error("Google sign in error:", error.code);
                });
        };

        const checkUsernameUnique = async (username) => {
            const docRef = doc(db, "usernames", username);
            const docSnap = await getDoc(docRef);
            return !docSnap.exists(); // Returns true if username is unique
        };

        return { email, password, register, signInWithGoogle, errorMsg };
    }
}
</script>

<style scoped>
.block {
    width: 400px;
}

.google-button {
    background-color: #fff;
    color: #757575;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px 15px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    margin: 10px 0 0 0;
}

.google-button img {
    margin-right: 10px;
}
</style>