// Shared authentication configuration for Shop subdomain
// This uses the same Cognito User Pool as the main Frontend app

// Detect environment based on hostname
const hostname = window.location.hostname;
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
const isDevShop = hostname === 'shop.dev.realmforge.io';
const isProdShop = hostname === 'shop.realmforge.io';

// Get redirect URLs based on environment
// For SSO to work across subdomains, we need to configure Cognito properly
const getRedirectUrls = () => {
  if (isLocal) {
    // Local development - can't share cookies across different ports
    // User will need to log in separately on localhost
    const currentUrl = 'http://localhost:8082/'; // Hardcoded for debugging
    console.log('🔧 Local dev redirect URL (hardcoded):', currentUrl);
    return {
      redirectSignIn: currentUrl,
      redirectSignOut: currentUrl
    };
  }
  
  if (isDevShop) {
    // Development shop subdomain
    return {
      redirectSignIn: 'https://shop.dev.realmforge.io/',
      redirectSignOut: 'https://shop.dev.realmforge.io/'
    };
  }
  
  if (isProdShop) {
    // Production shop subdomain
    return {
      redirectSignIn: 'https://shop.realmforge.io/',
      redirectSignOut: 'https://shop.realmforge.io/'
    };
  }
  
  // Fallback to environment variables
  return {
    redirectSignIn: import.meta.env.VITE_OAUTH_REDIRECT_SIGN_IN || window.location.origin,
    redirectSignOut: import.meta.env.VITE_OAUTH_REDIRECT_SIGN_OUT || window.location.origin
  };
};

const redirectUrls = getRedirectUrls();

// Amplify v6 configuration using the same User Pool as Frontend
const amplifyConfig = {
  Cognito: {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
    identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID,
    loginWith: {
      oauth: {
        domain: import.meta.env.VITE_COGNITO_DOMAIN,
        scopes: [
          "email",
          "openid", 
          "profile",
          "aws.cognito.signin.user.admin"
        ],
        redirectSignIn: [redirectUrls.redirectSignIn],
        redirectSignOut: [redirectUrls.redirectSignOut],
        responseType: "code",
        providers: ["Google"]
      },
      username: true,
      email: true
    },
    signUpVerificationMethod: "code",
    userAttributes: {
      email: {
        required: true
      },
      name: {
        required: false
      }
    },
    passwordFormat: {
      minLength: 8
    },
    // Cookie configuration for SSO
    cookieStorage: {
      domain: isLocal ? 'localhost' : 
              isDevShop ? '.dev.realmforge.io' : 
              isProdShop ? '.realmforge.io' : 
              window.location.hostname,
      path: '/',
      expires: 365,
      sameSite: 'lax',
      secure: !isLocal // Use secure cookies in production
    }
  }
};

export default amplifyConfig;