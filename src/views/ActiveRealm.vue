<template>
  <div class="active-realm">
    <div class="page-header">
      <nav class="breadcrumb">
        <router-link to="/account" class="breadcrumb-link">Account</router-link>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-current">Active Realm</span>
      </nav>
      <h1>{{ realm.name }} Management</h1>
      <p class="realm-subtitle">{{ realm.description }}</p>
    </div>

    <div class="realm-content">
      <!-- Realm Overview Cards -->
      <div class="realm-overview-cards">
        <div class="overview-card">
          <div class="card-icon">📅</div>
          <div class="card-content">
            <h3>Realm Date</h3>
            <p>{{ formatRealmDate(realm.date) }}</p>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon">👥</div>
          <div class="card-content">
            <h3>Active Players</h3>
            <p>{{ activePlayers.length }} / {{ realm.maxPlayers }} players</p>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon">⭐</div>
          <div class="card-content">
            <h3>Realm Status</h3>
            <p class="status-active">{{ realm.status }}</p>
          </div>
        </div>
      </div>

      <!-- Player Management Section -->
      <div class="player-management">
        <div class="section-header">
          <h2>Player Management</h2>
          <div class="section-actions">
            <button @click="invitePlayer" class="invite-btn">
              <span class="btn-icon">📧</span>
              Invite Player
            </button>
            <button @click="refreshPlayers" class="refresh-btn">
              <span class="btn-icon">🔄</span>
              Refresh
            </button>
          </div>
        </div>

        <!-- Player List Widget -->
        <div class="player-list-widget">
          <div class="widget-header">
            <h3>Active Players</h3>
            <div class="player-count">{{ activePlayers.length }} players online</div>
          </div>
          
          <div class="player-list">
            <div 
              v-for="player in activePlayers" 
              :key="player.id" 
              class="player-item"
              :class="{ 'is-dm': player.role === 'DM' }"
            >
              <div class="player-avatar">
                <div class="avatar-image">{{ player.avatar }}</div>
                <div class="status-indicator" :class="player.status"></div>
              </div>
              
              <div class="player-info">
                <div class="player-name">
                  {{ player.name }}
                  <span v-if="player.role === 'DM'" class="dm-badge">DM</span>
                </div>
                <div class="player-details">
                  <span class="current-character">{{ player.activeCharacter || 'No character selected' }}</span>
                </div>
              </div>

              <div class="player-actions">
                <div class="character-selector">
                  <label>Active Character:</label>
                  <select 
                    v-model="player.activeCharacter" 
                    @change="updatePlayerCharacter(player.id, $event.target.value)"
                    :disabled="player.role === 'DM'"
                  >
                    <option value="">None</option>
                    <option 
                      v-for="character in player.characters" 
                      :key="character.id" 
                      :value="character.name"
                    >
                      {{ character.name }} ({{ character.class }})
                    </option>
                  </select>
                </div>
                
                <div class="action-buttons">
                  <button 
                    @click="viewCharacterSheet(player)" 
                    class="action-btn view-btn"
                    :disabled="!player.activeCharacter"
                  >
                    📋 View Sheet
                  </button>
                  <button 
                    v-if="player.role !== 'DM'" 
                    @click="removePlayer(player.id)" 
                    class="action-btn remove-btn"
                  >
                    🚫 Remove
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="activePlayers.length === 0" class="empty-player-list">
              <div class="empty-icon">👥</div>
              <h3>No Active Players</h3>
              <p>Invite players to join your realm and start your adventure!</p>
              <button @click="invitePlayer" class="invite-btn-large">Invite First Player</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <div class="section-header">
          <h2>Quick Actions</h2>
        </div>
        
        <div class="actions-grid">
          <button @click="manageCharacters" class="quick-action-btn">
            <span class="action-icon">⚔️</span>
            <span class="action-title">Manage Characters</span>
            <span class="action-desc">Create and edit character sheets</span>
          </button>
          
          <button @click="realmSettings" class="quick-action-btn">
            <span class="action-icon">⚙️</span>
            <span class="action-title">Realm Settings</span>
            <span class="action-desc">Configure realm rules and permissions</span>
          </button>
          
          <button @click="sessionHistory" class="quick-action-btn">
            <span class="action-icon">📚</span>
            <span class="action-title">Session History</span>
            <span class="action-desc">View past game sessions and notes</span>
          </button>
          
          <button @click="campaignTools" class="quick-action-btn">
            <span class="action-icon">🗺️</span>
            <span class="action-title">Campaign Tools</span>
            <span class="action-desc">Maps, NPCs, and story elements</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'ActiveRealm',
  setup() {
    const realm = reactive({
      name: "The Mystical Kingdoms",
      description: "A realm of magic, adventure, and endless possibilities where heroes forge their destiny.",
      date: {
        day: 15,
        month: "Frostfall", 
        year: 1247,
        season: "Winter"
      },
      status: "Active",
      maxPlayers: 6
    })

    const activePlayers = ref([
      {
        id: 1,
        name: "Sarah Chen",
        avatar: "🧙‍♀️",
        role: "DM",
        status: "online",
        activeCharacter: "Dungeon Master",
        characters: []
      },
      {
        id: 2,
        name: "Marcus Rodriguez",
        avatar: "🛡️",
        role: "Player",
        status: "online",
        activeCharacter: "Sir Gareth",
        characters: [
          { id: 1, name: "Sir Gareth", class: "Paladin" },
          { id: 2, name: "Sneaky Pete", class: "Rogue" }
        ]
      },
      {
        id: 3,
        name: "Emma Thompson",
        avatar: "🏹",
        role: "Player", 
        status: "away",
        activeCharacter: "Lyralei",
        characters: [
          { id: 3, name: "Lyralei", class: "Ranger" },
          { id: 4, name: "Mystique", class: "Sorcerer" }
        ]
      },
      {
        id: 4,
        name: "David Kim",
        avatar: "🎭",
        role: "Player",
        status: "online",
        activeCharacter: "",
        characters: [
          { id: 5, name: "Barto the Bold", class: "Bard" }
        ]
      }
    ])

    const methods = {
      formatRealmDate(date) {
        return `${date.day} ${date.month} ${date.year} (${date.season})`
      },
      
      updatePlayerCharacter(playerId, characterName) {
        const player = activePlayers.value.find(p => p.id === playerId)
        if (player) {
          player.activeCharacter = characterName
          // TODO: Save to API
          console.log(`Updated ${player.name}'s active character to ${characterName}`)
        }
      },
      
      viewCharacterSheet(player) {
        // TODO: Navigate to character sheet view
        alert(`Viewing character sheet for ${player.activeCharacter}`)
      },
      
      removePlayer(playerId) {
        const player = activePlayers.value.find(p => p.id === playerId)
        if (player && confirm(`Remove ${player.name} from the realm?`)) {
          activePlayers.value = activePlayers.value.filter(p => p.id !== playerId)
          // TODO: API call to remove player
        }
      },
      
      invitePlayer() {
        // TODO: Show invite player modal
        alert('Invite player functionality coming soon!')
      },
      
      refreshPlayers() {
        // TODO: Refresh player list from API
        alert('Player list refreshed!')
      },
      
      manageCharacters() {
        // TODO: Navigate to character management
        alert('Character management coming soon!')
      },
      
      realmSettings() {
        // TODO: Navigate to realm settings
        alert('Realm settings coming soon!')
      },
      
      sessionHistory() {
        // TODO: Navigate to session history
        alert('Session history coming soon!')
      },
      
      campaignTools() {
        // TODO: Navigate to campaign tools
        alert('Campaign tools coming soon!')
      }
    }

    return {
      realm,
      activePlayers,
      ...methods
    }
  }
}
</script>

