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
    getArticles({ page, pageSize, sort, category }) {
        const params = {
            'pagination[page]': page,
            'pagination[pageSize]': pageSize,
            sort: sort || 'publishedAt:desc',
            'populate[category][fields][0]': 'name'
        };

        if (category) {
            params['filters[category][slug][$eq]'] = category;
        }

        return apiClient.get('articles', { params });
    },
    getArticleById(id) {
        return apiClient.get(`articles/${id}`, {
            params: {
                'populate[0]': 'coverImage',
                'populate[2]': 'author',
                'populate[3]': 'category'
            }
        });
    },
    createArticle(data) {
        return apiClient.post(`articles`, data,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    uploadImage(image){
        return apiClient.post(`upload`, image,
            {
                headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    deleteArticle(articleId){
        return apiClient.delete(`articles/${articleId}`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });
    },
    updateArticle(articleId, payload){
        return apiClient.put(`articles/${articleId}`, payload,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        })
    },
    getRole(){
        return apiClient.get('my-role', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    },
    getAuthor(id){
        return apiClient.get(`articles/${id}/author`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        });
    }
}