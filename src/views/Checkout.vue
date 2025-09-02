<template>
  <div class="checkout">
    <div class="page-header">
      <h1>Checkout</h1>
    </div>

    <div class="checkout-content">
      <div class="checkout-main">
        <!-- Step Indicator -->
        <div class="steps">
          <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
            <span class="step-number">1</span>
            <span class="step-label">Billing</span>
          </div>
          <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
            <span class="step-number">2</span>
            <span class="step-label">Payment</span>
          </div>
          <div class="step" :class="{ active: currentStep >= 3 }">
            <span class="step-number">3</span>
            <span class="step-label">Confirmation</span>
          </div>
        </div>

        <!-- Step 1: Billing Information -->
        <div v-if="currentStep === 1" class="checkout-step">
          <h2>Billing Information</h2>
          <div v-if="authStore.isAuthenticated" class="prefilled-info">
            <p>Logged in as: <strong>{{ authStore.email }}</strong></p>
          </div>
          <form @submit.prevent="nextStep" class="billing-form">
            <div class="form-row">
              <div class="form-group">
                <label>First Name</label>
                <input v-model="billingInfo.firstName" type="text" required />
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input v-model="billingInfo.lastName" type="text" required />
              </div>
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input v-model="billingInfo.email" type="email" :readonly="authStore.isAuthenticated" required />
            </div>
            
            <div class="form-group">
              <label>Address</label>
              <input v-model="billingInfo.address" type="text" required />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>City</label>
                <input v-model="billingInfo.city" type="text" required />
              </div>
              <div class="form-group">
                <label>State/Province</label>
                <input v-model="billingInfo.state" type="text" required />
              </div>
              <div class="form-group">
                <label>ZIP/Postal Code</label>
                <input v-model="billingInfo.zipCode" type="text" required />
              </div>
            </div>
            
            <div class="form-group">
              <label>Country</label>
              <select v-model="billingInfo.country" required>
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="next-btn">Continue to Payment</button>
            </div>
          </form>
        </div>

        <!-- Step 2: Payment Information -->
        <div v-if="currentStep === 2" class="checkout-step">
          <h2>Payment Information</h2>
          <div class="payment-methods">
            <div class="payment-method" :class="{ active: paymentMethod === 'card' }">
              <label>
                <input v-model="paymentMethod" type="radio" value="card" />
                💳 Credit/Debit Card
              </label>
            </div>
            <div class="payment-method" :class="{ active: paymentMethod === 'paypal' }">
              <label>
                <input v-model="paymentMethod" type="radio" value="paypal" />
                🅿️ PayPal
              </label>
            </div>
          </div>
          
          <form v-if="paymentMethod === 'card'" @submit.prevent="processPayment" class="payment-form">
            <div class="form-group">
              <label>Card Number</label>
              <input 
                v-model="cardInfo.number" 
                type="text" 
                placeholder="1234 5678 9012 3456"
                required 
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Expiry Date</label>
                <input 
                  v-model="cardInfo.expiry" 
                  type="text" 
                  placeholder="MM/YY"
                  required 
                />
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input 
                  v-model="cardInfo.cvv" 
                  type="text" 
                  placeholder="123"
                  required 
                />
              </div>
            </div>
            
            <div class="form-group">
              <label>Name on Card</label>
              <input v-model="cardInfo.name" type="text" required />
            </div>
            
            <div class="form-actions">
              <button @click="previousStep" type="button" class="back-btn">Back</button>
              <button type="submit" class="pay-btn" :disabled="isProcessing">
                <span v-if="isProcessing">Processing...</span>
                <span v-else>Complete Order</span>
              </button>
            </div>
          </form>
          
          <div v-if="paymentMethod === 'paypal'" class="paypal-section">
            <p>You will be redirected to PayPal to complete your payment.</p>
            <div class="form-actions">
              <button @click="previousStep" type="button" class="back-btn">Back</button>
              <button @click="processPayment" class="paypal-btn" :disabled="isProcessing">
                <span v-if="isProcessing">Redirecting...</span>
                <span v-else">Continue with PayPal</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Step 3: Confirmation -->
        <div v-if="currentStep === 3" class="checkout-step">
          <div class="confirmation">
            <div class="success-icon">✅</div>
            <h2>Order Confirmed!</h2>
            <p>Thank you for your purchase. Your order has been processed successfully.</p>
            
            <div class="order-details">
              <h3>Order #{{ orderNumber }}</h3>
              <p>A confirmation email has been sent to {{ billingInfo.email }}</p>
              <p>Your digital items are now available in your account.</p>
            </div>
            
            <div class="form-actions">
              <router-link to="/account" class="account-btn">View My Account</router-link>
              <router-link to="/products" class="continue-btn">Continue Shopping</router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="order-summary">
        <div class="summary-card">
          <h3>Order Summary</h3>
          
          <div class="summary-items">
            <div v-for="item in orderItems" :key="item.id" class="summary-item">
              <div class="item-info">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-qty">x{{ item.quantity }}</span>
              </div>
              <span class="item-total">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="summary-totals">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Checkout',
  setup() {
    const authStore = useAuthStore()
    
    const data = reactive({
      currentStep: 1,
      paymentMethod: 'card',
      isProcessing: false,
      orderNumber: '',
      billingInfo: {
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      cardInfo: {
        number: '',
        expiry: '',
        cvv: '',
        name: ''
      },
      orderItems: [
        // Sample items - would come from cart in real app
        {
          id: 1,
          name: 'Starter Content Pack',
          price: 9.99,
          quantity: 1
        },
        {
          id: 2,
          name: 'Epic Character Bundle',
          price: 19.99,
          quantity: 2
        }
      ]
    })
    
    // Initialize billing email with user's email if authenticated
    onMounted(() => {
      if (authStore.isAuthenticated && authStore.email) {
        data.billingInfo.email = authStore.email
      }
    })
    
    const subtotal = computed(() => {
      return data.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    })
    
    const tax = computed(() => {
      return subtotal.value * 0.08 // 8% tax
    })
    
    const total = computed(() => {
      return subtotal.value + tax.value
    })
    
    const nextStep = () => {
      if (data.currentStep < 3) {
        data.currentStep++
      }
    }
    
    const previousStep = () => {
      if (data.currentStep > 1) {
        data.currentStep--
      }
    }
    
    const processPayment = async () => {
      data.isProcessing = true
      
      try {
        // TODO: Implement actual payment processing
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate payment processing
        
        // Generate order number
        data.orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        
        nextStep()
      } catch (error) {
        alert('Payment failed. Please try again.')
      } finally {
        data.isProcessing = false
      }
    }
    
    return {
      authStore,
      ...data,
      subtotal,
      tax,
      total,
      nextStep,
      previousStep,
      processPayment
    }
  }
}
</script>

