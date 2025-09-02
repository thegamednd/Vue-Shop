<template>
  <div class="login">
    <div class="login-container">
      <div class="login-card">
        <h1>⚔️ Enter the Guild ⚔️</h1>
        <p class="subtitle">Present your credentials, adventurer</p>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email"
              v-model="form.email" 
              type="email" 
              required
              :class="{ error: errors.email }"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              v-model="form.password" 
              type="password" 
              required
              :class="{ error: errors.password }"
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
          
          <div class="form-options">
            <label class="checkbox-label">
              <input v-model="form.rememberMe" type="checkbox" />
              Remember me
            </label>
            <a href="#" class="forgot-password">Forgot password?</a>
          </div>
          
          <button 
            type="submit" 
            class="login-btn"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Logging in...</span>
            <span v-else>Log In</span>
          </button>
          
          <div v-if="generalError" class="error-message general-error">
            {{ generalError }}
          </div>
        </form>
        
        <div class="divider">
          <span>or</span>
        </div>
        
        <div class="social-login">
          <button @click="loginWithGoogle" class="social-btn google-btn">
            <span class="social-icon">G</span>
            Continue with Google
          </button>
        </div>
        
        <div class="signup-prompt">
          <p>Don't have an account? 
            <router-link to="/register" class="signup-link">Sign up</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    const form = reactive({
      email: '',
      password: '',
      rememberMe: false
    })
    const errors = reactive({})
    const generalError = ref('')
    const isLoading = ref(false)
    
    // Check for redirect after login
    const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/account'
    
    const methods = {
      async handleLogin() {
        clearErrors()
        
        if (!validateForm()) {
          return
        }
        
        isLoading.value = true
        
        const result = await authStore.signIn(form.email, form.password)
        
        if (result.success) {
          // Clear the redirect path from session storage
          sessionStorage.removeItem('redirectAfterLogin')
          // Redirect to intended destination or account page
          router.push(redirectPath)
        } else {
          generalError.value = result.error || 'Invalid email or password'
        }
        
        isLoading.value = false
      },
    
      validateForm() {
        let isValid = true
        
        if (!form.email) {
          errors.email = 'Email is required'
          isValid = false
        } else if (!isValidEmail(form.email)) {
          errors.email = 'Please enter a valid email'
          isValid = false
        }
        
        if (!form.password) {
          errors.password = 'Password is required'
          isValid = false
        } else if (form.password.length < 6) {
          errors.password = 'Password must be at least 6 characters'
          isValid = false
        }
        
        return isValid
      },
    
      isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
      },
      
      clearErrors() {
        Object.keys(errors).forEach(key => delete errors[key])
        generalError.value = ''
      },
      
      async loginWithGoogle() {
        await authStore.federatedSignIn('Google')
      }
    }
    
    return {
      form,
      errors,
      generalError,
      isLoading,
      ...methods
    }
  }
}
</script>

<style scoped>
.login {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: linear-gradient(135deg, var(--color-iron) 0%, var(--color-medium-wood) 100%);
  padding: 3rem;
  border-radius: 8px;
  border: 2px solid var(--color-gold-dark);
  box-shadow: 
    0 12px 35px var(--color-shadow),
    inset 0 1px 0 rgba(201,168,118,0.2),
    inset 0 -1px 0 rgba(0,0,0,0.5);
}

.login-card h1 {
  text-align: center;
  color: var(--color-gold);
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-family: 'Cinzel', serif;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  letter-spacing: 1px;
}

.subtitle {
  text-align: center;
  color: var(--color-parchment);
  margin-bottom: 2rem;
  font-family: 'Crimson Text', serif;
  font-style: italic;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-gold);
  font-weight: bold;
  font-family: 'Cinzel', serif;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
}

.form-group input[type="email"],
.form-group input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--color-stone);
  border-radius: 4px;
  font-size: 1rem;
  background: var(--color-dark-wood);
  color: var(--color-parchment);
  transition: all 0.3s;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-gold-dark);
  box-shadow: 
    inset 0 2px 4px rgba(0,0,0,0.3),
    0 0 8px rgba(201,168,118,0.3);
}

.form-group input.error {
  border-color: var(--color-burgundy);
  box-shadow: 
    inset 0 2px 4px rgba(0,0,0,0.3),
    0 0 8px rgba(92,26,26,0.4);
}

.error-message {
  color: var(--color-burgundy);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.general-error {
  text-align: center;
  margin-top: 1rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
  color: var(--color-parchment);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
}

.forgot-password {
  color: var(--color-gold-dark);
  text-decoration: none;
  font-size: 0.9rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 100%);
  color: var(--color-dark-wood);
  border: 2px solid var(--color-gold-dark);
  padding: 1rem;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: bold;
  font-family: 'Cinzel', serif;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 
    0 4px 8px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.3);
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-gold) 0%, #fff3b8 100%);
  transform: translateY(-1px);
  box-shadow: 
    0 6px 12px rgba(0,0,0,0.4),
    0 0 15px rgba(201,168,118,0.3),
    inset 0 1px 0 rgba(255,255,255,0.5);
}

.login-btn:disabled {
  background: var(--color-stone);
  color: var(--color-parchment-dark);
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}

.divider {
  text-align: center;
  margin: 2rem 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-gold-dark);
}

.divider span {
  background: linear-gradient(135deg, var(--color-iron) 0%, var(--color-medium-wood) 100%);
  padding: 0 1rem;
  color: var(--color-parchment);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.social-login {
  margin-bottom: 2rem;
}

.social-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid var(--color-stone);
  border-radius: 6px;
  background: linear-gradient(135deg, var(--color-dark-wood) 0%, var(--color-iron) 100%);
  color: var(--color-parchment);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
  box-shadow: inset 0 1px 0 rgba(201,168,118,0.1);
}

.social-btn:hover {
  border-color: var(--color-gold-dark);
  background: linear-gradient(135deg, var(--color-iron) 0%, var(--color-light-wood) 100%);
  box-shadow: 
    0 2px 4px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(201,168,118,0.2);
}

.social-icon {
  font-weight: bold;
  font-size: 1.2rem;
}

.google-btn .social-icon {
  color: #db4437;
}

.signup-prompt {
  text-align: center;
  color: var(--color-parchment);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.signup-link {
  color: var(--color-gold-dark);
  text-decoration: none;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.signup-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem;
  }
  
  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>