<template>
  <div class="product-detail" v-if="product">
    <div class="product-header">
      <button @click="goBack" class="back-btn">← Back to Products</button>
    </div>
    
    <div class="product-content">
      <div class="product-image-section">
        <div class="product-image-large">{{ product.emoji }}</div>
      </div>
      
      <div class="product-info">
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-category">{{ product.category }}</p>
        <p class="product-price">${{ product.price }}</p>
        
        <div class="product-description">
          <h3>Description</h3>
          <p>{{ product.description }}</p>
          <p>{{ product.longDescription }}</p>
        </div>
        
        <div class="product-features" v-if="product.features">
          <h3>Features</h3>
          <ul>
            <li v-for="feature in product.features" :key="feature">{{ feature }}</li>
          </ul>
        </div>
        
        <div class="purchase-section">
          <button @click="addToCart" class="add-to-cart-btn">
            Add to Cart - ${{ product.price }}
          </button>
          <button @click="buyNow" class="buy-now-btn">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="not-found">
    <h1>Product Not Found</h1>
    <p>Sorry, we couldn't find the product you're looking for.</p>
    <router-link to="/products" class="back-link">← Back to Products</router-link>
  </div>
</template>

<script>
import { useProductsStore } from '../stores/products.js'

export default {
  name: 'ProductDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      product: null,
      isLoading: false,
      error: null,
      // Fallback mock products for development
      mockProducts: [
        {
          id: 1,
          name: 'Starter Content Pack',
          category: 'content',
          price: 9.99,
          emoji: '📦',
          description: 'Essential content to get you started on your adventure',
          longDescription: 'This comprehensive starter pack includes everything a new player needs to begin their RealmForge journey. With carefully curated content designed for beginners, you\'ll have access to tutorials, basic equipment, and introductory quests that will help you understand the game mechanics.',
          features: [
            '10+ beginner-friendly quests',
            'Basic equipment set',
            'Tutorial guides',
            'Character creation templates'
          ]
        },
        {
          id: 2,
          name: 'Epic Character Bundle',
          category: 'characters',
          price: 19.99,
          emoji: '⚔️',
          description: 'Unlock powerful characters with unique abilities',
          longDescription: 'Gain access to a collection of pre-made characters, each with their own backstories, unique abilities, and specialized equipment. Perfect for players who want to jump into advanced gameplay.',
          features: [
            '5 unique character builds',
            'Exclusive character abilities',
            'Custom character artwork',
            'Detailed backstories'
          ]
        },
        {
          id: 3,
          name: 'Legendary Items Pack',
          category: 'items',
          price: 14.99,
          emoji: '🗡️',
          description: 'Rare and powerful items for your inventory',
          longDescription: 'Equip your characters with legendary items that can turn the tide of any battle. This pack includes weapons, armor, and magical items with unique properties.',
          features: [
            '15+ legendary items',
            'Unique item abilities',
            'Custom item artwork',
            'Item upgrade paths'
          ]
        }
      ]
    }
  },
  computed: {
    productsStore() {
      return useProductsStore()
    }
  },
  async mounted() {
    await this.loadProduct()
  },
  watch: {
    id() {
      this.loadProduct()
    }
  },
  methods: {
    async loadProduct() {
      this.isLoading = true
      this.error = null
      
      try {
        // First check if product is already in store
        const storeProduct = this.productsStore.getProductById(this.id)
        
        if (storeProduct) {
          // Map the product data to the expected format
          this.product = {
            id: storeProduct.ID,
            name: storeProduct.Name,
            category: storeProduct.Category,
            price: (storeProduct.Price / 100).toFixed(2), // Convert cents to dollars
            emoji: this.getProductEmoji(storeProduct),
            description: storeProduct.Description || storeProduct.Info || 'A mysterious item from the merchant\'s collection',
            longDescription: storeProduct.LongDescription || '',
            features: storeProduct.Features || storeProduct.Tags || []
          }
        } else {
          // Try to fetch individual product if not in store
          try {
            const fetchedProduct = await this.productsStore.fetchProductById(this.id)
            if (fetchedProduct) {
              this.product = {
                id: fetchedProduct.ID,
                name: fetchedProduct.Name,
                category: fetchedProduct.Category,
                price: (fetchedProduct.Price / 100).toFixed(2),
                emoji: this.getProductEmoji(fetchedProduct),
                description: fetchedProduct.Description || fetchedProduct.Info || 'A mysterious item from the merchant\'s collection',
                longDescription: fetchedProduct.LongDescription || '',
                features: fetchedProduct.Features || fetchedProduct.Tags || []
              }
            }
          } catch (fetchError) {
            // Fallback to mock data if API fails
            console.warn('Failed to fetch product, using mock data:', fetchError)
            const productId = parseInt(this.id)
            this.product = this.mockProducts.find(p => p.id === productId)
          }
        }
      } catch (error) {
        console.error('Error loading product:', error)
        this.error = error.message
        // Fallback to mock data
        const productId = parseInt(this.id)
        this.product = this.mockProducts.find(p => p.id === productId)
      } finally {
        this.isLoading = false
      }
    },
    
    getProductEmoji(product) {
      const category = (product.Category || '').toLowerCase()
      const categoryEmojis = {
        content: '📜',
        characters: '⚔️',
        items: '🗡️',
        subscriptions: '⚜️'
      }
      return categoryEmojis[category] || '🎲'
    },
    goBack() {
      this.$router.push('/products')
    },
    addToCart() {
      // TODO: Implement cart functionality
      alert(`Added ${this.product.name} to cart!`)
    },
    buyNow() {
      // TODO: Implement direct purchase
      alert(`Proceeding to checkout for ${this.product.name}`)
    }
  }
}
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.product-header {
  margin-bottom: 2rem;
}

.back-btn {
  background: #95a5a6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background: #7f8c8d;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.product-image-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.product-image-large {
  font-size: 8rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
}

.product-category {
  color: #7f8c8d;
  text-transform: capitalize;
  font-size: 1.1rem;
}

.product-price {
  font-size: 2rem;
  font-weight: bold;
  color: #27ae60;
}

.product-description h3,
.product-features h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.product-description p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.product-features ul {
  list-style: none;
  padding: 0;
}

.product-features li {
  color: #7f8c8d;
  padding: 0.25rem 0;
  position: relative;
  padding-left: 1.5rem;
}

.product-features li::before {
  content: '✓';
  color: #27ae60;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.purchase-section {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.add-to-cart-btn,
.buy-now-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  flex: 1;
}

.add-to-cart-btn {
  background: #3498db;
  color: white;
}

.add-to-cart-btn:hover {
  background: #2980b9;
}

.buy-now-btn {
  background: #27ae60;
  color: white;
}

.buy-now-btn:hover {
  background: #229954;
}

.not-found {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.not-found h1 {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.back-link {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
}

.back-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .product-image-large {
    font-size: 6rem;
  }
  
  .product-title {
    font-size: 2rem;
  }
  
  .purchase-section {
    flex-direction: column;
  }
}
</style>