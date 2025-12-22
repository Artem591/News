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
            const {jwt, user} = response.data;

            sessionStorage.setItem('userId', user.id);
            sessionStorage.setItem('token', jwt);
            const role = await authApi.getRole();
            sessionStorage.setItem('role', role.data.roleName);
            console.log(role.data.roleName);

            await router.push('/news');
        } catch (err) {
            console.error('Authorization error', err);
            error.value = err.response?.data?.message || 'Authorization error';
        } finally {
            loading.value = false;
        }
    };

    return {
        formData,
        loading,
        error,
        submitForm,
    };
}