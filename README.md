# RealmForge Shop

A Vue 3 e-commerce application for purchasing RealmForge content and premium features.

## Project Structure

```
Shop/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable Vue components
│   ├── views/          # Page components
│   │   ├── Home.vue           # Homepage with featured products
│   │   ├── Products.vue       # Product catalog with filtering
│   │   ├── ProductDetail.vue  # Individual product details
│   │   ├── Cart.vue           # Shopping cart
│   │   ├── Checkout.vue       # Multi-step checkout process
│   │   ├── Account.vue        # User account management
│   │   ├── Login.vue          # User authentication
│   │   └── Register.vue       # User registration
│   ├── stores/         # Pinia stores for state management
│   ├── utils/          # Utility functions
│   ├── router/         # Vue Router configuration
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── index.html          # HTML template
```

## Features

### Completed
- 🏠 **Homepage** - Welcome page with featured products and site navigation
- 🛍️ **Product Catalog** - Browse products with category and price filtering
- 📱 **Product Details** - Detailed product pages with features and descriptions
- 🛒 **Shopping Cart** - Add/remove items, quantity management
- 💳 **Checkout Process** - Multi-step checkout with billing and payment
- 👤 **User Account** - Profile management, purchase history, digital library
- 🔐 **Authentication** - Login and registration forms
- 📱 **Responsive Design** - Mobile-friendly layouts

### Planned Integrations
- 🔗 **AWS Amplify Authentication** - User management and secure login
- 💰 **Payment Processing** - Stripe or PayPal integration
- 🛍️ **Cart State Management** - Persistent shopping cart with Pinia
- 📧 **Email Notifications** - Order confirmations and receipts
- 🏪 **Product Management** - Dynamic product catalog from API
- 👑 **Digital Content Delivery** - Automatic content unlocking in main RealmForge app

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
cd /home/blechler/ReamlForge/Shop

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8082`

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run build:staging` - Build for staging
- `npm run build:production` - Build for production
- `npm run preview` - Preview production build

## Technology Stack

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Styling**: CSS3 with CSS Grid and Flexbox
- **Authentication**: AWS Amplify (planned)
- **HTTP Client**: Axios
- **Deployment**: TBD

## Configuration

The project uses environment-based configuration:
- Development: `npm run dev`
- Staging: `npm run build:staging`
- Production: `npm run build:production`

Environment variables can be set in `.env.local`, `.env.development`, `.env.staging`, and `.env.production` files.

## Architecture Notes

This project follows the same structure as the existing Frontend and Admin applications:
- Port 8082 (Frontend uses 8080, Admin uses 3001)
- Vite build system with environment-specific builds
- Vue 3 with modern JavaScript features
- Component-based architecture with clear separation of concerns
- Responsive design patterns matching the RealmForge brand

## Next Steps

1. **Backend Integration**
   - Connect to product catalog API
   - Implement user authentication with AWS Amplify
   - Add payment processing (Stripe/PayPal)

2. **State Management**
   - Implement Pinia stores for cart, user, and products
   - Add persistence for cart items

3. **Content Delivery**
   - Connect with main RealmForge app for content unlocking
   - Implement digital download system

4. **Testing & Deployment**
   - Add unit tests
   - Set up CI/CD pipeline
   - Deploy to staging/production environments