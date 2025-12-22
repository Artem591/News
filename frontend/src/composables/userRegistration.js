import { ref } from 'vue';
import authApi from '@/api/api';
import { useRouter } from 'vue-router';

export default function userRegistration() {
    const formData = ref({
        username: '',
        email: '',
        password: ''
    });

    const loading = ref(false);
    const error = ref(null);

    const router = useRouter();

    const submitForm = async () => {
        loading.value = true;
        error.value = null;

        try {
            const response = await authApi.register(formData.value);
            console.log('Success:', response.data);

            const {jwt, user} = response.data;

            sessionStorage.setItem('userId', user.id);
            sessionStorage.setItem('token', jwt);

            await router.push('/news');
        } catch (err) {
            console.error('Registration error', err);
            error.value = err.response?.data?.message || 'Email already used';
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