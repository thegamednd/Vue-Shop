<template>
  <div class="register">
    <div class="register-container">
      <div class="register-card">
        <h1>⚔️ Join the Guild ⚔️</h1>
        <p class="subtitle">Register your adventurer's credentials</p>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input 
                id="firstName"
                v-model="form.firstName" 
                type="text" 
                required
                :class="{ error: errors.firstName }"
              />
              <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
            </div>
            
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input 
                id="lastName"
                v-model="form.lastName" 
                type="text" 
                required
                :class="{ error: errors.lastName }"
              />
              <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
            </div>
          </div>
          
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
            <div class="password-requirements">
              <small>Must be at least 8 characters long</small>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword"
              v-model="form.confirmPassword" 
              type="password" 
              required
              :class="{ error: errors.confirmPassword }"
            />
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                v-model="form.agreeToTerms" 
                type="checkbox" 
                required
                :class="{ error: errors.agreeToTerms }"
              />
              I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="terms-link">Privacy Policy</a>
            </label>
            <span v-if="errors.agreeToTerms" class="error-message">{{ errors.agreeToTerms }}</span>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="form.subscribeToNewsletter" type="checkbox" />
              Subscribe to our newsletter for updates and special offers
            </label>
          </div>
          
          <button 
            type="submit" 
            class="register-btn"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Creating Account...</span>
            <span v-else>Create Account</span>
          </button>
          
          <div v-if="generalError" class="error-message general-error">
            {{ generalError }}
          </div>
        </form>
        
        <div class="divider">
          <span>or</span>
        </div>
        
        <div class="social-register">
          <button @click="registerWithGoogle" class="social-btn google-btn">
            <span class="social-icon">G</span>
            Sign up with Google
          </button>
        </div>
        
        <div class="login-prompt">
          <p>Already have an account? 
            <router-link to="/login" class="login-link">Log in</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
        subscribeToNewsletter: false
      },
      errors: {},
      generalError: '',
      isLoading: false
    }
  },
  methods: {
    async handleRegister() {
      this.clearErrors()
      
      if (!this.validateForm()) {
        return
      }
      
      this.isLoading = true
      
      try {
        // TODO: Implement actual registration logic
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
        
        // Simulate success
        alert('Account created successfully! Please check your email to verify your account.')
        this.$router.push('/login')
      } catch (error) {
        this.generalError = 'Registration failed. Please try again.'
      } finally {
        this.isLoading = false
      }
    },
    
    validateForm() {
      let isValid = true
      
      if (!this.form.firstName.trim()) {
        this.errors.firstName = 'First name is required'
        isValid = false
      }
      
      if (!this.form.lastName.trim()) {
        this.errors.lastName = 'Last name is required'
        isValid = false
      }
      
      if (!this.form.email) {
        this.errors.email = 'Email is required'
        isValid = false
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Please enter a valid email'
        isValid = false
      }
      
      if (!this.form.password) {
        this.errors.password = 'Password is required'
        isValid = false
      } else if (this.form.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters long'
        isValid = false
      }
      
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your password'
        isValid = false
      } else if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match'
        isValid = false
      }
      
      if (!this.form.agreeToTerms) {
        this.errors.agreeToTerms = 'You must agree to the terms and conditions'
        isValid = false
      }
      
      return isValid
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    clearErrors() {
      this.errors = {}
      this.generalError = ''
    },
    
    async registerWithGoogle() {
      // TODO: Implement Google registration
      alert('Google registration not implemented yet')
    }
  }
}
</script>

<style scoped>
.register {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.register-container {
  width: 100%;
  max-width: 500px;
}

.register-card {
  background: linear-gradient(135deg, var(--color-iron) 0%, var(--color-medium-wood) 100%);
  padding: 3rem;
  border-radius: 8px;
  border: 2px solid var(--color-gold-dark);
  box-shadow: 
    0 12px 35px var(--color-shadow),
    inset 0 1px 0 rgba(201,168,118,0.2),
    inset 0 -1px 0 rgba(0,0,0,0.5);
}

.register-card h1 {
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

.register-form {
  margin-bottom: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.form-group input[type="text"],
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

.password-requirements {
  margin-top: 0.25rem;
}

.password-requirements small {
  color: var(--color-parchment);
  font-size: 0.875rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
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

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
  line-height: 1.4;
  color: var(--color-parchment);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.terms-link {
  color: #3498db;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.register-btn {
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

.register-btn:hover:not(:disabled) {
  background: #229954;
}

.register-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
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
  background: #e9ecef;
}

.divider span {
  background: white;
  padding: 0 1rem;
  color: #7f8c8d;
}

.social-register {
  margin-bottom: 2rem;
}

.social-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.social-btn:hover {
  border-color: #3498db;
  background: #f8f9fa;
}

.social-icon {
  font-weight: bold;
  font-size: 1.2rem;
}

.google-btn .social-icon {
  color: #db4437;
}

.login-prompt {
  text-align: center;
  color: #7f8c8d;
}

.login-link {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
}

.login-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register {
    padding: 1rem;
  }
  
  .register-card {
    padding: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>