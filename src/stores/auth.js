import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  signIn,
  signUp,
  confirmSignUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  resetPassword,
  confirmResetPassword
} from 'aws-amplify/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isLoading = ref(true)
  const error = ref(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const username = computed(() => user.value?.username || '')
  const email = computed(() => user.value?.attributes?.email || '')
  const name = computed(() => user.value?.attributes?.name || '')

  // Actions
  async function checkAuthState() {
    isLoading.value = true
    error.value = null
    
    try {
      const { username, userId, signInDetails } = await getCurrentUser()
      const session = await fetchAuthSession()
      
      user.value = {
        username,
        userId,
        signInDetails,
        attributes: session.tokens?.idToken?.payload || {}
      }
      
      console.log('User authenticated:', username)
      return true
    } catch (err) {
      // User is not authenticated - this is OK for the shop
      user.value = null
      console.log('User not authenticated - anonymous browsing allowed')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function signInUser(email, password) {
    isLoading.value = true
    error.value = null
    
    try {
      const { isSignedIn, nextStep } = await signIn({ 
        username: email, 
        password 
      })
      
      if (isSignedIn) {
        await checkAuthState() // Refresh user data
        return { success: true }
      } else {
        return { success: false, nextStep }
      }
    } catch (err) {
      error.value = err.message || 'Failed to sign in'
      console.error('Sign in error:', err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function signUpUser(email, password, name) {
    isLoading.value = true
    error.value = null
    
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name
          }
        }
      })
      
      return { 
        success: true, 
        isSignUpComplete,
        needsConfirmation: nextStep?.signUpStep === 'CONFIRM_SIGN_UP',
        username: email,
        userId 
      }
    } catch (err) {
      error.value = err.message || 'Failed to sign up'
      console.error('Sign up error:', err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function confirmSignUpUser(username, code) {
    isLoading.value = true
    error.value = null
    
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode: code
      })
      
      return { success: isSignUpComplete, nextStep }
    } catch (err) {
      error.value = err.message || 'Failed to confirm sign up'
      console.error('Confirm sign up error:', err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function signOutUser() {
    isLoading.value = true
    error.value = null
    
    try {
      await signOut()
      user.value = null
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Failed to sign out'
      console.error('Sign out error:', err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function federatedSignIn(provider = 'Google') {
    isLoading.value = true
    error.value = null
    
    try {
      // In Amplify v6, federated sign-in is handled differently
      // This would typically be configured through the Hosted UI
      window.location.href = `https://${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/authorize?client_id=${import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(window.location.origin)}&identity_provider=${provider}`
    } catch (err) {
      error.value = err.message || 'Failed to initiate federated sign in'
      console.error('Federated sign in error:', err)
      isLoading.value = false
    }
  }

  async function forgotPassword(email) {
    isLoading.value = true
    error.value = null
    
    try {
      const { isPasswordReset, nextStep } = await resetPassword({ username: email })
      return { success: true, nextStep }
    } catch (err) {
      error.value = err.message || 'Failed to send reset code'
      console.error('Forgot password error:', err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function forgotPasswordSubmit(email, code, newPassword) {
    isLoading.value = true
    error.value = null
    
    try {
      await confirmResetPassword({ 
        username: email, 
        confirmationCode: code, 
        newPassword 
      })
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Failed to reset password'
      console.error('Reset password error:', err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    isLoading,
    error,
    
    // Computed
    isAuthenticated,
    username,
    email,
    name,
    
    // Actions
    checkAuthState,
    signIn: signInUser,
    signUp: signUpUser,
    confirmSignUp: confirmSignUpUser,
    signOut: signOutUser,
    federatedSignIn,
    forgotPassword,
    forgotPasswordSubmit,
    clearError
  }
})