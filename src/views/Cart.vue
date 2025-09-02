<template>
  <div class="cart">
    <div class="page-header">
      <h1 class="page-title">🎒 Your Inventory 🎒</h1>
    </div>

    <div v-if="cartItems.length === 0" class="empty-cart">
      <div class="empty-inventory-icon">🗺️</div>
      <h2>Your inventory awaits treasures</h2>
      <p>Venture forth and discover wares worthy of a true adventurer</p>
      <router-link to="/products" class="browse-btn">
        <span class="button-text">Explore Merchant's Hall</span>
        <span class="button-decoration">➤</span>
      </router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div 
          v-for="item in cartItems" 
          :key="item.id" 
          class="cart-item"
        >
          <div class="item-image">{{ item.emoji }}</div>
          <div class="item-details">
            <h3 class="item-name">{{ item.name }}</h3>
            <p class="item-category">{{ item.category }}</p>
          </div>
          <div class="item-quantity">
            <button @click="updateQuantity(item.id, item.quantity - 1)" :disabled="item.quantity <= 1">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="updateQuantity(item.id, item.quantity + 1)">+</button>
          </div>
          <div class="item-price">
            ${{ (item.price * item.quantity).toFixed(2) }}
          </div>
          <button @click="removeItem(item.id)" class="remove-btn">×</button>
        </div>
      </div>

      <div class="cart-summary">
        <div class="summary-card">
          <h3>Order Summary</h3>
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Tax:</span>
            <span>${{ tax.toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
          <button @click="proceedToCheckout" class="checkout-btn">
            <span class="button-icon">🪙</span>
            Complete Transaction
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  data() {
    return {
      cartItems: [
        // Sample cart items - in real app this would come from store
        {
          id: 1,
          name: 'Starter Content Pack',
          category: 'content',
          price: 9.99,
          emoji: '📦',
          quantity: 1
        },
        {
          id: 2,
          name: 'Epic Character Bundle',
          category: 'characters',
          price: 19.99,
          emoji: '⚔️',
          quantity: 2
        }
      ]
    }
  },
  computed: {
    subtotal() {
      return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    tax() {
      return this.subtotal * 0.08 // 8% tax
    },
    total() {
      return this.subtotal + this.tax
    }
  },
  methods: {
    updateQuantity(itemId, newQuantity) {
      if (newQuantity <= 0) {
        this.removeItem(itemId)
        return
      }
      
      const item = this.cartItems.find(item => item.id === itemId)
      if (item) {
        item.quantity = newQuantity
      }
    },
    removeItem(itemId) {
      this.cartItems = this.cartItems.filter(item => item.id !== itemId)
    },
    proceedToCheckout() {
      this.$router.push('/checkout')
    }
  }
}
</script>

<style scoped>
.cart {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, var(--color-deep-red) 0%, var(--color-dark-wood) 50%, var(--color-iron) 100%);
  padding: 2rem;
  border-radius: 8px;
  border: 2px solid var(--color-gold-dark);
  box-shadow: 
    0 10px 20px var(--color-shadow),
    inset 0 1px 0 rgba(201,168,118,0.2);
}

.page-title {
  font-family: 'Cinzel', serif;
  font-size: 2.8rem;
  color: var(--color-gold);
  text-shadow: 
    3px 3px 6px rgba(0,0,0,0.8),
    0 0 30px rgba(255,215,0,0.3);
  letter-spacing: 2px;
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, var(--color-iron) 0%, var(--color-medium-wood) 100%);
  border-radius: 8px;
  border: 2px solid var(--color-gold-dark);
  box-shadow: 
    0 10px 20px var(--color-shadow),
    inset 0 1px 0 rgba(201,168,118,0.15);
}

.empty-inventory-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(0,0,0,0.3));
}

.empty-cart h2 {
  font-family: 'Cinzel', serif;
  color: var(--color-gold);
  margin-bottom: 1rem;
  font-size: 1.8rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
}

.empty-cart p {
  font-family: 'Crimson Text', serif;
  color: var(--color-parchment);
  margin-bottom: 2rem;
  font-style: italic;
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.browse-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 100%);
  color: var(--color-dark-wood);
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 8px;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 2px solid var(--color-gold-dark);
  transition: all 0.3s;
  box-shadow: 
    0 4px 8px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.4);
}

.browse-btn:hover {
  background: linear-gradient(135deg, var(--color-gold) 0%, #fff3b8 100%);
  transform: translateY(-2px);
  box-shadow: 
    0 6px 12px rgba(0,0,0,0.4),
    0 0 20px rgba(255,215,0,0.3);
}

.button-decoration {
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.browse-btn:hover .button-decoration {
  transform: translateX(5px);
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  background: linear-gradient(135deg, var(--color-iron) 0%, var(--color-medium-wood) 100%);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-gold-dark);
  box-shadow: 
    0 4px 8px var(--color-shadow),
    inset 0 1px 0 rgba(201,168,118,0.1);
}

.item-image {
  font-size: 3rem;
  text-align: center;
}

.item-details {
  min-width: 0;
}

.item-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--color-gold);
  margin-bottom: 0.25rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
}

.item-category {
  color: var(--color-parchment);
  text-transform: capitalize;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 6px;
}

.item-quantity button {
  background: #e9ecef;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-quantity button:hover:not(:disabled) {
  background: #dee2e6;
}

.item-quantity button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-quantity span {
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.item-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #27ae60;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #c0392b;
}

.cart-summary {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.summary-card {
  background: linear-gradient(135deg, var(--color-iron) 0%, var(--color-medium-wood) 100%);
  padding: 2rem;
  border-radius: 8px;
  border: 2px solid var(--color-gold-dark);
  box-shadow: 
    0 6px 12px var(--color-shadow),
    inset 0 1px 0 rgba(201,168,118,0.15);
}

.summary-card h3 {
  color: var(--color-gold);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: var(--color-parchment);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.summary-row.total {
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--color-gold);
  border-top: 1px solid var(--color-gold-dark);
  padding-top: 1rem;
  margin-top: 1rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
}

.checkout-btn {
  width: 100%;
  background: #27ae60;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background: #229954;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    grid-template-columns: 60px 1fr auto;
    grid-template-rows: auto auto;
    gap: 1rem;
  }
  
  .item-quantity {
    grid-column: 1 / -1;
    justify-self: center;
  }
  
  .item-price,
  .remove-btn {
    grid-row: 1;
  }
}
</style>