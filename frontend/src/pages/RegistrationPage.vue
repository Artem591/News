<script setup>
import userRegistration from "@/composables/userRegistration.js";

const {formData, submitForm, error} = userRegistration();
</script>

<template>
  <main class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-icon">📝</div>
        <h1 class="auth-title">Регистрация</h1>
        <p class="auth-subtitle">Создайте свой аккаунт</p>
      </div>
      
      <form @submit.prevent="submitForm" class="auth-form">
        <div class="form-group">
          <label for="floatingInput" class="form-label">Имя пользователя</label>
          <div class="input-with-icon">
            <span class="input-icon">👤</span>
            <input 
              type="text" 
              class="form-control" 
              id="floatingInput" 
              placeholder="username" 
              v-model="formData.username" 
              required
            >
          </div>
        </div>

        <div class="form-group">
          <label for="floatingEmail" class="form-label">Электронная почта</label>
          <div class="input-with-icon">
            <span class="input-icon">📧</span>
            <input 
              type="email" 
              class="form-control" 
              id="floatingEmail" 
              placeholder="name@example.com" 
              v-model="formData.email" 
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
              placeholder="Создайте пароль" 
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
          <span class="btn-text">Зарегистрироваться</span>
          <span class="btn-arrow">→</span>
        </button>

        <p class="auth-footer">
          Уже есть аккаунт?
          <router-link to="/login" class="auth-link">Войти</router-link>
        </p>
      </form>
    </div>
  </main>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.auth-card {
  width: 100%;
  max-width: 450px;
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
  color: #f5576c;
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
  border-color: #f5576c;
  box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
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
  background: linear-gradient(135deg, #f093fb, #f5576c);
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
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
}

.auth-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6);
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
  color: #f5576c;
  font-weight: 600;
  text-decoration: none;
  margin-left: 6px;
  transition: color 0.2s;
}

.auth-link:hover {
  color: #d03c55;
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
</style>