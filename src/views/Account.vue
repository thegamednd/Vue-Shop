<template>
  <div class="account">
    <div class="page-header">
      <h1>My Account</h1>
    </div>

    <div v-if="!authStore.isAuthenticated" class="login-prompt">
      <div class="login-card">
        <h2>Please Log In</h2>
        <p>You need to be logged in to view your account information.</p>
        <div class="auth-buttons">
          <router-link to="/login" class="login-btn">Log In</router-link>
          <router-link to="/register" class="register-btn">Create Account</router-link>
        </div>
      </div>
    </div>

    <div v-else-if="authStore.isAuthenticated" class="account-content">
      <div class="account-sidebar">
        <div class="user-info">
          <div class="avatar">👤</div>
          <h3>{{ authStore.name || authStore.username }}</h3>
          <p>{{ authStore.email }}</p>
        </div>
        
        <nav class="account-nav">
          <button 
            @click="activeSection = 'profile'"
            :class="{ active: activeSection === 'profile' }"
          >
            Profile
          </button>
          <button 
            @click="activeSection = 'purchases'"
            :class="{ active: activeSection === 'purchases' }"
          >
            Purchase History
          </button>
          <button 
            @click="activeSection = 'library'"
            :class="{ active: activeSection === 'library' }"
          >
            My Library
          </button>
          <button 
            @click="activeSection = 'active-realm'"
            :class="{ active: activeSection === 'active-realm' }"
          >
            Active Realm
          </button>
          <button 
            @click="activeSection = 'settings'"
            :class="{ active: activeSection === 'settings' }"
          >
            Settings
          </button>
        </nav>
      </div>

      <div class="account-main">
        <!-- Profile Section -->
        <div v-if="activeSection === 'profile'" class="section">
          <h2>Profile Information</h2>
          <div class="profile-form">
            <div class="form-group">
              <label>Name</label>
              <input v-model="user.name" type="text" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="user.email" type="email" />
            </div>
            <div class="form-group">
              <label>Username</label>
              <input v-model="user.username" type="text" />
            </div>
            <button @click="updateProfile" class="save-btn">Save Changes</button>
          </div>
        </div>

        <!-- Purchase History Section -->
        <div v-if="activeSection === 'purchases'" class="section">
          <h2>Purchase History</h2>
          <div class="purchases-list">
            <div v-for="purchase in purchases" :key="purchase.id" class="purchase-item">
              <div class="purchase-info">
                <h4>{{ purchase.orderNumber }}</h4>
                <p class="date">{{ purchase.date }}</p>
                <p class="items">{{ purchase.items.length }} items</p>
              </div>
              <div class="purchase-total">
                ${{ purchase.total.toFixed(2) }}
              </div>
              <button @click="viewPurchase(purchase.id)" class="view-btn">View</button>
            </div>
          </div>
        </div>

        <!-- Library Section -->
        <div v-if="activeSection === 'library'" class="section">
          <h2>My Library</h2>
          <div class="library-grid">
            <div v-for="item in libraryItems" :key="item.id" class="library-item">
              <div class="item-image">{{ item.emoji }}</div>
              <h4>{{ item.name }}</h4>
              <p class="item-type">{{ item.type }}</p>
              <button @click="downloadItem(item.id)" class="download-btn">Download</button>
            </div>
          </div>
        </div>

        <!-- Active Realm Section -->
        <div v-if="activeSection === 'active-realm'" class="section">
          <h2>Active Realm</h2>
          <div class="realm-overview">
            <div v-if="activeRealm" class="realm-card">
              <div class="realm-header">
                <div class="realm-icon">🏰</div>
                <div class="realm-info">
                  <h3>{{ activeRealm.name }}</h3>
                  <p class="realm-description">{{ activeRealm.description }}</p>
                </div>
              </div>
              
              <div class="realm-details">
                <div class="realm-date">
                  <span class="label">Realm Date:</span>
                  <span class="value">{{ formatRealmDate(activeRealm.date) }}</span>
                </div>
                <div class="active-players">
                  <span class="label">Active Players:</span>
                  <span class="value">{{ activeRealm.activePlayers }} players</span>
                </div>
              </div>
              
              <div class="realm-actions">
                <router-link to="/account/active-realm" class="manage-realm-btn">
                  Manage Realm & Players
                </router-link>
              </div>
            </div>
            
            <div v-else class="no-realm">
              <div class="no-realm-icon">🌟</div>
              <h3>No Active Realm</h3>
              <p>You don't have an active realm yet. Create or join a realm to start your adventure!</p>
              <button @click="createRealm" class="create-realm-btn">Create New Realm</button>
            </div>
          </div>
        </div>

        <!-- Settings Section -->
        <div v-if="activeSection === 'settings'" class="section">
          <h2>Account Settings</h2>
          <div class="settings-form">
            <div class="form-group">
              <label>
                <input v-model="settings.emailNotifications" type="checkbox" />
                Email notifications
              </label>
            </div>
            <div class="form-group">
              <label>
                <input v-model="settings.marketingEmails" type="checkbox" />
                Marketing emails
              </label>
            </div>
            <div class="form-group">
              <label>Password</label>
              <button @click="changePassword" class="change-password-btn">Change Password</button>
            </div>
            <div class="danger-zone">
              <h3>Danger Zone</h3>
              <button @click="deleteAccount" class="delete-account-btn">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Account',
  setup() {
    const authStore = useAuthStore()
    const activeSection = ref('profile')
    
    const user = reactive({
      name: computed(() => authStore.name || ''),
      email: computed(() => authStore.email || ''),
      username: computed(() => authStore.username || '')
    })
    
    const data = reactive({
        activeRealm: {
          name: "The Mystical Kingdoms",
          description: "A realm of magic, adventure, and endless possibilities where heroes forge their destiny.",
          date: {
            day: 15,
            month: "Frostfall", 
            year: 1247,
            season: "Winter"
          },
          activePlayers: 4
        },
        settings: {
          emailNotifications: true,
          marketingEmails: false
        },
        purchases: [
        {
          id: 1,
          orderNumber: 'ORD-2024-001',
          date: '2024-01-15',
          items: ['Starter Content Pack'],
          total: 9.99
        },
        {
          id: 2,
          orderNumber: 'ORD-2024-002',
          date: '2024-01-20',
          items: ['Epic Character Bundle', 'Legendary Items Pack'],
          total: 34.98
        }
        ],
        libraryItems: [
        {
          id: 1,
          name: 'Starter Content Pack',
          type: 'Content Pack',
          emoji: '📦'
        },
        {
          id: 2,
          name: 'Epic Character Bundle',
          type: 'Character Pack',
          emoji: '⚔️'
        }
        ]
      }
    )
    
    const methods = {
      updateProfile() {
        // TODO: Implement profile update with API
        alert('Profile updated successfully!')
      },
      viewPurchase(purchaseId) {
        // TODO: Implement purchase detail view
        alert(`Viewing purchase ${purchaseId}`)
      },
      downloadItem(itemId) {
        // TODO: Implement item download
        alert(`Downloading item ${itemId}`)
      },
      async changePassword() {
        // TODO: Implement password change modal
        alert('Password change not implemented yet')
      },
      async deleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
          // TODO: Implement account deletion with API
          alert('Account deletion not implemented yet')
        }
      },
      formatRealmDate(date) {
        return `${date.day} ${date.month} ${date.year} (${date.season})`
      },
      createRealm() {
        // TODO: Implement realm creation flow
        alert('Realm creation not implemented yet')
      }
    }
    
    return {
      authStore,
      activeSection,
      user,
      ...data,
      ...methods
    }
  }
}
</script>

