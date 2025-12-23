import { ref } from 'vue';
import authApi from '@/api/api.js';
import { useRouter } from 'vue-router';

export default function userAuthorization() {
  const formData = ref({
    identifier: '',
    password: '',
  });

  const loading = ref(false);
  const error = ref(null);

  const router = useRouter();

  const submitForm = async () => {
    loading.value = true;
    error.value = null;

    try {
  const response = await authApi.login(formData.value);
  console.log('Успех:', response.data);
  const { jwt, user } = response.data;

  sessionStorage.setItem('userId', user.id);
  sessionStorage.setItem('token', jwt);
  
  // Пробуем получить роль, но если ошибка 403 — ставим роль по умолчанию
  try {
    const role = await authApi.getRole();
    sessionStorage.setItem('role', role.data.roleName);
    console.log('Роль:', role.data.roleName);
  } catch (roleErr) {
    if (roleErr.response?.status === 403) {
      // У пользователя нет доступа к /my-role, ставим роль по умолчанию
      sessionStorage.setItem('role', 'authenticated');
      console.log('Роль установлена по умолчанию: authenticated');
    } else {
      // Другая ошибка — просто логируем
      console.warn('Ошибка при получении роли:', roleErr);
      sessionStorage.setItem('role', 'authenticated');
    }
  }

  await router.push('/news');
} catch (err) {
  console.error('Authorization error', err);
  error.value = err.response?.data?.message || 'Authorization error';
}
  };

  return {
    formData,
    loading,
    error,
    submitForm,
  };
}
