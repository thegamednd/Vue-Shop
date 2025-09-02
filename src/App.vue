<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <h1>⚔️ The Merchant's Guild ⚔️</h1>
        </router-link>
      </div>
      <div class="nav-menu">
        <router-link to="/" class="nav-link">Tavern</router-link>
        <router-link to="/products" class="nav-link">Wares</router-link>
        <router-link to="/cart" class="nav-link">Inventory</router-link>
        
        <!-- Show different options based on auth state -->
        <template v-if="!authStore.isLoading">
          <router-link v-if="authStore.isAuthenticated" to="/account" class="nav-link">
            Guild Profile
          </router-link>
          <button v-if="authStore.isAuthenticated" @click="handleSignOut" class="nav-link sign-out-btn">
            Leave Guild
          </button>
          <router-link v-else to="/login" class="nav-link login-btn">
            Enter Guild
          </router-link>
        </template>
        
        <!-- Show loading state -->
        <span v-else class="nav-link">...</span>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <p>⚜️ &copy; 2024 The Merchant's Guild - RealmForge ⚜️</p>
    </footer>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    // Check authentication state on app mount
    onMounted(async () => {
      await authStore.checkAuthState()
    })
    
    const handleSignOut = async () => {
      const result = await authStore.signOut()
      if (result.success) {
        router.push('/')
      }
    }
    
    return {
      authStore,
      handleSignOut
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:wght@400;600&display=swap');

:root {
  --color-dark-wood: #1a0f0a;
  --color-medium-wood: #2d1b13;
  --color-light-wood: #3e2b1f;
  --color-gold: #c9a876;
  --color-gold-dark: #9d7c47;
  --color-burgundy: #5c1a1a;
  --color-deep-red: #3d0f0f;
  --color-parchment: #d4c4a8;
  --color-parchment-dark: #b8a888;
  --color-text-dark: #1a0f0a;
  --color-text-light: #d4c4a8;
  --color-stone: #4a453f;
  --color-iron: #36312b;
  --color-shadow: rgba(0, 0, 0, 0.7);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Crimson Text', serif;
  line-height: 1.6;
  color: var(--color-text-light);
  background: linear-gradient(180deg, var(--color-dark-wood) 0%, var(--color-medium-wood) 20%, var(--color-light-wood) 100%);
  background-attachment: fixed;
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(0,0,0,.03) 10px,
      rgba(0,0,0,.03) 20px
    );
  pointer-events: none;
  z-index: 1;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: linear-gradient(180deg, var(--color-dark-wood) 0%, var(--color-medium-wood) 50%, var(--color-iron) 100%);
  color: var(--color-gold);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 
    0 6px 12px var(--color-shadow),
    inset 0 -2px 4px rgba(0,0,0,0.5),
    inset 0 1px 0 rgba(201, 168, 118, 0.1);
  border-bottom: 2px solid var(--color-gold-dark);
  border-top: 1px solid var(--color-stone);
  position: relative;
  z-index: 10;
}

.navbar::before,
.navbar::after {
  content: '❦';
  position: absolute;
  font-size: 2rem;
  color: var(--color-gold-dark);
  top: 50%;
  transform: translateY(-50%);
}

.navbar::before {
  left: 1rem;
}

.navbar::after {
  right: 1rem;
}

.brand-link {
  color: var(--color-gold);
  text-decoration: none;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  transition: all 0.3s;
}

.brand-link:hover {
  color: var(--color-text-light);
  text-shadow: 
    2px 2px 4px rgba(0,0,0,0.8),
    0 0 20px rgba(255,215,0,0.5);
}

.brand-link h1 {
  font-family: 'Cinzel', serif;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 2px;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--color-parchment);
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  transition: all 0.3s;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  background: rgba(0,0,0,0.2);
  border: 1px solid transparent;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255,215,0,0.1) 50%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 4px;
}

.nav-link:hover::before,
.nav-link.router-link-active::before {
  opacity: 1;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-gold);
  background: rgba(0,0,0,0.4);
  border-color: var(--color-gold-dark);
  text-shadow: 0 0 10px rgba(255,215,0,0.5);
}

.sign-out-btn {
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
}

.login-btn {
  background: linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 50%, var(--color-gold-dark) 100%) !important;
  color: var(--color-dark-wood) !important;
  border-radius: 6px;
  padding: 0.6rem 1.5rem !important;
  border: 2px solid var(--color-gold-dark) !important;
  font-weight: 700 !important;
  box-shadow: 
    0 2px 4px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.3);
}

.login-btn:hover {
  background: linear-gradient(135deg, var(--color-gold) 0%, #fff3b8 50%, var(--color-gold) 100%) !important;
  box-shadow: 
    0 4px 8px rgba(0,0,0,0.4),
    0 0 20px rgba(255,215,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.5) !important;
  transform: translateY(-1px);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 2;
}

.footer {
  background: linear-gradient(180deg, var(--color-iron) 0%, var(--color-dark-wood) 100%);
  color: var(--color-gold);
  text-align: center;
  padding: 1.5rem;
  margin-top: auto;
  border-top: 2px solid var(--color-gold-dark);
  border-bottom: 1px solid var(--color-stone);
  font-family: 'Cinzel', serif;
  font-size: 0.9rem;
  letter-spacing: 1px;
  position: relative;
  z-index: 10;
  box-shadow: 
    0 -6px 12px var(--color-shadow),
    inset 0 1px 0 rgba(201, 168, 118, 0.1);
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    gap: 1rem;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>