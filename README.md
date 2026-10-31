# Quality Paan & Shisha Luxury Suite

An ultra-luxury e-commerce platform and mobile application suite featuring handcrafted Egyptian & Russian Hookahs/Shisha, 100% herbal nicotine-free flavours, glass bongs & organic rolling papers, quad torch lighters & crystal ashtrays, and ambient Cambodian oud fragrances.

Powered by **Google Gemini 3.8 AI** for intelligent shisha sommelier guidance, flavour mixing ratios, Google Maps lounge discovery, and custom shisha artwork creation.

---

## 🚀 One-Click Deployments & Hosting

### Option 1: Vercel (Recommended & 100% Free)
1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Quality Paan & Shisha Suite"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/quality-shisha-suite.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New" > "Project"**.
3. Select your GitHub repository.
4. Framework Preset will auto-detect **Vite**.
5. Add the following **Environment Variables** in Vercel:
   - `GEMINI_API_KEY`: Your Gemini API key from [Google AI Studio](https://aistudio.google.com)
   - `VITE_GEMINI_API_KEY`: Your Gemini API key (client-side fallback)
   - `VITE_SUPABASE_URL` *(Optional)*: If you want cloud database sync
   - `VITE_SUPABASE_ANON_KEY` *(Optional)*: Supabase Anon Key
6. Click **Deploy**. The included `vercel.json` and `/api/index.ts` automatically configure SPA routing and serverless Gemini API endpoints.

---

### Option 2: Netlify (Free)
1. Connect your GitHub repository on [netlify.com](https://netlify.com).
2. The included `netlify.toml` file automatically configures:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - SPA 200 rewrite for `/index.html`
3. Add `GEMINI_API_KEY` and `VITE_GEMINI_API_KEY` in **Site configuration > Environment variables**.
4. Click **Deploy**.

---

### Option 3: Google Cloud Run (Free Tier: 2 Million Requests / Month)
Google Cloud Run provides a permanent free tier (2,000,000 requests/month, 360,000 GB-seconds memory).
1. Install [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) (`gcloud`).
2. Run in the root directory:
   ```bash
   gcloud run deploy quality-shisha \
     --source . \
     --port 3000 \
     --allow-unauthenticated \
     --set-env-vars GEMINI_API_KEY="YOUR_API_KEY"
   ```
3. Cloud Run will build using the included production `Dockerfile` and give you a live HTTPS URL.

---

## 🗄️ Database Architecture: Zero-Setup Local vs. Supabase

This application uses a **resilient hybrid database architecture**:

1. **Default: Zero-Config Local Database (Offline-Ready)**
   - All products, categories, shopping carts, orders, coupons, customer addresses, and CMS configurations persist directly inside the user's browser `localStorage`.
   - **No external database required!** The application will never crash or fail to load even with zero environment variables or zero cloud databases configured.

2. **Optional: Supabase PostgreSQL Cloud Sync**
   - If you want shared database persistence across different devices or live multi-user inventory:
     1. Create a free project on [supabase.com](https://supabase.com).
     2. Open the **SQL Editor** in Supabase and paste the contents of `supabase-schema.sql`.
     3. Click **Run**. All 5 categories (`hookah`, `flavours`, `bongs_rolls`, `lighters_ashtray`, `fragrances`) and tables (`products`, `orders`, `coupons`) will be created with Row Level Security (RLS) rules.
     4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env` or in the **Admin Dashboard > Settings**.

---

## ✨ AI Features Included

1. **AI Shisha Sommelier & Concierge** (`gemini-3.8-flash`):
   - Multi-turn conversation on herbal flavour pairings, bowl packing (dense vs. fluff pack), coconut coal heat management, and smoke-neutralizing oud mists.
   - Realistic voice synthesis powered by `gemini-3.8-flash-lite-tts`.

2. **Google Maps Shisha Lounge Finder** (`gemini-3.8-flash` with Google Maps Grounding):
   - Real-time location search for luxury shisha lounges, cafes, and smoke shops with direct Google Maps links and ratings.

3. **Herbal Flavour Mixology Blender**:
   - Computes golden ratios (e.g. 65% Brain Freeze + 35% Double Apple), density ratings, and one-click "Add Both to Cart".

4. **Gemini Image Creation & Editing Studio** (`gemini-3.1-flash-image`):
   - Custom hookah artwork, gold engraving concepts, and visual lounge atmosphere designs.

5. **Veo Smoke & Lounge Video Animator** (`veo-3.1-lite-generate-preview`):
   - Transforms product photos into 720p cinematic slow-motion smoke lounge videos.

6. **Interactive Mobile App Simulator**:
   - Replicates 4 interactive screens: Home Feed, Categories Grid, Product Detail View, and the new **Screen 4: AI Sommelier**.
