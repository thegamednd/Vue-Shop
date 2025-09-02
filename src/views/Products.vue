<template>
  <div class="products">
    <div class="page-header">
      <h1 class="page-title">⚔️ Merchant's Wares ⚔️</h1>
      <p class="page-subtitle">Discover legendary artifacts and mystical treasures</p>
    </div>

    <div class="filters">
      <div class="filter-group">
        <label>Category:</label>
        <select v-model="selectedCategory" @change="filterProducts" class="filter-select">
          <option value="all">All Categories</option>
          <option value="content">Quest Scrolls</option>
          <option value="characters">Heroes & Companions</option>
          <option value="items">Weapons & Artifacts</option>
          <option value="subscriptions">Guild Memberships</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Price Range:</label>
        <select v-model="selectedPriceRange" @change="filterProducts" class="filter-select">
          <option value="all">All Prices</option>
          <option value="free">Free</option>
          <option value="under10">Under 100 Gold</option>
          <option value="10to25">100 - 250 Gold</option>
          <option value="over25">Over 250 Gold</option>
        </select>
      </div>
    </div>

    <div class="products-grid">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id" 
        class="product-card"
        @click="goToProduct(product.id)"
      >
        <div class="rarity-badge" :data-rarity="product.rarity">{{ product.rarity }}</div>
        <div class="product-image" :data-rarity="product.rarity">{{ product.emoji }}</div>
        <h3 class="product-title">{{ product.name }}</h3>
        <p class="product-category">{{ getCategoryName(product.category) }}</p>
        <p class="product-price">
          <span v-if="product.goldPrice === 0" class="free-badge">FREE</span>
          <template v-else>
            <span class="gold-icon">🪙</span>
            <span class="gold-amount">{{ product.goldPrice }}</span>
            <span class="gold-label">Gold</span>
          </template>
        </p>
        <p class="product-description">{{ product.description }}</p>
        <button class="add-to-inventory-btn" :data-rarity="product.rarity" @click.stop="addToCart(product)">
          <span class="button-icon">🎒</span>
          Add to Inventory
        </button>
      </div>
    </div>

    <div v-if="filteredProducts.length === 0" class="no-products">
      <p>No products found matching your criteria.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Products',
  data() {
    return {
      selectedCategory: 'all',
      selectedPriceRange: 'all',
      products: [
        {
          id: 1,
          name: 'Apprentice\'s Scroll Bundle',
          category: 'content',
          price: 9.99,
          goldPrice: 99,
          emoji: '🎲',
          rarity: 'common',
          description: 'Essential knowledge for beginning adventurers'
        },
        {
          id: 2,
          name: 'Champion\'s Retinue',
          category: 'characters',
          price: 19.99,
          goldPrice: 199,
          emoji: '⚔️',
          rarity: 'rare',
          description: 'Elite warriors and mystical companions'
        },
        {
          id: 3,
          name: 'Arcane Arsenal',
          category: 'items',
          price: 14.99,
          goldPrice: 149,
          emoji: '🗡️',
          rarity: 'rare',
          description: 'Enchanted weapons and protective talismans'
        },
        {
          id: 4,
          name: 'Guild Master\'s Seal',
          category: 'subscriptions',
          price: 9.99,
          goldPrice: 99,
          emoji: '⚜️',
          rarity: 'epic',
          description: 'Monthly access to the inner sanctum'
        },
        {
          id: 5,
          name: 'Tome of the Ancient Wyrm',
          category: 'content',
          price: 24.99,
          goldPrice: 249,
          emoji: '🐉',
          rarity: 'legendary',
          description: 'Chronicle of the great dragon wars'
        },
        {
          id: 6,
          name: 'Novice\'s Grimoire',
          category: 'content',
          price: 0.00,
          goldPrice: 0,
          emoji: '📚',
          rarity: 'common',
          description: 'Basic spells and cantrips for new mages'
        }
      ],
      filteredProducts: []
    }
  },
  mounted() {
    this.filteredProducts = this.products
  },
  methods: {
    filterProducts() {
      let filtered = [...this.products]
      
      // Filter by category
      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(product => product.category === this.selectedCategory)
      }
      
      // Filter by price range
      if (this.selectedPriceRange !== 'all') {
        switch (this.selectedPriceRange) {
          case 'free':
            filtered = filtered.filter(product => product.price === 0)
            break
          case 'under10':
            filtered = filtered.filter(product => product.price > 0 && product.price < 10)
            break
          case '10to25':
            filtered = filtered.filter(product => product.price >= 10 && product.price <= 25)
            break
          case 'over25':
            filtered = filtered.filter(product => product.price > 25)
            break
        }
      }
      
      this.filteredProducts = filtered
    },
    goToProduct(productId) {
      this.$router.push(`/product/${productId}`)
    },
    addToCart(product) {
      // TODO: Implement inventory functionality
      alert(`${product.name} has been added to your inventory!`)
    },
    getCategoryName(category) {
      const categoryMap = {
        content: 'Quest Scrolls',
        characters: 'Heroes & Companions',
        items: 'Weapons & Artifacts',
        subscriptions: 'Guild Memberships'
      }
      return categoryMap[category] || category
    }
  }
}
</script>

<style scoped>
.products {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, var(--color-burgundy) 0%, var(--color-dark-wood) 100%);
  padding: 2rem;
  border-radius: 12px;
  border: 3px solid var(--color-gold-dark);
  box-shadow: 0 8px 16px rgba(0,0,0,0.4);
}

.page-title {
  font-family: 'Cinzel', serif;
  font-size: 3rem;
  color: var(--color-gold);
  margin-bottom: 0.5rem;
  text-shadow: 
    3px 3px 6px rgba(0,0,0,0.8),
    0 0 30px rgba(255,215,0,0.3);
  letter-spacing: 2px;
}

