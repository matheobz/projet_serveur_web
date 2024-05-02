<template>
    <h1>Register</h1>
    <h2>Créer un compte</h2>
    <p>test@mail.com</p>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p>password</p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p>jean</p>
    <p><input type="text" placeholder="Pseudo" v-model="pseudo" /></p>
    <p>
        <button @click="register">Envoyer</button>
    </p>
    <p><button @click="signInWithGoogle">Register with Google</button></p>

    <p v-if="errorMsg">{{ errorMsg }}</p>
</template>

<script>
import { ref } from "vue";
import {
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { doc, getFirestore, getDoc, writeBatch } from "firebase/firestore"; // Make sure to import writeBatch
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
            const docRef = doc(db, "usernames", username);
            const docSnap = await getDoc(docRef);
            return !docSnap.exists(); // Returns true if username is unique
        };

        const register = async () => {
            const isUnique = await checkUsernameUnique(pseudo.value);
            if (!isUnique) {
                errorMsg.value = "Ce pseudo est déjà utilisé. Veuillez en choisir un autre.";
                return;
            }

            createUserWithEmailAndPassword(auth, email.value, password.value)
                .then((userCredential) => {
                    console.log("Successfully registered!");
                    const batch = writeBatch(db); // Correct usage of batch
                    const userDoc = doc(db, "users", userCredential.user.uid);
                    const usernameDoc = doc(db, "usernames", pseudo.value);
                    batch.set(userDoc, {
                        uid: userCredential.user.uid,
                        email: email.value,
                        pseudo: pseudo.value,
                    });
                    batch.set(usernameDoc, { uid: userCredential.user.uid }); // Documenting that the username is taken
                    return batch.commit();
                })
                .then(() => {
                    router.push('/feed');
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
                    router.push("/feed");
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


<style scoped></style>