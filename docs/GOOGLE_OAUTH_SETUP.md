# Google OAuth Setup Guide

## Your Project Information
- **Project ID**: `1097275538443`
- **Project Name**: `groovy-design-118016`
- **Display Name**: `My Project`

## Steps to Get Google OAuth Client ID

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Select Your Project
- Make sure you're in the project: **groovy-design-118016** (ID: 1097275538443)

### 3. Enable Required APIs
1. Go to **APIs & Services** → **Library**
2. Search for and enable:
   - **Google+ API** (or **Google Identity API**)
   - **People API** (optional, for profile info)

### 4. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen first:
   - **User Type**: External (for testing) or Internal (for your organization)
   - **App name**: Urban Villages
   - **User support email**: Your email
   - **Developer contact**: Your email
   - Click **Save and Continue**
   - Add scopes: `openid`, `email`, `profile`
   - Add test users (if External): Your Google account email
   - Click **Save and Continue**

### 5. Create OAuth Client ID
1. **Application type**: Web application
2. **Name**: Urban Villages Web Client
3. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   ```
4. **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth/callback
   ```
5. Click **Create**
6. **Copy the Client ID** (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

### 6. Configure in Your App

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
```

Replace `your_client_id_here` with the Client ID you copied.

### 7. Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
pnpm dev
```

### 8. Test

1. Go to http://localhost:3000
2. Click "Continue with Google"
3. You should be redirected to Google's OAuth page
4. After authentication, you'll be redirected back
5. The app will derive a real SUI address from your Google account!

## For Production

When deploying, add these redirect URIs:
- `https://yourdomain.com/auth/callback`
- `https://www.yourdomain.com/auth/callback`

## Troubleshooting

### "redirect_uri_mismatch" Error
- Make sure the redirect URI in Google Console exactly matches: `http://localhost:3000/auth/callback`
- Check for trailing slashes or http vs https

### "Access blocked" Error
- If using External user type, add your email as a test user
- Or change to Internal if it's for your organization

### Still Using Mock Login
- Check that `.env.local` exists and has the correct variable name
- Restart the dev server after creating `.env.local`
- Check browser console for any errors

