# GoHighLevel OAuth Flow Documentation

## Overview
This document explains the complete OAuth 2.0 flow implementation for GoHighLevel (GHL) integration.

## OAuth Flow Steps

### 1. **Initiate OAuth** (`/api/ghl/initiate-auth`)
- **Purpose**: Generate the authorization URL to redirect users to GHL's consent page
- **Request**:
  ```json
  {
    "brandId": "your-brand-id",
    "redirectUri": "http://localhost:3000/oauth/callback"
  }
  ```
- **Response**:
  ```json
  {
    "data": {
      "authorizationUrl": "https://marketplace.gohighlevel.com/oauth/chooselocation?..."
    }
  }
  ```
- **What happens**: The backend generates a unique `state` parameter and stores it with the brandId for security verification.

### 2. **User Authorization** (GHL's page)
- User clicks the authorization URL
- User logs into their GHL account
- User selects a location and grants permissions
- GHL redirects back to your callback URL with `code` and `state` parameters

### 3. **Token Exchange** (`/api/ghl/oauth/callback`)
- **Purpose**: Exchange the authorization code for access and refresh tokens
- **Triggered**: Automatically when the callback page receives `code` and `state`
- **Request**: GET request with query parameters
  ```
  GET /api/ghl/oauth/callback?code=abc123&state=xyz789
  ```
- **Response**:
  ```json
  {
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "def50200a1b2c3d4e5f6...",
      "expiresIn": 86400,
      "tokenType": "Bearer",
      "locationId": "location-id-from-ghl",
      "companyId": "company-id-from-ghl"
    }
  }
  ```
- **What happens**: 
  - Backend verifies the `state` parameter matches what was stored
  - Backend makes a POST request to GHL's token endpoint
  - Backend receives and stores the tokens in the database
  - Backend returns the token information to the frontend

### 4. **Using the Access Token**
Once you have the access token, you can make authenticated requests to GHL APIs:

#### Check Connection Status (`/api/ghl/status`)
```javascript
const response = await axios.get(`${API_URL}/ghl/status`, {
  params: { brandId }
});
```

#### Fetch Users (`/api/ghl/users`)
```javascript
const response = await axios.get(`${API_URL}/ghl/users`, {
  params: { brandId }
});
```

#### Fetch Calendar Events (`/api/ghl/calendar`)
```javascript
const response = await axios.get(`${API_URL}/ghl/calendar`, {
  params: {
    brandId,
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  }
});
```

## Frontend Implementation

### Callback Page (`/app/oauth/callback/page.tsx`)
The callback page automatically:
1. Extracts `code` and `state` from URL parameters
2. Calls the backend `/api/ghl/exchange-token` endpoint
3. Displays the received tokens and additional information
4. Shows loading states and error handling

### Key Features:
- **Automatic Token Exchange**: No manual action required
- **Visual Feedback**: Loading spinner during token exchange
- **Success/Error States**: Clear indication of success or failure
- **Token Display**: Shows all token details with copy-to-clipboard functionality
- **Parameter Display**: Shows original OAuth parameters for debugging

## Security Considerations

1. **State Parameter**: Used to prevent CSRF attacks
   - Generated on the backend during initiation
   - Verified during token exchange
   - Must match the original value

2. **Token Storage**: 
   - Access tokens are stored securely in the database
   - Refresh tokens are encrypted before storage
   - Tokens are associated with brandId for multi-tenant support

3. **HTTPS**: Always use HTTPS in production for:
   - Redirect URIs
   - API endpoints
   - Token transmission

## Environment Variables

Make sure to set these in your `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://backend.phonxai.com/api
```

For the backend, you'll need:
```env
GHL_CLIENT_ID=your-client-id
GHL_CLIENT_SECRET=your-client-secret
GHL_REDIRECT_URI=http://localhost:3000/oauth/callback
```

## Testing the Flow

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Enter your Brand ID** on the home page

3. **Click "Generate Auth URL"** to initiate OAuth

4. **Click the generated URL** to authorize with GHL

5. **Grant permissions** in the GHL interface

6. **Automatic redirect** back to `/oauth/callback`

7. **View tokens** - The page will automatically exchange the code and display tokens

## Token Refresh

When the access token expires (typically after 24 hours), you'll need to use the refresh token to get a new access token. This should be handled by your backend API automatically.

## Troubleshooting

### Common Issues:

1. **"State mismatch" error**
   - The state parameter doesn't match
   - Clear your browser cache and try again
   - Ensure cookies are enabled

2. **"Invalid redirect URI" error**
   - The redirect URI must exactly match what's configured in GHL
   - Check for trailing slashes
   - Verify the protocol (http vs https)

3. **"Failed to exchange code for tokens"**
   - The authorization code may have expired (they're single-use and short-lived)
   - Start the flow again from step 1

4. **No tokens displayed**
   - Check the browser console for errors
   - Verify the API_URL is correct
   - Ensure the backend is running and accessible

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/ghl/initiate-auth` | POST | Generate authorization URL |
| `/ghl/oauth/callback` | GET | Exchange code for tokens (with code & state params) |
| `/ghl/status` | GET | Check OAuth connection status |
| `/ghl/users` | GET | Fetch users from GHL |
| `/ghl/calendar` | GET | Fetch calendar events from GHL |

## Next Steps

After successfully obtaining tokens:
1. Store the tokens securely
2. Implement token refresh logic
3. Use the access token to make GHL API calls
4. Handle token expiration gracefully
5. Implement webhook handlers for real-time updates
