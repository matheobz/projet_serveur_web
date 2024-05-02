<template>
    <h1>Feed</h1>
    <div v-if="user">
        <p>Pseudo: {{ user.pseudo }}</p>
        <p>Email: {{ user.email }}</p>
    </div>
    <div v-else>
        <p>Chargement...</p>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export default {
    setup() {
        const user = ref(null);
        const auth = getAuth();
        const db = getFirestore();

        onMounted(async () => {
            if (auth.currentUser) {
                const uid = auth.currentUser.uid;
                const userDocRef = doc(db, "users", uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    user.value = userDoc.data();  // Set the user reactive data to the document data
                } else {
                    console.log("No user data available");
                }
            }
        });

        return { user };
    }
}
</script>

<style scoped></style>