<style scoped>
.active-realm {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  margin-bottom: 2rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.breadcrumb-link {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb-link:hover {
  color: #764ba2;
}

.breadcrumb-separator {
  color: #6c757d;
}

.breadcrumb-current {
  color: #495057;
  font-weight: 500;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.realm-subtitle {
  color: #7f8c8d;
  font-size: 1.2rem;
  margin: 0;
}

.realm-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Overview Cards */
.realm-overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.overview-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.overview-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
}

.card-icon {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content h3 {
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.card-content p {
  color: #495057;
  margin: 0;
  font-weight: 600;
}

.status-active {
  color: #28a745 !important;
}

/* Player Management Section */
.player-management {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.8rem;
}

.section-actions {
  display: flex;
  gap: 0.75rem;
}

.invite-btn,
.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.invite-btn {
  background: #28a745;
  color: white;
}

.invite-btn:hover {
  background: #218838;
  transform: translateY(-1px);
}

.refresh-btn {
  background: #6c757d;
  color: white;
}

.refresh-btn:hover {
  background: #545b62;
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 1rem;
}

/* Player List Widget */
.player-list-widget {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
}

.widget-header {
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.widget-header h3 {
  margin: 0;
  color: #2c3e50;
}

.player-count {
  color: #6c757d;
  font-size: 0.9rem;
}

.player-list {
  max-height: 600px;
  overflow-y: auto;
}

.player-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  align-items: center;
  transition: background-color 0.3s;
}

.player-item:last-child {
  border-bottom: none;
}

.player-item:hover {
  background: #f8f9fa;
}

.player-item.is-dm {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.player-avatar {
  position: relative;
  display: flex;
  align-items: center;
}

.avatar-image {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #e9ecef;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.online {
  background: #28a745;
}

.status-indicator.away {
  background: #ffc107;
}

.status-indicator.offline {
  background: #6c757d;
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.player-name {
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dm-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.current-character {
  color: #6c757d;
  font-size: 0.9rem;
}

.player-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 250px;
}

.character-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.character-selector label {
  font-size: 0.85rem;
  color: #495057;
  font-weight: 600;
}

.character-selector select {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
}

.view-btn {
  background: #17a2b8;
  color: white;
}

.view-btn:hover:not(:disabled) {
  background: #138496;
}

.view-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.remove-btn {
  background: #dc3545;
  color: white;
}

.remove-btn:hover {
  background: #c82333;
}

.empty-player-list {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-player-list h3 {
  margin-bottom: 1rem;
}

.invite-btn-large {
  background: #28a745;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

/* Quick Actions */
.quick-actions {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.quick-action-btn {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.quick-action-btn:hover {
  border-color: #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 2.5rem;
}

.action-title {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

.action-desc {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* Responsive Design */
@media (max-width: 768px) {
  .active-realm {
    padding: 0 0.5rem;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .realm-overview-cards {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .player-item {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .player-actions {
    min-width: auto;
    width: 100%;
  }
  
  .action-buttons {
    justify-content: stretch;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>