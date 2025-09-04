import apiClient from './api.js'

export const productsAPI = {
  /**
   * Fetch all products - simple GET /shop with no parameters
   * @returns {Promise} API response
   */
  async getAllProducts() {
    try {
      console.log('Fetching all products from /shop endpoint (no parameters)')
      
      const response = await apiClient.get('/shop')
      
      console.log('Products API response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  /**
   * Fetch single product by ID
   * @param {string} id - Product ID
   * @returns {Promise} API response
   */
  async getProductById(id) {
    try {
      console.log('Fetching product by ID:', id)
      
      const response = await apiClient.get(`/shop/products/product/${id}`)
      
      console.log('Product API response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  /**
   * Fetch products by category
   * @param {string} category - Category name
   * @param {Object} params - Additional query parameters
   * @returns {Promise} API response
   */
  async getProductsByCategory(category, params = {}) {
    try {
      console.log('Fetching products by category:', category, 'with params:', params)
      
      const response = await apiClient.get('/shop', {
        params: {
          category,
          ...params
        }
      })
      
      console.log('Products by category API response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching products by category:', error)
      throw error
    }
  },

  /**
   * Search products with price range
   * @param {Object} priceRange - Price range filter
   * @param {number} priceRange.min - Minimum price
   * @param {number} priceRange.max - Maximum price
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getProductsByPriceRange(priceRange, params = {}) {
    try {
      console.log('Fetching products by price range:', priceRange, 'with params:', params)
      
      const response = await apiClient.get('/shop', {
        params: {
          status: 'active', // Filter by status to use the Status-Price-index
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          ...params
        }
      })
      
      console.log('Products by price range API response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching products by price range:', error)
      throw error
    }
  }
}