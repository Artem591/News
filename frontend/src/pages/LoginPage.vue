<script setup>
import userAuthorization from "../composables/userAuthorization.js";

const {formData, submitForm, error} = userAuthorization();
<<<<<<< HEAD
</script>

<template>
  <main class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-icon">🔐</div>
        <h1 class="auth-title">Вход в систему</h1>
        <p class="auth-subtitle">Введите ваши учетные данные</p>
      </div>
      
      <form @submit.prevent="submitForm" class="auth-form">
        <div class="form-group">
          <label for="floatingName" class="form-label">Электронная почта</label>
          <div class="input-with-icon">
            <span class="input-icon">📧</span>
            <input 
              type="text" 
              class="form-control" 
              id="floatingName" 
              placeholder="your@email.com" 
              v-model="formData.identifier" 
              required
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="floatingPassword" class="form-label">Пароль</label>
          <div class="input-with-icon">
            <span class="input-icon">🔒</span>
            <input 
              type="password" 
              class="form-control" 
              id="floatingPassword" 
              placeholder="Введите пароль" 
              v-model="formData.password" 
              required
            >
          </div>
        </div>

        <div v-if="error" class="alert-error">
          <span class="error-icon">⚠️</span>
          {{ error }}
        </div>

        <button class="auth-submit-btn" type="submit">
          <span class="btn-text">Войти</span>
          <span class="btn-arrow">→</span>
        </button>

        <p class="auth-footer">
          Нет аккаунта?
          <router-link to="/registration" class="auth-link">Зарегистрироваться</router-link>
        </p>
      </form>
    </div>
=======

</script>

<template>
  <main class="form-signin">
    <form @submit.prevent="submitForm">
      <h1 class="h3 mb-3 fw-normal">Sign on</h1>

      <div class="form-floating">
        <input type="text" class="form-control" id="floatingName" placeholder="Username" v-model="formData.identifier" required>
        <label for="floatingName">Email</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="formData.password" required>
        <label for="floatingPassword">Password</label>
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <button class="w-100 btn btn-lg btn-primary" type="submit">Sign on</button>

      <p class="mt-3 text-center">
        No account?
        <router-link to="/registration">Sign in</router-link>
      </p>
    </form>
>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
  </main>
</template>

<style scoped>
<<<<<<< HEAD
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.9;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px;
  font-family: 'Inter', sans-serif;
}

.auth-subtitle {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
  opacity: 0.8;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #444;
  font-size: 14px;
  margin-left: 4px;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  font-size: 18px;
  color: #667eea;
  z-index: 1;
}

.form-control {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: white;
  color: #333;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.alert-error {
  background: linear-gradient(135deg, #fee, #fdd);
  color: #c53030;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(197, 48, 48, 0.2);
}

.error-icon {
  font-size: 18px;
}

.auth-submit-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.auth-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.auth-submit-btn:active {
  transform: translateY(0);
}

.btn-arrow {
  font-size: 20px;
  opacity: 0.8;
}

.auth-footer {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin: 24px 0 0;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.auth-link {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  margin-left: 6px;
  transition: color 0.2s;
}

.auth-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 30px 24px;
  }
  
  .auth-title {
    font-size: 1.75rem;
  }
}
=======
.form-signin {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 350px;
  padding: 15px;
  margin: auto;
  min-height: 100vh;
}

.form-signin form{
  width: 100%;
  background-color: #f5f5f5;
  padding: 30px;
  border-radius: 25px;
}

.form-signin div{
  margin-bottom: 10px;
}

.form-signin {
  font-weight: 400;
}

>>>>>>> 2a5282fdab7d620860aad9d55da61efbc77744fd
</style>