<script setup>
defineProps({
  articles: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});
</script>

<template>
  <div class="articles-list">
    <div v-if="loading" class="status-message">Загрузка...</div>
    <div v-else-if="error" class="status-message error">{{ error }}</div>
    <div v-else>
      <p v-if="articles.length === 0" class="empty-state">Нет статей</p>
      <ul v-else>
        <li v-for="article in articles" :key="article.id" class="article-card">
          <router-link
            :to="{ path: `/news/${article.documentId}`, query: { id: article.id } }"
            class="article-link"
          >
            <div class="article-content">
              <h3 class="article-title">{{ article.title }}</h3>
              <div v-if="article.category" class="article-category">
                Категория:
                <span>
                  {{
                    typeof article.category === 'string'
                      ? article.category
                      : article.category.name || article.category.slug
                  }}
                </span>
              </div>
              <p class="article-excerpt">
                Описание:
                {{
                  article.excerpt ||
                  (article.content?.[0]?.children?.[0]?.text
                    ? (() => {
                        const text = article.content[0].children[0].text;
                        return text.length > 10 ? text.substring(0, 10) + '...' : text;
                      })()
                    : 'Описание отсутствует')
                }}
              </p>
            </div>
            <small class="article-date">
              {{ new Date(article.publishedAt).toLocaleDateString('ru-RU') }}
            </small>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.articles-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.article-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease;
}

.article-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.article-link {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  text-decoration: none;
  color: inherit;
  gap: 16px;
}

.article-content {
  flex: 1;
  min-width: 0;
}

.article-title {
  margin: 0 0 8px;
  font-size: 1.25rem;
  color: #1a73e8;
}

.article-category,
.article-excerpt {
  display: block;
  margin: 4px 0;
}

.article-excerpt {
  color: #555;
  line-height: 1.5;
  margin: 12px 0;
}

.article-date {
  color: #888;
  font-size: 0.875rem;
  white-space: nowrap;
  text-align: right;
  flex-shrink: 0;
  width: 100px;
}

.empty-state {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 32px 0;
}

.status-message {
  text-align: center;
  padding: 20px;
  font-size: 1.1rem;
  color: #666;
}

.status-message.error {
  color: #dc3545;
}
</style>
