<template>
    <h1>Sign-in</h1>
    <h2>Se connecter</h2>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button @click="register">Envoyer</button></p>
    <button @click="signInWithGoogle">Sign In with Google</button>
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
import { doc, getDoc, writeBatch, getFirestore} from "firebase/firestore"; // Make sure to import writeBatch

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
                    router.push('/feed');
                })
                .catch((error) => {
                    console.error(error.code);
                    alert(error.message);
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
        const checkUsernameUnique = async (username) => {
            const docRef = doc(db, "usernames", username);
            const docSnap = await getDoc(docRef);
            return !docSnap.exists(); // Returns true if username is unique
        };

       

        return { email, password, register, signInWithGoogle };
    }
}
</script>


<style scoped></style>