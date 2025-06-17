# GLOW App (PWA)

This repository contains a basic Next.js skeleton for the **GLOW** Progressive Web App. It integrates Firebase for authentication, Firestore and storage, and provides pages for uploading outfits and browsing events.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your Firebase configuration.
3. Run the development server:
   ```bash
   npm run dev
   ```

## Available Pages

- `/` – Home feed showing all outfits.
- `/login` – Sign up or log in with email and password.
- `/profile/[id]` – User profile page.
- `/upload` – Upload a new outfit.
- `/event/[name]` – All outfits for a specific event.
- `/settings` – Edit user profile fields.

This code provides a starting point and is not production ready. Further styling, validation and security hardening are required before deploying.
