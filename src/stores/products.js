import { defineStore } from 'pinia'
import { productsAPI } from '../services/products.js'

export const useProductsStore = defineStore('products', {
  state: () => ({
    // Products data as object collection { id: product, ... }
    products: {},
    currentProduct: null,
    
    // Filters (client-side only)
    filters: {
      category: '',
      priceRange: { min: 0, max: 1000000 }  // In cents (up to $10,000)
    },
    
    // Loading states
    isLoading: false,
    isLoadingProduct: false,
    
    // Error handling
    error: null,
    
    // Pagination
    pagination: {
      lastKey: null,
      hasMore: true,
      limit: 20
    },
    
    // Categories for filtering
    availableCategories: []
  }),

  getters: {
    // Get all products as array from object collection
    productsArray: (state) => Object.values(state.products),

    // Get filtered products based on current filters
    filteredProducts: (state) => {
      let filtered = Object.values(state.products)

      // Filter by category if selected
      if (state.filters.category && state.filters.category !== 'all') {
        filtered = filtered.filter(product => 
          product.Category?.toLowerCase() === state.filters.category.toLowerCase()
        )
      }

      // Filter by price range
      filtered = filtered.filter(product => {
        const price = parseFloat(product.Price) || 0
        return price >= state.filters.priceRange.min && price <= state.filters.priceRange.max
      })

      return filtered
    },

    // Get unique categories from products
    categories: (state) => {
      const productsArray = Object.values(state.products)
      const categories = [...new Set(productsArray.map(product => product.Category).filter(Boolean))]
      return ['all', ...categories.sort()]
    },

    // Get products count
    productsCount: (state) => Object.keys(state.products).length,

    // Get filtered products count
    filteredProductsCount: (state) => state.filteredProducts.length,

    // Check if has any products
    hasProducts: (state) => Object.keys(state.products).length > 0,

    // Get loading state
    isLoadingAny: (state) => state.isLoading || state.isLoadingProduct,

    // Get product by ID
    getProductById: (state) => (id) => state.products[id] || null
  },

  actions: {
    // Fetch all products - simple API call with no parameters
    async fetchProducts(params = {}) {
      this.isLoading = true
      this.error = null

      try {
        console.log('Store: Fetching all products from /shop (no parameters)...')
        
        const response = await productsAPI.getAllProducts()

        // Handle response structure - API returns { products: [...], count: number }
        const productsData = response.products || response || []
        
        // Convert array to object collection with ID as key
        const productsObject = {}
        productsData.forEach(product => {
          if (product.ID) {
            productsObject[product.ID] = product
          }
        })
        
        // Always replace products since we're not using pagination
        this.products = productsObject

        // Reset pagination since we get all products at once
        this.pagination.hasMore = false
        this.pagination.lastKey = null

        console.log(`Store: Loaded ${productsData.length} products into object collection`)
        
      } catch (error) {
        console.error('Store: Error fetching products:', error)
        this.error = error.response?.data?.message || error.message || 'Failed to fetch products'
      } finally {
        this.isLoading = false
      }
    },

    // Fetch single product by ID
    async fetchProductById(id) {
      this.isLoadingProduct = true
      this.error = null

      try {
        console.log('Store: Fetching product by ID:', id)
        const product = await productsAPI.getProductById(id)
        
        this.currentProduct = product
        
        // Update in products object collection
        if (product && product.ID) {
          this.products[product.ID] = product
        }

        console.log('Store: Loaded product:', product)
        return product
        
      } catch (error) {
        console.error('Store: Error fetching product:', error)
        this.error = error.response?.data?.message || error.message || 'Failed to fetch product'
        throw error
      } finally {
        this.isLoadingProduct = false
      }
    },


    // Update filters
    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
      console.log('Store: Updated filters:', this.filters)
    },

    // Clear filters
    clearFilters() {
      this.filters = {
        category: '',
        priceRange: { min: 0, max: 1000000 }  // In cents (up to $10,000)
      }
      console.log('Store: Cleared filters')
    },

    // Reset pagination
    resetPagination() {
      this.pagination = {
        lastKey: null,
        hasMore: true,
        limit: 20
      }
    },


    // Refresh products (clear and reload)
    async refreshProducts() {
      await this.fetchProducts({ fresh: true })
    },

    // Clear all data
    clearData() {
      this.products = {}
      this.currentProduct = null
      this.error = null
      this.resetPagination()
    },

    // Search products with current filters (all client-side filtering)
    async searchProducts() {
      console.log('Store: Searching products with filters:', this.filters)
      // All filtering via filteredProducts getter - client-side only
      if (!this.hasProducts) {
        await this.fetchProducts({ fresh: true })
      }
    },

    // Add or update a single product in the collection
    setProduct(product) {
      if (product && product.ID) {
        this.products[product.ID] = product
        console.log('Store: Set product:', product.ID, product.Name)
      }
    },

    // Remove a product from the collection
    removeProduct(id) {
      if (this.products[id]) {
        const productName = this.products[id].Name
        delete this.products[id]
        console.log('Store: Removed product:', id, productName)
      }
    },

    // Check if product exists in collection
    hasProduct(id) {
      return !!this.products[id]
    }
  }
})