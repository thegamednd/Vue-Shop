# Single Sign-On (SSO) Configuration for RealmForge Shop

## Overview

The Shop application shares authentication with the main RealmForge Frontend application using AWS Cognito. This enables Single Sign-On (SSO) across subdomains.

## How SSO Works

### Production & Staging Environments

When deployed to production or staging, SSO works seamlessly:

1. **Shared User Pool**: Both applications use the same Cognito User Pool
2. **Cookie Domain Configuration**: Authentication cookies are set at the parent domain level:
   - Production: `.realmforge.io` (works for both `realmforge.io` and `shop.realmforge.io`)
   - Staging: `.dev.realmforge.io` (works for both `dev.realmforge.io` and `shop.dev.realmforge.io`)
3. **Automatic Authentication**: When a user logs in at `realmforge.io`, they're automatically authenticated at `shop.realmforge.io`

### Local Development

**Important**: SSO does NOT work on localhost due to browser security restrictions:
- Different ports (`localhost:8080` vs `localhost:8082`) are treated as different origins
- Cookies cannot be shared between different ports on localhost
- Users will need to log in separately on each localhost application

## Configuration Files

### 1. Amplify Configuration (`src/amplifyConfig.js`)

Handles environment detection and sets appropriate redirect URLs and cookie domains:

```javascript
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
```

### 2. Environment Variables

Each environment has its own `.env` file:

- `.env.development` - Local development (localhost:8082)
- `.env.staging` - Staging environment (shop.dev.realmforge.io)
- `.env.production` - Production environment (shop.realmforge.io)

All environments use the same Cognito User Pool configuration.

### 3. AWS Cognito Configuration

**Required Cognito Settings** (configured in AWS Console):

1. **Allowed Callback URLs**: Add all shop URLs
   ```
   http://localhost:8082/
   https://shop.dev.realmforge.io/
   https://shop.realmforge.io/
   ```

2. **Allowed Logout URLs**: Add all shop URLs
   ```
   http://localhost:8082/
   https://shop.dev.realmforge.io/
   https://shop.realmforge.io/
   ```

3. **Domain Configuration**: Ensure the OAuth domain is properly configured

## Authentication Flow

### Anonymous Browsing
- Users can browse products without logging in
- Cart functionality available without authentication
- Login required only for checkout and account access

### Protected Routes
- `/checkout` - Requires authentication
- `/account` - Requires authentication
- All other routes are publicly accessible

### Login Redirect
- When accessing protected routes, users are redirected to `/login`
- After successful login, they're returned to their intended destination
- The redirect path is stored in `sessionStorage`

## Auth Store (`src/stores/auth.js`)

The Pinia auth store manages authentication state:

- **State**: User object, loading state, error messages
- **Actions**: Sign in, sign up, sign out, federated login
- **Computed**: Authentication status, user details

## Testing SSO

### Local Testing (No SSO)
1. Start Frontend: `npm run dev` (port 8080)
2. Start Shop: `npm run dev` (port 8082)
3. Log in separately on each application

### Staging Testing (SSO Enabled)
1. Deploy to `dev.realmforge.io` and `shop.dev.realmforge.io`
2. Log in at `dev.realmforge.io`
3. Navigate to `shop.dev.realmforge.io` - should be automatically authenticated

### Production Testing (SSO Enabled)
1. Deploy to `realmforge.io` and `shop.realmforge.io`
2. Log in at `realmforge.io`
3. Navigate to `shop.realmforge.io` - should be automatically authenticated

## Troubleshooting

### User not authenticated across subdomains
1. Check cookie domain configuration in `amplifyConfig.js`
2. Verify Cognito callback URLs include all subdomains
3. Check browser developer tools for cookie settings

### Authentication state not persisting
1. Ensure cookies are not blocked by browser settings
2. Verify `secure` flag is set correctly (HTTPS only in production)
3. Check `sameSite` cookie attribute

### Local development issues
- This is expected - SSO doesn't work on localhost across different ports
- Use separate login sessions for testing

## Security Considerations

1. **Secure Cookies**: Always use secure cookies in production (HTTPS only)
2. **SameSite Policy**: Set to 'lax' to prevent CSRF attacks while allowing SSO
3. **Token Storage**: Tokens are stored in HTTP-only cookies, not localStorage
4. **Domain Restriction**: Cookies are restricted to `.realmforge.io` domains only