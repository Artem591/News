<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/api';

const route = useRoute();
const router = useRouter();

const articleId = route.params.id;
const isEditing = !!articleId;

// Форма статьи
const formData = ref({
  title: '',
  content: '',
  excerpt: '',
  isFeatured: false,
  tags: '',
  category: '',
});

// Обложка
const coverImage = ref({
  file: null,
  preview: '',
  existingId: null,
});

// Состояния
const categories = ref([]);
const loading = ref(false);
const error = ref(null);

// Загрузка категорий
const loadCategories = async () => {
  try {
    const response = await api.getCategories();
    categories.value = response.data.data || [];
  } catch (err) {
    console.error('Не удалось загрузить категории:', err);
    error.value = 'Ошибка при загрузке категорий';
  }
};

// Загрузка статьи (только при редактировании)
const loadArticle = async () => {
  loading.value = true;
  try {
    // В Strapi v4 нужно явно populate нужные поля
    const response = await api.getArticleById(articleId, {
      populate: ['coverImage', 'category'],
    });
    const article = response.data.data;

    formData.value.title = article.title || '';
    formData.value.excerpt = article.excerpt || '';
    formData.value.isFeatured = article.isFeatured || false;
    formData.value.category = article.category?.id ? String(article.category.id) : '';
    formData.value.tags = article.tags?.join(', ') || '';

    // Извлекаем plain text из rich text (пока только простые параграфы)
    let plainText = '';
    if (Array.isArray(article.content)) {
      for (const block of article.content) {
        if (block.type === 'paragraph' && Array.isArray(block.children)) {
          plainText += block.children.map((child) => child.text || '').join('');
        }
      }
    }
    formData.value.content = plainText.trim();

    // Обложка
    if (article.coverImage) {
      coverImage.value.preview = `http://localhost:1337${article.coverImage.url}`;
      coverImage.value.existingId = article.coverImage.id;
    }
  } catch (err) {
    console.error('Ошибка загрузки статьи:', err);
    error.value = 'Не удалось загрузить статью';
    router.push('/news');
  } finally {
    loading.value = false;
  }
};

// Преобразование plain text → Strapi rich text (blocks)
const textToRichText = (text) => {
  if (!text) return [];
  return [
    {
      type: 'paragraph',
      children: [{ type: 'text', text }],
    },
  ];
};

// Загрузка изображения в Strapi
const uploadImage = async (file) => {
  if (!file) return null;
  const formDataImg = new FormData();
  formDataImg.append('files', file);
  try {
    const response = await api.uploadImage(formDataImg);
    return response.data[0]?.id || null;
  } catch (err) {
    console.error('Ошибка загрузки изображения:', err);
    throw new Error('Не удалось загрузить обложку');
  }
};

// Обработчик выбора файла
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    coverImage.value.file = file;
    coverImage.value.preview = URL.createObjectURL(file);
  }
};

// Отправка формы
const handleSubmit = async () => {
  const { title, content } = formData.value;
  if (!title || !content.trim()) {
    error.value = 'Заполните обязательные поля: заголовок и контент.';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    let coverImageId = coverImage.value.existingId;

    if (coverImage.value.file) {
      coverImageId = await uploadImage(coverImage.value.file);
    }

    const payload = {
      data: {
        title: title.trim(),
        content: textToRichText(content.trim()),
        excerpt: formData.value.excerpt.trim() || undefined,
        isFeatured: formData.value.isFeatured,
        tags: formData.value.tags
          ? formData.value.tags
              .split(',')
              .map((t) => t.trim())
              .filter((t) => t)
          : undefined,
        category: formData.value.category ? parseInt(formData.value.category, 10) : undefined,
        coverImage: coverImageId, // null — удалит, ID — сохранит/заменит
      },
    };

    if (isEditing) {
      await api.updateArticle(articleId, payload);
    } else {
      await api.createArticle(payload);
    }

    await router.push('/news');
  } catch (err) {
    console.error('Ошибка сохранения статьи:', err);
    error.value = err.message || 'Не удалось сохранить статью. Проверьте данные и права доступа.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCategories();
  if (isEditing) {
    loadArticle();
  }
});
</script>

<template>
  <div class="article-form-page">
    <h1>{{ isEditing ? 'Редактировать статью' : 'Создать новую статью' }}</h1>

    <div v-if="loading && isEditing" class="loader">
      <div class="spinner" />
      <p>Загрузка статьи...</p>
    </div>

    <form v-else class="article-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Заголовок *</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          required
          placeholder="Заголовок статьи"
        />
      </div>

      <div class="form-group">
        <label for="content">Контент *</label>
        <textarea
          id="content"
          v-model="formData.content"
          rows="10"
          required
          placeholder="Введите текст статьи..."
        />
        <small>Текст будет преобразован в один абзац (параграф).</small>
      </div>

      <div class="form-group">
        <label for="excerpt">Краткое описание</label>
        <textarea
          id="excerpt"
          v-model="formData.excerpt"
          rows="3"
          placeholder="Краткое описание для превью"
        />
      </div>

      <div class="form-group">
        <label for="category">Категория</label>
        <select id="category" v-model="formData.category">
          <option value="">— Не выбрано —</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="tags">Теги (через запятую)</label>
        <input id="tags" v-model="formData.tags" type="text" placeholder="тег1, тег2, тег3" />
      </div>

      <div class="form-group checkbox-group">
        <label for="isFeatured">
          <input id="isFeatured" v-model="formData.isFeatured" type="checkbox" />
          Выделенная статья
        </label>
      </div>

      <!-- Обложка -->
      <div class="form-group">
        <label for="coverImageFile">Обложка</label>
        <input id="coverImageFile" type="file" accept="image/*" @change="handleFileChange" />
        <div v-if="coverImage.preview" class="image-preview">
          <img :src="coverImage.preview" alt="Превью обложки" />
        </div>
        <small>Поддерживаемые форматы: JPG, PNG, WEBP.</small>
      </div>

      <!-- Ошибки -->
      <div v-if="error" class="error-message">{{ error }}</div>

      <!-- Кнопки -->
      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn btn-primary">
          {{ loading ? 'Сохраняем...' : isEditing ? 'Сохранить изменения' : 'Создать статью' }}
        </button>
        <router-link to="/news" class="btn btn-outline">Отмена</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
.article-form-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  color: #666;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.article-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input[type='text'],
.form-group input[type='file'],
.form-group textarea,
.form-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.image-preview {
  margin-top: 10px;
  max-width: 300px;
  border: 1px solid #eee;
  border-radius: 6px;
  overflow: hidden;
  background: #fafafa;
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.error-message {
  color: #d32f2f;
  background: #ffebee;
  padding: 12px;
  border-radius: 6px;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: background 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline:hover {
  background: #f0f8ff;
}
</style>
