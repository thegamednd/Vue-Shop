import { defineStore } from 'pinia'
import { productsAPI } from '../services/products.js'

export const useProductsStore = defineStore('products', {
  state: () => ({
    // Products data
    products: [],
    currentProduct: null,
    
    // Filters
    filters: {
      category: '',
      priceRange: { min: 0, max: 1000 },
      status: 'active'
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
    // Get filtered products based on current filters
    filteredProducts: (state) => {
      let filtered = state.products

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
      const categories = [...new Set(state.products.map(product => product.Category).filter(Boolean))]
      return ['all', ...categories.sort()]
    },

    // Get products count
    productsCount: (state) => state.products.length,

    // Get filtered products count
    filteredProductsCount: (state) => state.filteredProducts.length,

    // Check if has any products
    hasProducts: (state) => state.products.length > 0,

    // Get loading state
    isLoadingAny: (state) => state.isLoading || state.isLoadingProduct
  },

  actions: {
    // Fetch all products
    async fetchProducts(params = {}) {
      this.isLoading = true
      this.error = null

      try {
        console.log('Store: Fetching products...')
        const response = await productsAPI.getAllProducts({
          limit: this.pagination.limit,
          lastKey: this.pagination.lastKey,
          ...params
        })

        // Handle response structure - could be { products: [...] } or direct array
        const productsData = response.products || response || []
        
        // If this is a fresh fetch, replace products; if pagination, append
        if (params.fresh || !this.pagination.lastKey) {
          this.products = productsData
        } else {
          this.products = [...this.products, ...productsData]
        }

        // Update pagination
        if (response.lastKey) {
          this.pagination.lastKey = response.lastKey
          this.pagination.hasMore = true
        } else {
          this.pagination.hasMore = false
        }

        console.log(`Store: Loaded ${productsData.length} products. Total: ${this.products.length}`)
        
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
        
        // Also update in products array if it exists
        const index = this.products.findIndex(p => p.ID === id)
        if (index !== -1) {
          this.products[index] = product
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

    // Fetch products by category
    async fetchProductsByCategory(category, params = {}) {
      this.isLoading = true
      this.error = null
      this.filters.category = category

      try {
        console.log('Store: Fetching products by category:', category)
        const response = await productsAPI.getProductsByCategory(category, params)
        
        const productsData = response.products || response || []
        this.products = productsData

        console.log(`Store: Loaded ${productsData.length} products for category: ${category}`)
        
      } catch (error) {
        console.error('Store: Error fetching products by category:', error)
        this.error = error.response?.data?.message || error.message || 'Failed to fetch products'
      } finally {
        this.isLoading = false
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
        priceRange: { min: 0, max: 1000 },
        status: 'active'
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

    // Load more products (pagination)
    async loadMoreProducts() {
      if (!this.pagination.hasMore || this.isLoading) {
        return
      }

      await this.fetchProducts()
    },

    // Refresh products (clear and reload)
    async refreshProducts() {
      this.resetPagination()
      await this.fetchProducts({ fresh: true })
    },

    // Clear all data
    clearData() {
      this.products = []
      this.currentProduct = null
      this.error = null
      this.resetPagination()
    },

    // Search products with current filters
    async searchProducts() {
      this.resetPagination()
      
      const params = {}
      
      if (this.filters.category && this.filters.category !== 'all') {
        return await this.fetchProductsByCategory(this.filters.category)
      }
      
      if (this.filters.priceRange.min > 0 || this.filters.priceRange.max < 1000) {
        const response = await productsAPI.getProductsByPriceRange(this.filters.priceRange)
        const productsData = response.products || response || []
        this.products = productsData
        return
      }

      await this.fetchProducts({ fresh: true })
    }
  }
})