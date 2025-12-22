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
<<<<<<< HEAD
    console.log('Ответ категорий:', response);
    
    availableCategories.value = response.data.data.map(cat => ({
      label: cat.attributes?.name || cat.attributes?.slug,
      value: cat.attributes?.slug
    }));
  } catch (err) {
    console.error('Не удалось загрузить категории:', err);
    console.error('URL запроса:', err.config?.url);
=======
    // Предполагается, что категории — { id, name, slug }
    availableCategories.value = response.data.data.map(cat => ({
      label: cat.name || cat.slug,
      value: cat.slug
    }));
  } catch (err) {
    console.error('Не удалось загрузить категории:', err);
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
  }
};

// Загрузка данных
const loadArticles = async (page = 1) => {
  loading.value = true;
  error.value = null;

  try {
    const params = {
<<<<<<< HEAD
      page: page,
=======
      page: meta.value.page,
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
      pageSize: filters.value.pageSize,
      sort: filters.value.sort,
      category: filters.value.category
    };

    const response = await api.getArticles(params);
    articles.value = response.data.data;
    meta.value = response.data.meta.pagination;
  } catch (err) {
<<<<<<< HEAD
    console.error('Ошибка загрузки статей:', err.response || err);
=======
    console.error('Ошибка загрузки статей:', err);
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
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
<<<<<<< HEAD
=======
  // Можно перенаправить, но не обязательно
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
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
<<<<<<< HEAD
      <div class="header-left">
        <h1 class="page-title">📰 Статьи</h1>
        <p class="page-subtitle">Читайте, изучайте, делитесь знаниями</p>
      </div>
      <div class="header-right">
        <div v-if="isLoggedIn" class="user-actions">
          <button @click="handleCreateArticle" class="btn btn-primary create-btn">
            <span class="btn-icon">✏️</span> Новая статья
          </button>
          <button @click="handleLogout" class="btn btn-logout">
            <span class="btn-icon">🚪</span> Выйти
          </button>
        </div>
        <div v-else class="guest-actions">
          <router-link to="/login" class="btn btn-outline">
            <span class="btn-icon">🔑</span> Войти
          </router-link>
          <router-link to="/registration" class="btn btn-primary">
            <span class="btn-icon">📝</span> Регистрация
          </router-link>
=======
      <h1 class="page-title">Статьи</h1>
      <div class="auth-controls">
        <button v-if="isLoggedIn" @click="handleLogout" class="btn btn-secondary">
          Выйти
        </button>
        <div v-else>
          <router-link to="/login" class="btn btn-outline">Войти</router-link>
          <router-link to="/registration" class="btn btn-primary">Регистрация</router-link>
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
        </div>
      </div>
    </header>

    <!-- Фильтры -->
<<<<<<< HEAD
    <div class="filters-section">
      <ArticleFilters
          v-model="filters"
          :available-categories="availableCategories"
          @page-size-change="handlePageSizeChange"
      />
    </div>

    <!-- Список статей -->
    <div class="articles-section">
      <ArticleList
          :articles="articles"
          :loading="loading"
          :error="error"
      />
    </div>

    <!-- Пагинация -->
    <div class="pagination-section" v-if="meta.pageCount > 1">
      <Pagination
          :meta="meta"
          @go-to-page="goToPage"
      />
    </div>
=======
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
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
  </div>
</template>

<style scoped>
.news-page {
<<<<<<< HEAD
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 48px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
=======
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 48px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
}

.page-header {
  display: flex;
  justify-content: space-between;
<<<<<<< HEAD
  align-items: flex-start;
  padding: 40px 0 30px;
  color: white;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin: 0 0 8px;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 400;
}

.header-right {
  display: flex;
  gap: 15px;
  align-items: center;
}

.user-actions, .guest-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: 2px solid rgba(255,255,255,0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #764ba2, #667eea);
  border-color: rgba(255,255,255,0.3);
}

.btn-outline {
  background: rgba(255,255,255,0.1);
  color: white;
  border: 2px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(10px);
}

.btn-outline:hover {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.4);
}

.btn-logout {
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: 2px solid rgba(255,255,255,0.2);
}

.btn-logout:hover {
  background: rgba(185, 28, 28, 0.9);
}

.create-btn {
  background: linear-gradient(135deg, #10b981, #059669);
}

.create-btn:hover {
  background: linear-gradient(135deg, #059669, #10b981);
}

.btn-icon {
  font-size: 18px;
}

.filters-section {
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
}

.articles-section {
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  min-height: 400px;
}

.pagination-section {
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    text-align: center;
  }
  
  .header-right {
    width: 100%;
    justify-content: center;
  }
  
  .page-title {
    font-size: 2.2rem;
  }
  
  .news-page {
    padding: 0 16px 32px;
  }
=======
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
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
}
</style>