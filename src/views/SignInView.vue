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
                    <input type="password" class="form-control" id="password" placeholder="Mot de passe"
                        v-model="password">
                </div>
                <button type="submit" class="btn btn-primary">Envoyer</button>
            </form><button @click="signInWithGoogle" class="google-button">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                    alt="Google Logo" width="24" height="24" />
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

        const signInWithGoogle = async () => {
            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                const userUid = result.user.uid;
                const userDocRef = doc(db, "users", userUid);

                const userDocSnap = await getDoc(userDocRef);

                if (!userDocSnap.exists()) {
                    // L'utilisateur n'existe pas encore dans la base de données
                    let pseudoGenerated = result.user.email.split('@')[0];
                    const isUnique = await checkUsernameUnique(pseudoGenerated);

                    if (!isUnique) {
                        pseudoGenerated += Math.floor(Math.random() * 1000); // Tente de rendre le pseudo unique
                    }

                    const batch = writeBatch(db); // Usage correct du batch
                    batch.set(userDocRef, {
                        uid: userUid,
                        email: result.user.email,
                        pseudo: pseudoGenerated,
                    });
                    const usernameDoc = doc(db, "usernames", pseudoGenerated);

                    batch.set(usernameDoc, { uid: userUid });

                    await batch.commit();
                }

                // Redirige l'utilisateur vers la page de catalogue
                router.push("/CatalogueView.vue");
            } catch (error) {
                errorMsg.value = error.message;
                console.error("Erreur de connexion Google:", error.code);
            }
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