<template>
    <section class="d-flex justify-content-center align-items-center">
        <div class="container mt-5 block">
            <h1>Créer un compte</h1>
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
                <div class="mb-3">
                    <label for="pseudo" class="form-label">Username</label>
                    <input type="text" class="form-control" id="pseudo" placeholder="Username" v-model="pseudo">
                </div>
                <button type="submit" class="btn btn-primary">Envoyer</button><br>
                <button @click="signInWithGoogle" class="google-button">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                        alt="Google Logo" width="24" height="24" />
                    S'inscrire avec Google
                </button>
            </form>
            <p class="mt-3 text-danger" v-if="errorMsg">{{ errorMsg }}</p>
        </div>
    </section>
</template>

<script>
import { ref } from "vue";
import {
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { doc, getFirestore, getDoc, writeBatch, collection } from "firebase/firestore";
import { useRouter } from 'vue-router';

export default {
    setup() {
        const email = ref("");
        const password = ref("");
        const pseudo = ref("");
        const errorMsg = ref("");
        const router = useRouter();
        const auth = getAuth();
        const db = getFirestore();

        const checkUsernameUnique = async (username) => {
            if (!username) return false; // Return false if username is empty
            const docRef = doc(collection(db, "usernames"), username);
            const docSnap = await getDoc(docRef);
            return !docSnap.exists(); // Returns true if username is unique
        };

        const register = async () => {
            if (!email.value || !password.value || !pseudo.value) {
                errorMsg.value = "Tous les champs sont obligatoires.";
                return;
            }

            const isUnique = await checkUsernameUnique(pseudo.value);
            if (!isUnique) {
                errorMsg.value = "Ce pseudo est déjà utilisé. Veuillez en choisir un autre.";
                return;
            }

            createUserWithEmailAndPassword(auth, email.value, password.value)
                .then((userCredential) => {
                    console.log("Successfully registered!");
                    const batch = writeBatch(db);
                    const userDoc = doc(db, "users", userCredential.user.uid);
                    const usernameDoc = doc(collection(db, "usernames"), pseudo.value);
                    batch.set(userDoc, {
                        uid: userCredential.user.uid,
                        email: email.value,
                        pseudo: pseudo.value,
                    });
                    batch.set(usernameDoc, { uid: userCredential.user.uid }); // Documenting that the username is taken
                    return batch.commit();
                })
                .then(() => {
                    router.push('/CatalogueView.vue');
                })
                .catch((error) => {
                    errorMsg.value = error.message;
                    console.error(error.code);
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
                        const batch = writeBatch(db);
                        const userDoc = doc(db, "users", result.user.uid);
                        const usernameDoc = doc(collection(db, "usernames"), pseudoGenerated);
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

        return { email, password, pseudo, register, signInWithGoogle, errorMsg };
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
