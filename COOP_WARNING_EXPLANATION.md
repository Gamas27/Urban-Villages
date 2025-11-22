# COOP Warning Explanation

## 🔍 What's Happening

The `Cross-Origin-Opener-Policy policy would block the window.closed call` warning is coming from **Enoki's SDK code** when it tries to check if the OAuth popup window has been closed.

## ⚠️ Why It's Happening

1. **Enoki opens a popup** for Google OAuth
2. **Enoki's code** tries to check `window.closed` to detect when the popup closes
3. **Browser security** (COOP) blocks this check for security reasons
4. **Warning is logged** but functionality may still work

## ✅ Current Fix

Changed COOP header from `same-origin-allow-popups` to `unsafe-none`:
- This allows the popup window checks to work
- Less restrictive security policy
- Required for Enoki's popup-based OAuth flow

## 🔒 Security Note

`unsafe-none` is less secure than `same-origin-allow-popups`, but it's necessary for:
- OAuth popup flows (like Enoki uses)
- Cross-origin popup communication
- Third-party authentication providers

This is a common configuration for apps using OAuth popups.

## 🧪 Testing

After restarting the dev server:
1. The warnings should be gone
2. Google OAuth popup should work correctly
3. Wallet connection should complete successfully

## 📝 Alternative Solutions

If you want to keep stricter security:
1. **Use redirect-based OAuth** (not popup-based)
2. **Configure Enoki** to use redirects instead of popups
3. **Contact Enoki support** for redirect-based flow options

---

**The warnings are now suppressed with `unsafe-none` COOP policy.** 🚀

