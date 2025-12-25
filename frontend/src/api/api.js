import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:1337/api/',
  timeout: 5000,
});

export default {
  login(userData) {
    return apiClient.post('auth/local', userData);
  },
  register(userData) {
    return apiClient.post('auth/local/register', userData);
  },
  getCategories() {
    return apiClient.get('categories');
  },
  getArticles({ page, pageSize, sort, category, featured }) {
  const params = {
    'pagination[page]': page,
    'pagination[pageSize]': pageSize,
    sort: sort || 'publishedAt:desc',
    'populate[category][fields][0]': 'name',
    // Явно запрашиваем все нужные поля
    'fields[0]': 'title',
    'fields[1]': 'excerpt',
    'fields[2]': 'publishedAt',
    'fields[3]': 'views',
    'fields[4]': 'isFeatured',
    'fields[5]': 'documentId',
    'fields[6]': 'content',
  };

  if (category) {
    params['filters[category][slug][$eq]'] = category;
  }

  // ФИЛЬТР ПО РЕКОМЕНДУЕМЫМ - исправленный формат
  if (featured === 'true') {
    params['filters[isFeatured][$eq]'] = 'true'; // Попробуйте строку 'true'
    // ИЛИ если не работает:
    // params['filters[isFeatured][$eq]'] = true; // boolean
  }

  console.log('API Params for articles:', params); // Для отладки
  return apiClient.get('articles', { params });
},
  getArticleById(id) {
    return apiClient.get(`articles/${id}`, {
      params: {
        'populate[0]': 'coverImage',
        'populate[2]': 'author',
        'populate[3]': 'category',
      },
    });
  },
  createArticle(data) {
    return apiClient.post(`articles`, data, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });
  },
  uploadImage(image) {
  return apiClient.post(`upload`, image, {  
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data'
    },
  });
},
  deleteArticle(articleId) {
    return apiClient.delete(`articles/${articleId}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });
  },
  updateArticle(articleId, payload) {
    return apiClient.put(`articles/${articleId}`, payload, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });
  },
  getRole() {
    return apiClient.get('my-role', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });
  },
  getAuthor(id) {
    return apiClient.get(`articles/${id}/author`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });
  },
};
