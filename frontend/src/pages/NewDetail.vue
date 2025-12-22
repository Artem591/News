<script setup>
import {ref, onMounted, computed} from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/api';
import router from "../../router/index.js";

const route = useRoute();
const article = ref(null);
const loading = ref(true);
const error = ref(null);
<<<<<<< HEAD
=======

>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
const canEdit = ref(false);

async function checkCanEdit() {
  const role = sessionStorage.getItem("role");
  const articleId = route.query.id;
  const userId = sessionStorage.getItem("userId");

<<<<<<< HEAD
  if (!role || !article.value || !articleId) {
=======
  if (!role || !article.value || !articleId)
  {
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
    canEdit.value = false;
    return;
  }

<<<<<<< HEAD
  if (role === 'Editor') {
=======
  if (role === 'Editor')
  {
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
    canEdit.value = true;
    return;
  }

  const author = await api.getAuthor(articleId)
  console.log(author.data.data.id)
  console.log(userId)

<<<<<<< HEAD
  if (!!author && String(author.data.data.id) === String(userId)) {
=======
  if (!!author && String(author.data.data.id) === String(userId))
  {
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
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
<<<<<<< HEAD
    await router.push(`/news`);
=======
    await router.push(`/news`); // или список статей
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
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
<<<<<<< HEAD
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
=======
    <div v-if="loading" class="article-loader">
      <div class="spinner"></div>
      <p>Загрузка статьи...</p>
    </div>

    <div v-else-if="error" class="article-error">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
    </div>

    <article v-else-if="article" class="article-detail">
      <!-- Обложка -->
      <div v-if="article.coverImage" class="article-cover-wrapper">
        <img
            :src="`http://localhost:1337${article.coverImage.url}`"
            :alt="article.title || 'Обложка статьи'"
            class="article-cover"
        />
      </div>

      <!-- Заголовок -->
      <h1 class="article-title">{{ article.title || 'Без заголовка' }}</h1>

      <!-- Краткое описание -->
      <p v-if="article.excerpt" class="article-excerpt">{{ article.excerpt }}</p>

      <div v-if="article.category" class="article-category">
        Категория:
        <span>{{article.category.name}}</span>
      </div>

      <!-- Метаинформация -->
      <div class="article-meta">
        <div class="meta-item">
          <span class="meta-label">Дата публикации:</span>
          <time :datetime="article.publishedAt">
            {{ new Date(article.publishedAt).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) }}
          </time>
        </div>

        <div class="meta-item">
          <span class="meta-label">Просмотров:</span>
          <span>{{ article.views ?? 0 }}</span>
        </div>

        <div v-if="article.isFeatured" class="meta-item featured">
          <span>🔥 Рекомендуемое</span>
        </div>
      </div>

      <div v-if="canEdit" class="article-actions">
        <button @click="handleEdit" class="btn btn-edit">✏️ Изменить</button>
        <button @click="handleDelete" class="btn btn-delete">🗑️ Удалить</button>
      </div>

      <!-- Теги -->
      <div v-if="article.tags && typeof article.tags === 'object'" class="article-tags">
        <span class="tags-label">Теги:</span>
        <div class="tags-list">
    <span
        v-for="(tag, key) in article.tags"
        :key="key"
        class="tag"
    >
      {{ tag }}
    </span>
        </div>
      </div>

      <!-- Контент -->
      <div v-if="article.content && article.content.length" class="article-content">
        <template v-for="(block, blockIdx) in article.content" :key="blockIdx">
          <h2 v-if="block.type === 'heading' && block.level === 2" class="content-heading h2">
            <template v-for="(child, i) in block.children" :key="i">
              {{ child.text }}
            </template>
          </h2>
          <h3 v-else-if="block.type === 'heading' && block.level === 3" class="content-heading h3">
            <template v-for="(child, i) in block.children" :key="i">
              {{ child.text }}
            </template>
          </h3>
          <p v-else-if="block.type === 'paragraph'" class="content-paragraph">
            <template v-for="(child, i) in block.children" :key="i">
              <strong v-if="child.bold">{{ child.text }}</strong>
              <em v-else-if="child.italic">{{ child.text }}</em>
              <u v-else-if="child.underline">{{ child.text }}</u>
              <a v-else-if="child.type === 'link'" :href="child.url" target="_blank" rel="noopener noreferrer">{{ child.text }}</a>
              <span v-else>{{ child.text }}</span>
            </template>
          </p>
        </template>
      </div>

      <div v-else class="empty-content">
        Контент статьи отсутствует.
      </div>
    </article>

    <div v-else class="article-not-found">
      <div class="not-found-icon">📄</div>
      <p>Статья не найдена.</p>
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
    </div>
  </div>
</template>

<style scoped>
.article-detail-container {
<<<<<<< HEAD
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
=======
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: #333;
  line-height: 1.6;
}

/* Загрузка */
.article-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

<<<<<<< HEAD
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
=======
/* Ошибка */
.article-error, .article-not-found {
  text-align: center;
  padding: 60px 20px;
  color: #d32f2f;
}

.error-icon, .not-found-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

/* Обложка */
.article-cover-wrapper {
  margin: -24px -24px 24px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.article-cover {
  width: 100%;
  height: auto;
  display: block;
  background-color: #f5f5f5;
}

/* Заголовок */
.article-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0 0 16px;
  color: #1a1a1a;
  line-height: 1.2;
}

/* Краткое описание */
.article-excerpt {
  font-size: 1.125rem;
  color: #555;
  margin: 0 0 24px;
  font-style: italic;
}

/* Метаинформация */
.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-weight: 600;
  color: #555;
  font-size: 0.875rem;
}

.meta-item.featured span {
  background: #fff3cd;
  color: #856404;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

/* Теги */
.article-tags {
  margin-bottom: 28px;
}

.tags-label {
  font-weight: 600;
  margin-right: 8px;
  color: #333;
}

.tags-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #e9ecef;
  color: #495057;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  white-space: nowrap;
}

/* Контент */
.article-content {
  font-size: 1.0625rem;
}

.content-heading {
  margin-top: 28px;
  margin-bottom: 16px;
  font-weight: 700;
  color: #222;
}

.h2 { font-size: 1.5rem; }
.h3 { font-size: 1.25rem; }

.content-paragraph {
  margin-bottom: 16px;
  color: #444;
}

.content-paragraph a {
  color: #007bff;
  text-decoration: underline;
}

.content-paragraph a:hover {
  color: #0056b3;
}

.empty-content {
  text-align: center;
  color: #888;
  padding: 32px 0;
  font-style: italic;
}

/* Адаптивность */
@media (max-width: 600px) {
  .article-title {
    font-size: 1.75rem;
  }

  .article-excerpt {
    font-size: 1rem;
  }

  .article-meta {
    flex-direction: column;
    gap: 12px;
  }
}

.article-actions {
  display: flex;
  gap: 12px;
  margin: 20px 0 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-edit {
  background: #007bff;
  color: white;
}

.btn-edit:hover {
  background: #0056b3;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #a71e2a;
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
}
</style>