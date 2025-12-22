<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/api';

import ArticleFilters from '@/components/ArticleFilters.vue';
import ArticleList from '@/components/ArticleList.vue';
import Pagination from '@/components/Pagination.vue';

const router = useRouter();

// Аутентификация
const isLoggedIn = ref(!!sessionStorage.getItem('token'));

// Состояние статей
const articles = ref([]);
const meta = ref({
  page: 1,
  pageSize: 10,
  pageCount: 1,
  total: 0,
});
const loading = ref(false);
const error = ref(null);

// Фильтры и сортировка
const filters = ref({
  category: '',
  sort: 'publishedAt:desc',
  pageSize: 10
});

// Получаем все категории
const availableCategories = ref([]);

const loadCategories = async () => {
  try {
    const response = await api.getCategories();
    // Предполагается, что категории — { id, name, slug }
    availableCategories.value = response.data.data.map(cat => ({
      label: cat.name || cat.slug,
      value: cat.slug
    }));
  } catch (err) {
    console.error('Не удалось загрузить категории:', err);
  }
};

// Загрузка данных
const loadArticles = async (page = 1) => {
  loading.value = true;
  error.value = null;

  try {
    const params = {
      page: meta.value.page,
      pageSize: filters.value.pageSize,
      sort: filters.value.sort,
      category: filters.value.category
    };

    const response = await api.getArticles(params);
    articles.value = response.data.data;
    meta.value = response.data.meta.pagination;
  } catch (err) {
    console.error('Ошибка загрузки статей:', err);
    error.value = 'Не удалось загрузить статьи';
  } finally {
    loading.value = false;
  }
};

// Реакция на изменения фильтров
watch(filters, () => {
  meta.value.page = 1;
  loadArticles(1);
});

// Пагинация
const goToPage = (page) => {
  if (page < 1 || page > meta.value.pageCount) return;
  meta.value.page = page;
  loadArticles(page);
};

const handlePageSizeChange = (newSize) => {
  filters.value.pageSize = newSize;
  meta.value.page = 1;
  loadArticles(1);
};

// Выход
const handleLogout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('role');
  isLoggedIn.value = false;
  // Можно перенаправить, но не обязательно
};

const handleCreateArticle = () => {
  router.push('/article-create');
};

onMounted(() => {
  loadCategories();
  loadArticles(meta.value.page);
});
</script>

<template>
  <div class="news-page">
    <header class="page-header">
      <h1 class="page-title">Статьи</h1>
      <div class="auth-controls">
        <button v-if="isLoggedIn" @click="handleLogout" class="btn btn-secondary">
          Выйти
        </button>
        <div v-else>
          <router-link to="/login" class="btn btn-outline">Войти</router-link>
          <router-link to="/registration" class="btn btn-primary">Регистрация</router-link>
        </div>
      </div>
    </header>

    <!-- Фильтры -->
    <ArticleFilters
        v-model="filters"
        :available-categories="availableCategories"
        @page-size-change="handlePageSizeChange"
    />

    <button
        v-if="isLoggedIn"
        @click="handleCreateArticle"
        class="btn btn-primary"
        style="margin-left: auto;"
    >
      Добавить статью
    </button>

    <!-- Список статей -->
    <ArticleList
        :articles="articles"
        :loading="loading"
        :error="error"
    />

    <!-- Пагинация -->
    <Pagination
        :meta="meta"
        @go-to-page="goToPage"
    />
  </div>
</template>

<style scoped>
.news-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 48px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.auth-controls {
  display: flex;
  gap: 12px;
}

.btn {
  margin: 5px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-outline {
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline:hover {
  background-color: #f0f8ff;
}
</style>