<style scoped>
.account {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
}

.login-prompt {
  display: flex;
  justify-content: center;
}

.login-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 400px;
}

.login-card h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.login-card p {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.login-btn,
.register-btn {
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  transition: all 0.3s;
}

.login-btn {
  background: #3498db;
  color: white;
}

.login-btn:hover {
  background: #2980b9;
}

.register-btn {
  background: transparent;
  color: #3498db;
  border: 2px solid #3498db;
}

.register-btn:hover {
  background: #3498db;
  color: white;
}

.account-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.account-sidebar {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.user-info {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.avatar {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.user-info h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.user-info p {
  color: #7f8c8d;
}

.account-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.account-nav button {
  background: transparent;
  border: none;
  padding: 1rem;
  text-align: left;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  color: #7f8c8d;
  transition: all 0.3s;
}

.account-nav button:hover,
.account-nav button.active {
  background: #3498db;
  color: white;
}

.account-main {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.section h2 {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.profile-form,
.settings-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="email"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group input[type="checkbox"] {
  margin-right: 0.5rem;
}

.save-btn,
.change-password-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.save-btn:hover,
.change-password-btn:hover {
  background: #2980b9;
}

.purchases-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.purchase-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.purchase-info h4 {
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.purchase-info .date {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.purchase-total {
  font-weight: bold;
  color: #27ae60;
  font-size: 1.1rem;
}

.view-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.library-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.library-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.library-item .item-image {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.library-item h4 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.library-item .item-type {
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.download-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.danger-zone {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e74c3c;
}

.danger-zone h3 {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.delete-account-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

/* Active Realm Styles */
.realm-overview {
  max-width: 600px;
}

.realm-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.realm-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.realm-icon {
  font-size: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.realm-info h3 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.realm-description {
  color: #7f8c8d;
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0;
}

.realm-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.realm-date,
.active-players {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.realm-details .label {
  font-weight: bold;
  color: #495057;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.realm-details .value {
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
}

.realm-actions {
  display: flex;
  justify-content: center;
}

.manage-realm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.manage-realm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.no-realm {
  text-align: center;
  padding: 3rem 2rem;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
}

.no-realm-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-realm h3 {
  color: #6c757d;
  margin-bottom: 1rem;
}

.no-realm p {
  color: #6c757d;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.create-realm-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-realm-btn:hover {
  background: #218838;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .account-content {
    grid-template-columns: 1fr;
  }
  
  .account-sidebar {
    position: static;
  }
  
  .account-nav {
    flex-direction: row;
    overflow-x: auto;
  }
  
  .account-nav button {
    white-space: nowrap;
  }
  
  .realm-details {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .realm-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .realm-card {
    padding: 1.5rem;
  }
}
</style>