.page-subtitle {
  font-family: 'Crimson Text', serif;
  font-size: 1.2rem;
  color: var(--color-parchment);
  font-style: italic;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
}

.filters {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-parchment) 0%, var(--color-parchment-dark) 100%);
  border-radius: 12px;
  border: 2px solid var(--color-medium-wood);
  box-shadow: 
    0 4px 8px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.5);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: var(--color-dark-wood);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.filter-select {
  padding: 0.75rem;
  border: 2px solid var(--color-medium-wood);
  border-radius: 6px;
  font-size: 1rem;
  font-family: 'Crimson Text', serif;
  background: linear-gradient(135deg, #fff 0%, var(--color-parchment) 100%);
  color: var(--color-text-dark);
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-gold-dark);
  box-shadow: 0 0 10px rgba(255,215,0,0.3);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.product-card {
  background: linear-gradient(135deg, var(--color-parchment) 0%, var(--color-parchment-dark) 100%);
  padding: 1.5rem;
  padding-top: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  border: 2px solid var(--color-medium-wood);
}

.product-card[data-rarity="common"] {
  border-color: #8b7355;
}

.product-card[data-rarity="rare"] {
  border-color: #4169e1;
  background: linear-gradient(135deg, #e6f2ff 0%, #cce0ff 100%);
}

.product-card[data-rarity="epic"] {
  border-color: #9932cc;
  background: linear-gradient(135deg, #f0e6ff 0%, #e0ccff 100%);
}

.product-card[data-rarity="legendary"] {
  border-color: var(--color-gold-dark);
  background: linear-gradient(135deg, #fff9e6 0%, #ffecb3 100%);
  box-shadow: 
    0 4px 8px rgba(0,0,0,0.3),
    0 0 20px rgba(255,215,0,0.2);
}

.product-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 
    0 12px 25px rgba(0,0,0,0.4),
    0 0 30px rgba(255,215,0,0.15);
}

.rarity-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 2px solid currentColor;
  background: var(--color-dark-wood);
  color: var(--color-gold);
}

.rarity-badge[data-rarity="common"] {
  background: #8b7355;
  color: white;
  border-color: #6b5a45;
}

.rarity-badge[data-rarity="rare"] {
  background: #4169e1;
  color: white;
  border-color: #3155c1;
}

.rarity-badge[data-rarity="epic"] {
  background: #9932cc;
  color: white;
  border-color: #7a2a9a;
}

.rarity-badge[data-rarity="legendary"] {
  background: linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 100%);
  color: var(--color-dark-wood);
  border-color: var(--color-gold-dark);
}

.product-image {
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 8px rgba(0,0,0,0.3));
}

.product-image[data-rarity="rare"] {
  filter: drop-shadow(0 0 10px rgba(65,105,225,0.5));
}

.product-image[data-rarity="epic"] {
  filter: drop-shadow(0 0 12px rgba(153,50,204,0.5));
}

.product-image[data-rarity="legendary"] {
  filter: drop-shadow(0 0 15px rgba(255,215,0,0.6));
  animation: legendary-glow 2s ease-in-out infinite alternate;
}

@keyframes legendary-glow {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}

.product-title {
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-dark-wood);
  margin-bottom: 0.5rem;
  text-align: center;
}

.product-category {
  color: var(--color-medium-wood);
  font-family: 'Crimson Text', serif;
  font-style: italic;
  margin-bottom: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.product-price {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--color-gold-dark);
}

.free-badge {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-family: 'Cinzel', serif;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 2px solid #27ae60;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.gold-icon {
  font-size: 1.3rem;
  filter: drop-shadow(0 0 2px rgba(255,215,0,0.5));
}

.gold-amount {
  font-family: 'Cinzel', serif;
  font-size: 1.3rem;
  font-weight: 700;
}

.gold-label {
  font-family: 'Cinzel', serif;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-description {
  color: var(--color-text-dark);
  margin-bottom: 1.5rem;
  line-height: 1.4;
  font-family: 'Crimson Text', serif;
  font-style: italic;
  text-align: center;
  font-size: 0.95rem;
}

.add-to-inventory-btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 2px solid;
  position: relative;
  overflow: hidden;
}

.add-to-inventory-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.add-to-inventory-btn:hover::before {
  left: 100%;
}

.add-to-inventory-btn[data-rarity="common"] {
  background: linear-gradient(135deg, #8b7355 0%, #a68660 100%);
  color: white;
  border-color: #6b5a45;
}

.add-to-inventory-btn[data-rarity="rare"] {
  background: linear-gradient(135deg, #4169e1 0%, #5a7ae8 100%);
  color: white;
  border-color: #3155c1;
}

.add-to-inventory-btn[data-rarity="epic"] {
  background: linear-gradient(135deg, #9932cc 0%, #a855d1 100%);
  color: white;
  border-color: #7a2a9a;
}

.add-to-inventory-btn[data-rarity="legendary"] {
  background: linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 100%);
  color: var(--color-dark-wood);
  border-color: var(--color-gold-dark);
  box-shadow: 0 0 20px rgba(255,215,0,0.3);
}

.add-to-inventory-btn:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 12px rgba(0,0,0,0.3),
    0 0 20px rgba(255,215,0,0.2);
}

.button-icon {
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.add-to-inventory-btn:hover .button-icon {
  transform: rotate(20deg);
}

.no-products {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, var(--color-parchment) 0%, var(--color-parchment-dark) 100%);
  border-radius: 12px;
  border: 2px solid var(--color-medium-wood);
  color: var(--color-text-dark);
  font-family: 'Crimson Text', serif;
  font-size: 1.2rem;
  font-style: italic;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    gap: 1rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>