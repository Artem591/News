import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '@/pages/LoginPage.vue'
import RegistrationPage from "@/pages/RegistrationPage.vue";
import NewsPage from "@/pages/NewsPage.vue";
import NewDetail from "@/pages/NewDetail.vue";
import NewCreateOrUpdate from "@/pages/NewCreateOrUpdate.vue";

const routes = [
    { path: '/login', component: LoginPage},
    { path: '/registration', component: RegistrationPage},
    { path: '/news', component: NewsPage},
    { path: '/news/:id', component: NewDetail},
    { path: '/article-create', component: NewCreateOrUpdate },
    {path: '/article-update/:id', component: NewCreateOrUpdate },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/news'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router