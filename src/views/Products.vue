<template>
  <div class="products">
    <div class="page-header">
      <h1 class="page-title">⚔️ Merchant's Wares ⚔️</h1>
      <p class="page-subtitle">Discover legendary artifacts and mystical treasures</p>
    </div>

    <div class="filters">
      <div class="filter-group">
        <label>Category:</label>
        <select v-model="selectedCategory" @change="onCategoryChange" class="filter-select">
          <option value="all">All Categories</option>
          <option v-for="category in availableCategories" 
                  :key="category" 
                  :value="category"
                  v-show="category !== 'all'">
            {{ getCategoryName(category) }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Price Range:</label>
        <select v-model="selectedPriceRange" @change="onPriceRangeChange" class="filter-select">
          <option value="all">All Prices</option>
          <option value="free">Free</option>
          <option value="under100">Under 100 Gold</option>
          <option value="100to250">100 - 250 Gold</option>
          <option value="over250">Over 250 Gold</option>
        </select>
      </div>

      <div class="filter-group">
        <button 
          @click="refreshProducts" 
          class="refresh-btn"
          :disabled="productsStore.isLoading"
        >
          🔄 Refresh
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="productsStore.isLoading" class="loading">
      <div class="loading-spinner">⚡</div>
      <p>Loading magical wares...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="productsStore.error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Trouble accessing the merchant's inventory!</h3>
      <p>{{ productsStore.error }}</p>
      <button @click="refreshProducts" class="retry-btn">Try Again</button>
    </div>

    <!-- Products Grid -->
    <div v-else class="products-grid">
      <div 
        v-for="product in displayProducts" 
        :key="product.ID || product.id" 
        class="product-card"
        :data-rarity="getProductRarity(product)"
        @click="goToProduct(product.ID || product.id)"
      >
        <div class="rarity-badge" :data-rarity="getProductRarity(product)">
          {{ getProductRarity(product) }}
        </div>
        <div class="product-image" :data-rarity="getProductRarity(product)">
          {{ getProductEmoji(product) }}
        </div>
        <h3 class="product-title">{{ product.Name || product.name }}</h3>
        <p class="product-category">{{ getCategoryName(product.Category || product.category) }}</p>
        <p class="product-price">
          <span v-if="(product.Price || product.price || 0) === 0" class="free-badge">FREE</span>
          <template v-else>
            <span class="gold-icon">🪙</span>
            <span class="gold-amount">{{ formatPrice(product.Price || product.price) }}</span>
            <span class="gold-label">Gold</span>
          </template>
        </p>
        <p class="product-description">{{ product.Description || product.description || 'A mysterious item from the merchant\'s collection' }}</p>
        <button class="add-to-inventory-btn" :data-rarity="getProductRarity(product)" @click.stop="addToCart(product)">
          <span class="button-icon">🎒</span>
          Add to Inventory
        </button>
      </div>
    </div>

    <!-- No Products State -->
    <div v-if="!productsStore.isLoading && !productsStore.error && displayProducts.length === 0" class="no-products">
      <p>No products found matching your criteria.</p>
      <p v-if="!productsStore.hasProducts">The merchant's shelves appear to be empty. Try again later!</p>
    </div>

  </div>
</template>

<script>
import { useProductsStore } from '../stores/products.js'

export default {
  name: 'Products',
  data() {
    return {
      selectedCategory: 'all',
      selectedPriceRange: 'all'
    }
  },
  computed: {
    productsStore() {
      return useProductsStore()
    },
    availableCategories() {
      return this.productsStore.categories
    },
    displayProducts() {
      return this.productsStore.filteredProducts
    }
  },
  async mounted() {
    console.log('Products page mounted - fetching products from API')
    
    // Fetch products on page load
    await this.loadProducts()
  },
  methods: {
    async loadProducts() {
      try {
        await this.productsStore.fetchProducts({ fresh: true })
        console.log('Products loaded successfully:', this.productsStore.products.length, 'items')
      } catch (error) {
        console.error('Failed to load products:', error)
      }
    },
    
    async refreshProducts() {
      console.log('Refreshing products...')
      await this.productsStore.refreshProducts()
    },
    
    
    onCategoryChange() {
      console.log('Category changed to:', this.selectedCategory)
      
      // Update store filters for client-side filtering
      this.productsStore.updateFilters({ 
        category: this.selectedCategory 
      })
      
      // No need to fetch again - filtering is done client-side
    },
    
    onPriceRangeChange() {
      console.log('Price range changed to:', this.selectedPriceRange)
      
      let priceRange = { min: 0, max: 1000 }
      
      switch (this.selectedPriceRange) {
        case 'free':
          priceRange = { min: 0, max: 0 }
          break
        case 'under100':
          priceRange = { min: 0.01, max: 99.99 }
          break
        case '100to250':
          priceRange = { min: 100, max: 250 }
          break
        case 'over250':
          priceRange = { min: 250.01, max: 10000 }
          break
        default:
          priceRange = { min: 0, max: 1000 }
      }
      
      // Update store filters
      this.productsStore.updateFilters({ 
        priceRange: priceRange 
      })
    },
    
    goToProduct(productId) {
      console.log('Navigating to product:', productId)
      this.$router.push(`/product/${productId}`)
    },
    
    addToCart(product) {
      console.log('Adding to cart:', product)
      // TODO: Implement inventory functionality
      const productName = product.Name || product.name
      alert(`${productName} has been added to your inventory!`)
    },
    
    getCategoryName(category) {
      if (!category) return 'Unknown Category'
      
      const categoryMap = {
        content: 'Quest Scrolls',
        characters: 'Heroes & Companions', 
        items: 'Weapons & Artifacts',
        subscriptions: 'Guild Memberships',
        // API might return different category names
        'quest scrolls': 'Quest Scrolls',
        'heroes & companions': 'Heroes & Companions',
        'weapons & artifacts': 'Weapons & Artifacts',
        'guild memberships': 'Guild Memberships'
      }
      
      return categoryMap[category.toLowerCase()] || 
             category.charAt(0).toUpperCase() + category.slice(1)
    },
    
    getProductRarity(product) {
      // If product has explicit rarity, use it
      if (product.rarity) return product.rarity
      
      // Otherwise, determine rarity based on price
      const price = parseFloat(product.Price || product.price || 0)
      
      if (price === 0) return 'common'
      if (price < 50) return 'common'
      if (price < 150) return 'rare'
      if (price < 300) return 'epic'
      return 'legendary'
    },
    
    getProductEmoji(product) {
      // If product has explicit emoji, use it
      if (product.emoji) return product.emoji
      
      // Otherwise, determine emoji based on category or generate default
      const category = (product.Category || product.category || '').toLowerCase()
      
      const categoryEmojis = {
        content: '📜',
        characters: '⚔️',
        items: '🗡️',
        subscriptions: '⚜️',
        'quest scrolls': '📜',
        'heroes & companions': '⚔️', 
        'weapons & artifacts': '🗡️',
        'guild memberships': '⚜️'
      }
      
      return categoryEmojis[category] || '🎲'
    },
    
    formatPrice(price) {
      if (!price && price !== 0) return '0'
      
      const numPrice = parseFloat(price)
      
      // If it's a reasonable "gold" price (under 1000), show as-is
      if (numPrice < 1000) {
        return Math.round(numPrice).toString()
      }
      
      // If it's a real currency price (likely under $100), convert to "gold"
      if (numPrice < 100) {
        return Math.round(numPrice * 10).toString()
      }
      
      // Otherwise show as-is
      return Math.round(numPrice).toString()
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

/* Loading State */
.loading {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, var(--color-parchment) 0%, var(--color-parchment-dark) 100%);
  border-radius: 12px;
  border: 2px solid var(--color-medium-wood);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.loading-spinner {
  font-size: 3rem;
  animation: spin 2s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading p {
  font-family: 'Crimson Text', serif;
  font-size: 1.2rem;
  color: var(--color-text-dark);
  font-style: italic;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-radius: 12px;
  border: 2px solid #e57373;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  font-family: 'Cinzel', serif;
  color: #c62828;
  margin-bottom: 1rem;
}

.error-state p {
  font-family: 'Crimson Text', serif;
  color: #d32f2f;
  margin-bottom: 2rem;
}

.retry-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #e57373 0%, #ef5350 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.3);
}

/* Refresh Button */
.refresh-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 100%);
  color: var(--color-dark-wood);
  border: 2px solid var(--color-gold-dark);
  border-radius: 8px;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.3);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    gap: 1rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-group {
    align-items: stretch;
  }
  
  .refresh-btn {
    padding: 1rem;
    font-size: 0.8rem;
  }
}
</style>