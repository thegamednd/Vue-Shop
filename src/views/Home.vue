<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-decoration">⚔️</div>
      <h1 class="hero-title">Welcome, Adventurer!</h1>
      <p class="hero-subtitle">
        Enter the Merchant's Hall and discover legendary artifacts for your quest
      </p>
      <router-link to="/products" class="cta-button">
        <span class="button-text">Browse Wares</span>
        <span class="button-decoration">➤</span>
      </router-link>
    </div>

    <div class="features-section">
      <h2 class="section-title">The Merchant's Promise</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">⚔️</div>
          <h3>Legendary Artifacts</h3>
          <p>Acquire rare weapons, ancient scrolls, and mythical companions</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🛡️</div>
          <h3>Ironclad Guarantee</h3>
          <p>Every transaction protected by the Guild's sacred oath</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔮</div>
          <h3>Instant Enchantment</h3>
          <p>Your purchases are magically bound to your account immediately</p>
        </div>
      </div>
    </div>

    <div class="featured-products">
      <h2 class="section-title">Featured Treasures</h2>
      <div class="products-grid">
        <div class="product-card" data-rarity="common">
          <div class="rarity-badge">Common</div>
          <div class="product-image">🎲</div>
          <h3>Adventurer's Kit</h3>
          <p class="price">
            <span class="gold-icon">🪙</span>
            <span class="gold-amount">99</span>
            <span class="gold-label">Gold</span>
          </p>
          <p class="product-desc">Essential gear for novice heroes</p>
        </div>
        <div class="product-card" data-rarity="rare">
          <div class="rarity-badge">Rare</div>
          <div class="product-image">📜</div>
          <h3>Arcane Compendium</h3>
          <p class="price">
            <span class="gold-icon">🪙</span>
            <span class="gold-amount">249</span>
            <span class="gold-label">Gold</span>
          </p>
          <p class="product-desc">Ancient spells and forbidden knowledge</p>
        </div>
        <div class="product-card" data-rarity="legendary">
          <div class="rarity-badge">Legendary</div>
          <div class="product-image">💉</div>
          <h3>Dragon Lord's Legacy</h3>
          <p class="price">
            <span class="gold-icon">🪙</span>
            <span class="gold-amount">499</span>
            <span class="gold-label">Gold</span>
          </p>
          <p class="product-desc">The ultimate power awaits</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  background: 
    linear-gradient(135deg, var(--color-deep-red) 0%, var(--color-dark-wood) 50%, var(--color-iron) 100%),
    radial-gradient(circle at center, rgba(201,168,118,0.08) 0%, transparent 70%);
  color: var(--color-gold);
  border-radius: 8px;
  margin-bottom: 3rem;
  position: relative;
  border: 2px solid var(--color-gold-dark);
  box-shadow: 
    0 12px 35px var(--color-shadow),
    inset 0 1px 0 rgba(201,168,118,0.2),
    inset 0 -1px 0 rgba(0,0,0,0.5);
}

.hero-section::before,
.hero-section::after {
  content: '⚜';
  position: absolute;
  font-size: 3rem;
  color: var(--color-gold-dark);
  opacity: 0.3;
}

.hero-section::before {
  top: 1rem;
  left: 1rem;
}

.hero-section::after {
  bottom: 1rem;
  right: 1rem;
}

.hero-decoration {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(255,215,0,0.5));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.hero-title {
  font-family: 'Cinzel', serif;
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  text-shadow: 
    3px 3px 6px rgba(0,0,0,0.8),
    0 0 30px rgba(255,215,0,0.3);
  letter-spacing: 3px;
}

