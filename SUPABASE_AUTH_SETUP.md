# Supabase Authentication Setup Guide: Facebook & Instagram (Meta)

This guide explains why Instagram and Facebook sign-in were unavailable and provides the exact 2-minute steps to enable them in your **Supabase Project** (`jjovwmzigxwyncjjnabb`).

---

## 🔍 Why Sign-In Failed

1. **Facebook Provider Disabled**:
   When requesting sign-in with Facebook, Supabase returned:
   ```json
   {"code": 400, "error_code": "validation_failed", "msg": "Unsupported provider: provider is not enabled"}
   ```
   In contrast, your **Google OAuth provider** is already enabled and active (`302 Found` redirecting to Google Accounts).

2. **Instagram Runs on Meta (Facebook Login)**:
   Supabase does not have a standalone "Instagram" provider (`Provider instagram could not be found`). On the web, Instagram authentication is handled via **Meta / Facebook Login**. Enabling the Facebook provider in Supabase unlocks both Facebook and Instagram sign-in.

---

## 🚀 How to Enable Facebook & Instagram in Supabase

### Step 1: Create or Open a Meta App
1. Go to the [Meta for Developers Portal](https://developers.facebook.com/).
2. Log in and click **My Apps** → **Create App**.
3. Select **Authenticate and request data from users with Facebook Login** (or Consumer).
4. In the app settings under **Facebook Login** → **Settings**:
   - Enable **Client OAuth Login** and **Web OAuth Login**.
   - Add this exact URL to **Valid OAuth Redirect URIs**:
     ```
     https://jjovwmzigxwyncjjnabb.supabase.co/auth/v1/callback
     ```
   - Click **Save Changes**.
5. In **App Settings** → **Basic**:
   - Copy your **App ID** (this is your Client ID).
   - Copy your **App Secret** (click *Show*).

---

### Step 2: Enable Facebook in Your Supabase Dashboard
1. Open your project's Auth Providers directly:
   👉 **[Supabase Auth Providers Dashboard](https://supabase.com/dashboard/project/jjovwmzigxwyncjjnabb/auth/providers)**
2. Scroll to the **Facebook** provider row and expand it.
3. Toggle **"Enable Facebook provider"** to **ON**.
4. Paste:
   - **Client ID**: Your Meta App ID
   - **Client Secret**: Your Meta App Secret
5. Click **Save**.

---

### Step 3: Verify Your Redirect URLs in Supabase
1. In the Supabase Dashboard, go to **Authentication** → **URL Configuration**.
2. Under **Redirect URLs**, make sure your development and production URLs are added:
   - `http://localhost:3000/**`
   - `http://127.0.0.1:3000/**`
   - Your production domain (e.g. `https://your-domain.vercel.app/**`)
3. Click **Save**.

---

## 🎮 Instant Alternatives Available Now

While you configure Meta, all users can immediately:
- 🟢 **Sign In with Google**: Already 100% active on your Supabase backend.
- ⚡ **Play as Instant Guest**: One click, no account or credentials required.
- 👾 **Gamer Tag Profile**: Create any player name & avatar with banked stats, high scores, and coin tracking.
