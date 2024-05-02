import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";  // Correctly importing required functions

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: () => import("../views/HomeView.vue") },
        { path: "/register", component: () => import("../views/RegisterView.vue") },
        { path: "/sign-in", component: () => import("../views/SignInView.vue") },
        { path: "/catalogueAdmin", component: () => import("../views/CatalogueAdmin.vue") },
        {
            path: "/CatalogueView.vue",
            component: () => import("../views/CatalogueView.vue"),
            meta: { requiresAuth: true },
        },
    ],
});

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener();
                resolve(user);
            },
            reject
        );
    });
};

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (await getCurrentUser()) {
            next();
        } else {
            alert("You don't have access!");
            next("/");
        }
    } else {
        next();
    }
});

export default router;