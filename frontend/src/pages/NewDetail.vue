<script setup>
import {ref, onMounted, computed} from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/api';
import router from "../../router/index.js";

const route = useRoute();
const article = ref(null);
const loading = ref(true);
const error = ref(null);
const canEdit = ref(false);

async function checkCanEdit() {
  const role = sessionStorage.getItem("role");
  const articleId = route.query.id;
  const userId = sessionStorage.getItem("userId");

  if (!role || !article.value || !articleId) {
    canEdit.value = false;
    return;
  }

  if (role === 'Editor') {
    canEdit.value = true;
    return;
  }

  const author = await api.getAuthor(articleId)
  console.log(author.data.data.id)
  console.log(userId)

  if (!!author && String(author.data.data.id) === String(userId)) {
    console.log("aaaaa")
    canEdit.value = true;
  }
}

const loadArticle = async () => {
  const id = route.params.id;

  if (!id) {
    error.value = 'ID статьи не указан';
    loading.value = false;
    return;
  }

  try {
    const response = await api.getArticleById(id);
    article.value = response.data.data;
    await checkCanEdit();
  } catch (err) {
    console.error('Ошибка загрузки статьи:', err);
    error.value = 'Не удалось загрузить статью';
  } finally {
    loading.value = false;
  }
};

const handleEdit = async () => {
  await router.push(`/article-update/${article.value.documentId}`);
};

const handleDelete = async () => {
  if (!confirm('Вы уверены, что хотите удалить эту статью?')) return;

  try {
    await api.deleteArticle(article.value.id);
    await router.push(`/news`);
  } catch (err) {
    console.error('Ошибка удаления статьи:', err);
    alert('Не удалось удалить статью');
  }
};

onMounted(() => {
  loadArticle();
});
</script>

<template>
  <div class="article-detail-container">
    <!-- Бэкграунд градиент -->
    <div class="background-gradient"></div>
    
    <!-- Контент -->
    <div class="article-content-wrapper">
      <div v-if="loading" class="loading-state">
        <div class="spinner-wrapper">
          <div class="spinner"></div>
          <p class="loading-text">Загружаем статью...</p>
        </div>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">❌</div>
        <h3 class="error-title">Ошибка загрузки</h3>
        <p class="error-message">{{ error }}</p>
        <router-link to="/news" class="back-link">
          ← Вернуться к статьям
        </router-link>
      </div>

      <div v-else-if="!article" class="not-found-state">
        <div class="not-found-icon">📄</div>
        <h3 class="not-found-title">Статья не найдена</h3>
        <p class="not-found-message">Возможно, статья была удалена или перемещена</p>
        <router-link to="/news" class="back-link">
          ← Вернуться к статьям
        </router-link>
      </div>

      <article v-else class="article-detail">
        <!-- Обложка -->
        <div v-if="article.coverImage" class="article-cover-wrapper">
          <div class="cover-overlay"></div>
          <img
              :src="`http://localhost:1337${article.coverImage.url}`"
              :alt="article.title || 'Обложка статьи'"
              class="article-cover"
          />
        </div>

        <!-- Основной контент -->
        <div class="article-main">
          <!-- Заголовок и мета -->
          <div class="article-header">
            <div class="category-badge" v-if="article.category">
              {{ article.category.name }}
            </div>
            
            <h1 class="article-title">{{ article.title || 'Без заголовка' }}</h1>
            
            <p v-if="article.excerpt" class="article-excerpt">
              {{ article.excerpt }}
            </p>

            <div class="article-meta-grid">
              <div class="meta-item">
                <span class="meta-icon">📅</span>
                <div class="meta-content">
                  <span class="meta-label">Опубликовано</span>
                  <time :datetime="article.publishedAt" class="meta-value">
                    {{ new Date(article.publishedAt).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) }}
                  </time>
                </div>
              </div>

              <div class="meta-item">
                <span class="meta-icon">👁️</span>
                <div class="meta-content">
                  <span class="meta-label">Просмотры</span>
                  <span class="meta-value">{{ article.views ?? 0 }}</span>
                </div>
              </div>

              <div v-if="article.isFeatured" class="meta-item featured">
                <span class="meta-icon">🔥</span>
                <div class="meta-content">
                  <span class="meta-label">Статус</span>
                  <span class="meta-value">Рекомендуемое</span>
                </div>
              </div>
            </div>

            <div v-if="canEdit" class="article-actions">
              <button @click="handleEdit" class="action-btn edit-btn">
                <span class="btn-icon">✏️</span>
                <span class="btn-text">Редактировать</span>
              </button>
              <button @click="handleDelete" class="action-btn delete-btn">
                <span class="btn-icon">🗑️</span>
                <span class="btn-text">Удалить</span>
              </button>
            </div>
          </div>

          <!-- Теги -->
          <div v-if="article.tags && typeof article.tags === 'object'" class="article-tags-section">
            <div class="tags-title">
              <span class="tags-icon">🏷️</span>
              <span>Теги:</span>
            </div>
            <div class="tags-container">
              <span
                  v-for="(tag, key) in article.tags"
                  :key="key"
                  class="tag-item"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Контент статьи -->
          <div v-if="article.content && article.content.length" class="article-content">
            <div 
              v-for="(block, blockIdx) in article.content" 
              :key="blockIdx"
              :class="[
                'content-block',
                `block-${block.type}`,
                block.type === 'heading' ? `heading-${block.level}` : ''
              ]"
            >
              <template v-if="block.type === 'heading'">
                <h2 v-if="block.level === 2" class="content-heading h2">
                  <template v-for="(child, i) in block.children" :key="i">
                    {{ child.text }}
                  </template>
                </h2>
                <h3 v-else-if="block.level === 3" class="content-heading h3">
                  <template v-for="(child, i) in block.children" :key="i">
                    {{ child.text }}
                  </template>
                </h3>
              </template>
              
              <p v-else-if="block.type === 'paragraph'" class="content-paragraph">
                <template v-for="(child, i) in block.children" :key="i">
                  <strong v-if="child.bold">{{ child.text }}</strong>
                  <em v-else-if="child.italic">{{ child.text }}</em>
                  <u v-else-if="child.underline">{{ child.text }}</u>
                  <a v-else-if="child.type === 'link'" 
                     :href="child.url" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     class="content-link">
                    {{ child.text }}
                  </a>
                  <span v-else>{{ child.text }}</span>
                </template>
              </p>
            </div>
          </div>

          <div v-else class="empty-content">
            <div class="empty-icon">📝</div>
            <p class="empty-text">Контент статьи отсутствует</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.article-detail-container {
  min-height: 100vh;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: -1;
}

.article-content-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

/* Состояния загрузки/ошибки */
.loading-state, .error-state, .not-found-state {
  background: white;
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
  margin-top: 40px;
}

.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.error-icon, .not-found-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.8;
}

.error-title, .not-found-title {
  font-size: 1.8rem;
  color: #333;
  margin: 0 0 12px;
}

.error-message, .not-found-message {
  color: #666;
  margin: 0 0 30px;
  line-height: 1.5;
}

.back-link {
  display: inline-block;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  padding: 10px 20px;
  border: 2px solid #667eea;
  border-radius: 12px;
  transition: all 0.3s;
}

.back-link:hover {
  background: #667eea;
  color: white;
}

/* Основная статья */
.article-detail {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60
}
</style>