<style scoped>
.checkout {
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

.checkout-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.steps {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 2rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #7f8c8d;
}

.step.active {
  color: #3498db;
}

.step.completed {
  color: #27ae60;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.step.active .step-number {
  background: #3498db;
  color: white;
}

.step.completed .step-number {
  background: #27ae60;
  color: white;
}

.checkout-step {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.checkout-step h2 {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.prefilled-info {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 2rem;
  color: #155724;
}

.billing-form,
.payment-form {
  max-width: 600px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3498db;
}

.payment-methods {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.payment-method {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-method.active {
  border-color: #3498db;
  background: #f8f9fa;
}

.payment-method label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: bold;
}

.payment-method input[type="radio"] {
  margin: 0;
}

.paypal-section {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.next-btn,
.pay-btn,
.paypal-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.next-btn:hover,
.pay-btn:hover:not(:disabled),
.paypal-btn:hover:not(:disabled) {
  background: #2980b9;
}

.back-btn {
  background: #95a5a6;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 6px;
  cursor: pointer;
}

.back-btn:hover {
  background: #7f8c8d;
}

.pay-btn:disabled,
.paypal-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.confirmation {
  text-align: center;
  padding: 2rem;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.confirmation h2 {
  color: #27ae60;
  margin-bottom: 1rem;
}

.order-details {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.order-details h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.account-btn,
.continue-btn {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  margin: 0 0.5rem;
  transition: all 0.3s;
}

.account-btn {
  background: #27ae60;
  color: white;
}

.account-btn:hover {
  background: #229954;
}

.continue-btn {
  background: transparent;
  color: #3498db;
  border: 2px solid #3498db;
}

.continue-btn:hover {
  background: #3498db;
  color: white;
}

.order-summary {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.summary-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.summary-card h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.summary-items {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  font-weight: bold;
  color: #2c3e50;
}

.item-qty {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.item-total {
  font-weight: bold;
  color: #27ae60;
}

.summary-totals {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  color: #7f8c8d;
}

.summary-row.total {
  font-weight: bold;
  font-size: 1.2rem;
  color: #2c3e50;
  border-top: 1px solid #e9ecef;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
  
  .steps {
    gap: 1rem;
  }
  
  .step-label {
    display: none;
  }
  
  .form-actions {
    justify-content: center;
  }
  
  .payment-methods {
    flex-direction: column;
  }
}
</style>