.hero-subtitle {
  font-family: 'Crimson Text', serif;
  font-size: 1.4rem;
  margin-bottom: 2rem;
  color: var(--color-parchment);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
  font-style: italic;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 50%, var(--color-gold-dark) 100%);
  color: var(--color-dark-wood);
  padding: 1rem 2.5rem;
  text-decoration: none;
  border-radius: 8px;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: 2px solid var(--color-gold-dark);
  transition: all 0.3s;
  box-shadow: 
    0 4px 8px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.4);
  position: relative;
  overflow: hidden;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.cta-button:hover::before {
  left: 100%;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(0,0,0,0.5),
    0 0 30px rgba(255,215,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.6);
  background: linear-gradient(135deg, var(--color-gold) 0%, #fff3b8 50%, var(--color-gold) 100%);
}

.button-decoration {
  font-size: 1.3rem;
  transition: transform 0.3s;
}

.cta-button:hover .button-decoration {
  transform: translateX(5px);
}

.features-section {
  margin-bottom: 3rem;
  text-align: center;
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--color-gold);
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
  position: relative;
  padding-bottom: 1rem;
}

.section-title::after {
  content: '❦ ❦ ❦';
  display: block;
  font-size: 1rem;
  color: var(--color-gold-dark);
  margin-top: 0.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: 
    linear-gradient(135deg, var(--color-iron) 0%, var(--color-medium-wood) 100%);
  padding: 2rem;
  border-radius: 8px;
  border: 2px solid var(--color-gold-dark);
  box-shadow: 
    0 6px 12px var(--color-shadow),
    inset 0 1px 0 rgba(201,168,118,0.15),
    inset 0 -1px 0 rgba(0,0,0,0.3);
  transition: all 0.3s;
  position: relative;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--color-gold), transparent, var(--color-gold));
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 8px 16px rgba(0,0,0,0.4),
    0 0 20px rgba(255,215,0,0.2);
}

.feature-card:hover::before {
  opacity: 0.3;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-family: 'Cinzel', serif;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: var(--color-gold);
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
}

.featured-products {
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.product-card {
  background: linear-gradient(135deg, var(--color-iron) 0%, var(--color-medium-wood) 100%);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 6px 12px var(--color-shadow);
  transition: all 0.3s;
  position: relative;
  border: 2px solid var(--color-stone);
}

.product-card[data-rarity="common"] {
  border-color: #8b7355;
}

.product-card[data-rarity="rare"] {
  border-color: #3a5998;
  background: linear-gradient(135deg, var(--color-iron) 0%, #2a3a5c 100%);
}

.product-card[data-rarity="legendary"] {
  border-color: var(--color-gold-dark);
  background: linear-gradient(135deg, var(--color-iron) 0%, var(--color-light-wood) 100%);
  box-shadow: 
    0 8px 16px var(--color-shadow),
    0 0 25px rgba(201,168,118,0.3),
    inset 0 1px 0 rgba(201,168,118,0.2);
}

.rarity-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-dark-wood);
  color: var(--color-gold);
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 2px solid currentColor;
}

.product-card[data-rarity="common"] .rarity-badge {
  background: #8b7355;
  color: white;
  border-color: #6b5a45;
}

.product-card[data-rarity="rare"] .rarity-badge {
  background: #4169e1;
  color: white;
  border-color: #3155c1;
}

.product-card[data-rarity="legendary"] .rarity-badge {
  background: linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 100%);
  color: var(--color-dark-wood);
  border-color: var(--color-gold-dark);
}

.product-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 8px 16px rgba(0,0,0,0.4),
    0 0 30px rgba(255,215,0,0.15);
}

.product-image {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.product-card h3 {
  font-family: 'Cinzel', serif;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  color: var(--color-gold);
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
}

.price {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--color-gold-dark);
}

.gold-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 2px rgba(255,215,0,0.5));
}

.gold-amount {
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  font-weight: 700;
}

.gold-label {
  font-family: 'Cinzel', serif;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-desc {
  font-family: 'Crimson Text', serif;
  color: var(--color-parchment);
  font-style: italic;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .features-section h2,
  .featured-products h2 {
    font-size: 2rem;
  }
  
  .hero-section {
    padding: 2rem 1rem;
  }
}
</style>